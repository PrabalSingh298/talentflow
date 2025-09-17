// src/store/candidatesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../db";

// MODIFIED: This thunk now loads candidates directly from IndexedDB.
// Corrected loadCandidates thunk
export const loadCandidates = createAsyncThunk("candidates/load", async (filters = {}) => {
    let collection = db.candidates;

    // Start with the 'where' clause for stages as it's typically faster on indexed fields
    if (filters.stage) {
        collection = collection.where('stage').equals(filters.stage);
    }

    // Then apply the 'filter' clause for searching on the result of the 'where'
    if (filters.search) {
        collection = collection.filter(candidate =>
            candidate.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            candidate.email.toLowerCase().includes(filters.search.toLowerCase())
        );
    }

    // Now, run toArray() on the final, combined collection
    return await collection.toArray();
});

// MODIFIED: This thunk now updates a candidate's stage directly in IndexedDB.
export const updateCandidateStage = createAsyncThunk("candidates/updateStage", async ({ id, stage }, { rejectWithValue }) => {
    try {
        await db.candidates.update(id, { stage });
        const updatedCandidate = await db.candidates.get(id);
        return updatedCandidate;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// MODIFIED: This thunk now loads a single candidate directly from IndexedDB.
export const loadCandidateById = createAsyncThunk("candidates/loadById", async (id) => {
    const candidate = await db.candidates.get(id);
    if (!candidate) {
        throw new Error('Candidate not found');
    }
    return candidate;
});

// MODIFIED: This thunk now loads the timeline directly from the candidate object in IndexedDB.
export const loadTimelineByCandidateId = createAsyncThunk(
    "candidates/loadTimeline",
    async (candidateId) => {
        const candidate = await db.candidates.get(candidateId);
        if (!candidate || !candidate.timeline) {
            throw new Error('Timeline not found for candidate');
        }
        return candidate.timeline;
    }
);

// MODIFIED: This thunk now creates a new candidate directly in IndexedDB.
export const createCandidate = createAsyncThunk("candidates/create", async (candidate) => {
    const newCandidateId = await db.candidates.add(candidate);
    return { ...candidate, id: newCandidateId };
});

const candidatesSlice = createSlice({
    name: "candidates",
    initialState: {
        list: [],
        currentCandidate: null,
        currentTimeline: [],
        status: "idle",
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadCandidates.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loadCandidates.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list = action.payload;
            })
            .addCase(updateCandidateStage.fulfilled, (state, action) => {
                const index = state.list.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.list[index].stage = action.payload.stage;
                    state.list[index].timeline.push({
                        stage: action.payload.stage,
                        timestamp: new Date().toISOString(),
                    });
                }
            })
            .addCase(loadCandidateById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadCandidateById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentCandidate = action.payload;
            })
            .addCase(loadCandidateById.rejected, (state, action) => {
                state.status = 'failed';
                state.currentCandidate = null;
            })
            .addCase(loadTimelineByCandidateId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadTimelineByCandidateId.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentTimeline = action.payload;
            })
            .addCase(loadTimelineByCandidateId.rejected, (state, action) => {
                state.status = 'failed';
                state.currentTimeline = [];
            })
            .addCase(createCandidate.fulfilled, (state, action) => {
                // MODIFIED: Use unshift instead of push to add the new candidate to the beginning
                state.list.unshift(action.payload);
            });
    },
});

export default candidatesSlice.reducer;