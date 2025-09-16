// src/store/assessmentsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../db";

export const loadAssessments = createAsyncThunk("assessments/loadAll", async () => {
    return await db.assessments.toArray();
});

export const loadAssessment = createAsyncThunk("assessments/load", async (jobId) => {
    const response = await fetch(`/api/assessments/${jobId}`);
    if (!response.ok) {
        throw new Error('Failed to load assessment');
    }
    return response.json();
});

// New: Thunk to save a NEW assessment (POST)
export const saveNewAssessment = createAsyncThunk("assessments/saveNew", async (assessment) => {
    const response = await fetch(`/api/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessment),
    });
    if (!response.ok) {
        throw new Error('Failed to save assessment');
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
        list: [],
        current: null,
        status: "idle",
    },
    reducers: {
        clearAssessment: (state) => {
            state.current = null;
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadAssessments.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loadAssessments.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list = action.payload;
            })
            .addCase(loadAssessment.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loadAssessment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.current = action.payload;
            })
            // New: Handle saving a new assessment
            .addCase(saveNewAssessment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.current = action.payload;
            })
            .addCase(saveAssessment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.current = action.payload;
            });
    },
});

export const { clearAssessment } = assessmentsSlice.actions;

export default assessmentsSlice.reducer;