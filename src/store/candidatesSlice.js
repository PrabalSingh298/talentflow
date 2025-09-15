// src/store/candidatesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loadCandidates = createAsyncThunk("candidates/load", async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.stage) params.append('stage', filters.stage);

    const response = await fetch(`/api/candidates?${params.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to load candidates');
    }
    return response.json();
});

export const updateCandidateStage = createAsyncThunk("candidates/updateStage", async ({ id, stage }, { rejectWithValue }) => {
    const response = await fetch(`/api/candidates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage }),
    });
    if (!response.ok) {
        return rejectWithValue(await response.json());
    }
    return response.json();
});

export const loadCandidateById = createAsyncThunk("candidates/loadById", async (id) => {
    const response = await fetch(`/api/candidates/${id}`);
    if (!response.ok) {
        throw new Error('Failed to load candidate');
    }
    return response.json();
});

export const loadTimelineByCandidateId = createAsyncThunk(
    "candidates/loadTimeline",
    async (candidateId) => {
        const response = await fetch(`/api/candidates/${candidateId}/timeline`);
        if (!response.ok) {
            throw new Error('Failed to load timeline');
        }
        return response.json();
    }
);

// New: Async thunk to create a new candidate
export const createCandidate = createAsyncThunk("candidates/create", async (candidate) => {
    const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate),
    });
    if (!response.ok) {
        throw new Error('Failed to create candidate');
    }
    return response.json();
});

const candidatesSlice = createSlice({
    name: "candidates",
    initialState: {
        list: [],
        currentCandidate: null,
        currentTimeline: [], // New state property for the timeline
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
            // New: Handle the creation of a new candidate
            .addCase(createCandidate.fulfilled, (state, action) => {
                state.list.push(action.payload);
            });
    },
});


export default candidatesSlice.reducer;