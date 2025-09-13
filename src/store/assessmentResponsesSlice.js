import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../db";

// Load responses for a candidate on a job
export const loadResponses = createAsyncThunk(
    "assessmentResponses/load",
    async ({ jobId, candidateId }) => {
        return await db.assessmentResponses.get(`${jobId}-${candidateId}`);
    }
);

// Save (add/update) responses
export const saveResponses = createAsyncThunk(
    "assessmentResponses/save",
    async ({ jobId, candidateId, responses }) => {
        const record = { id: `${jobId}-${candidateId}`, jobId, candidateId, responses };
        await db.assessmentResponses.put(record);
        return record;
    }
);

// Delete responses
export const deleteResponses = createAsyncThunk(
    "assessmentResponses/delete",
    async ({ jobId, candidateId }) => {
        await db.assessmentResponses.delete(`${jobId}-${candidateId}`);
        return { jobId, candidateId };
    }
);

const assessmentResponsesSlice = createSlice({
    name: "assessmentResponses",
    initialState: {
        current: null,   // currently loaded responses
        status: "idle",
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadResponses.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loadResponses.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.current = action.payload || null;
            })
            .addCase(saveResponses.fulfilled, (state, action) => {
                state.current = action.payload;
            })
            .addCase(deleteResponses.fulfilled, (state, action) => {
                if (
                    state.current?.jobId === action.payload.jobId &&
                    state.current?.candidateId === action.payload.candidateId
                ) {
                    state.current = null;
                }
            });
    },
});

export default assessmentResponsesSlice.reducer;
