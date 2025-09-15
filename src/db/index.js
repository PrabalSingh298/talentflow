import Dexie from "dexie";

export const db = new Dexie("talentflowDB");

db.version(1).stores({
    jobs: "id, slug, status, description",
    candidates: "id, jobId, stage",
    notes: "id, candidateId",
    assessments: "jobId",
    assessmentResponses: "id"
}).upgrade(tx => {
    // This is a special method to handle the migration.
    // When upgrading, you must handle existing data.
    // For this simple case, we'll just add an empty string to existing jobs.
    return tx.jobs.toCollection().modify(job => {
        if (!job.description) {
            job.description = '';
        }
    });
});;
