// src/db/index.js
import Dexie from "dexie";

export const db = new Dexie("talentflowDB");

// Update the version from 3 to 4
db.version(4).stores({
    jobs: "id, slug, status, description",
    candidates: "id, jobId, stage",
    notes: "id, candidateId",
    assessments: "jobId",
    assessmentResponses: "id"
}).upgrade(tx => {
    // Migration logic for old data if needed
});
