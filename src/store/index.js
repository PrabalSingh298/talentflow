import { configureStore } from "@reduxjs/toolkit";
import jobsReducer from "./jobsSlice";
import candidatesReducer from "./candidatesSlice";
import assessmentsReducer from "./assessmentsSlice";
import assessmentResponsesReducer from "./assessmentResponsesSlice";
import notesReducer from "./notesSlice";

export const store = configureStore({
    reducer: {
        jobs: jobsReducer, // we’ll add candidates, assessments later
        candidates: candidatesReducer,
        assessments: assessmentsReducer,
        assessmentResponses: assessmentResponsesReducer,
        notes: notesReducer,

    },
});
