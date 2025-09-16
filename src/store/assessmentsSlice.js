// src/store/assessmentsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loadAssessment = createAsyncThunk("assessments/load", async (jobId) => {
    const response = await fetch(`/api/assessments/${jobId}`);
    if (!response.ok) {
        throw new Error('Failed to load assessment');
    }
    return response.json();
});

export const saveAssessment = createAsyncThunk("assessments/save", async (assessment) => {
    const response = await fetch(`/api/assessments/${assessment.jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessment),
    });
    if (!response.ok) {
        throw new Error('Failed to save assessment');
    }
    return response.json();
});

const assessmentsSlice = createSlice({
    name: "assessments",
    initialState: {
        current: null,
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
                state.current = action.payload;
            })
            .addCase(saveAssessment.fulfilled, (state, action) => {
                state.current = action.payload;
            });
    },
});


export default assessmentsSlice.reducer;