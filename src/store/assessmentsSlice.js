import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../db";

// Load assessments by jobId
export const loadAssessment = createAsyncThunk(
    "assessments/load",
    async (jobId) => {
        return await db.assessments.get(jobId); // one assessment per job
    }
);

// Add or update assessment
export const saveAssessment = createAsyncThunk(
    "assessments/save",
    async (assessment) => {
        await db.assessments.put(assessment); // put = add or update
        return assessment;
    }
);

// Delete assessment
export const deleteAssessment = createAsyncThunk(
    "assessments/delete",
    async (jobId) => {
        await db.assessments.delete(jobId);
        return jobId;
    }
);

const assessmentsSlice = createSlice({
    name: "assessments",
    initialState: {
        current: null, // assessment for the selected job
        status: "idle",
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadAssessment.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loadAssessment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.current = action.payload || null;
            })
            .addCase(saveAssessment.fulfilled, (state, action) => {
                state.current = action.payload;
            })
            .addCase(deleteAssessment.fulfilled, (state, action) => {
                if (state.current?.jobId === action.payload) {
                    state.current = null;
                }
            });
    },
});

export default assessmentsSlice.reducer;
