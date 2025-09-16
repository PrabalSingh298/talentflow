// src/store/assessmentResponsesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const submitAssessmentResponse = createAsyncThunk("assessments/submitResponse", async ({ jobId, responseData }) => {
    const response = await fetch(`/api/assessments/${jobId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseData),
    });
    if (!response.ok) {
        throw new Error('Failed to submit response');
    }
    return response.json();
});

const assessmentResponsesSlice = createSlice({
    name: "assessmentResponses",
    initialState: {
        list: [],
        status: "idle",
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitAssessmentResponse.fulfilled, (state, action) => {
                state.list.push(action.payload);
            });
    },
});


export default assessmentResponsesSlice.reducer;