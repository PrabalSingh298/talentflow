// src/db/index.js
import Dexie from "dexie";

export const db = new Dexie("talentflowDB");

// Update the version from 4 to 5
db.version(5).stores({
    jobs: "id, slug, status, description",
    candidates: "id, jobId, stage",
    notes: "id, candidateId",
    assessments: "jobId",
    assessmentResponses: "id"
}).upgrade(tx => {
    // Migration logic for old data if needed
});