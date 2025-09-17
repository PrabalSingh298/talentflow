// src/store/assessmentsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../db";

// This thunk is already correct. It loads all assessments directly from IndexedDB.
export const loadAssessments = createAsyncThunk("assessments/loadAll", async () => {
    return await db.assessments.toArray();
});

// MODIFIED: This thunk now gets a single assessment directly from IndexedDB.
export const loadAssessment = createAsyncThunk("assessments/load", async (jobId) => {
    // Replaced the 'fetch' call with a direct Dexie query.
    const assessment = await db.assessments.get({ jobId: jobId });
    if (!assessment) {
        throw new Error('Assessment not found');
    }
    return assessment;
});

// MODIFIED: This thunk now saves a NEW assessment directly to IndexedDB.
export const saveNewAssessment = createAsyncThunk("assessments/saveNew", async (assessment) => {
    // Replaced the 'fetch' call with a direct Dexie `add` method.
    const newAssessmentId = await db.assessments.add(assessment);
    // Return the newly added assessment, including its generated ID.
    return { ...assessment, id: newAssessmentId };
});

// MODIFIED: This thunk now updates an existing assessment directly in IndexedDB.
export const saveAssessment = createAsyncThunk("assessments/save", async (assessment) => {
    // Replaced the 'fetch' call with a direct Dexie `put` or `update` method.
    // Assuming 'jobId' is the primary key.
    await db.assessments.put(assessment);
    // Return the updated assessment to sync the Redux state.
    return assessment;
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
            // Handle saving a new assessment
            .addCase(saveNewAssessment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.current = action.payload;
                // Add the new assessment to the list for UI consistency
                state.list.push(action.payload);
            })
            .addCase(saveAssessment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.current = action.payload;
                // Update the assessment in the list for UI consistency
                const index = state.list.findIndex(
                    (a) => a.jobId === action.payload.jobId
                );
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            });
    },
});

export const { clearAssessment } = assessmentsSlice.actions;

export default assessmentsSlice.reducer;