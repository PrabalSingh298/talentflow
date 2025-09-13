import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../db";

// Load candidates from IndexedDB
export const loadCandidates = createAsyncThunk("candidates/load", async () => {
    return await db.candidates.toArray();
});

// Add candidate
export const addCandidate = createAsyncThunk(
    "candidates/add",
    async (candidate) => {
        await db.candidates.add(candidate);
        return candidate;
    }
);

// Update candidate (e.g., stage change, profile update)
export const updateCandidate = createAsyncThunk(
    "candidates/update",
    async (candidate) => {
        await db.candidates.put(candidate);
        return candidate;
    }
);

// Delete candidate
export const deleteCandidate = createAsyncThunk(
    "candidates/delete",
    async (id) => {
        await db.candidates.delete(id);
        return id;
    }
);

const candidatesSlice = createSlice({
    name: "candidates",
    initialState: {
        list: [],
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
            .addCase(addCandidate.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateCandidate.fulfilled, (state, action) => {
                const index = state.list.findIndex(
                    (c) => c.id === action.payload.id
                );
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(deleteCandidate.fulfilled, (state, action) => {
                state.list = state.list.filter((c) => c.id !== action.payload);
            });
    },
});

export default candidatesSlice.reducer;
