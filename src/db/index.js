import Dexie from "dexie";

export const db = new Dexie("talentflowDB");

db.version(1).stores({
    jobs: "id, slug, status",
    candidates: "id, jobId, stage",
    notes: "id, candidateId",
    assessments: "jobId",
    assessmentResponses: "id, [jobId+candidateId]"
});
