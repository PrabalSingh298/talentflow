// src/dbService.js
import { db } from "./db";

// ======================= Job Handlers =======================
export const jobHandlers = {
    // Fetches all jobs with optional filters, pagination, and sorting
    async loadAll(filters = {}) {
        let collection = db.jobs;

        if (filters.search) {
            collection = collection.filter(job => job.title.toLowerCase().includes(filters.search.toLowerCase()));
        }
        if (filters.status) {
            collection = collection.where('status').equals(filters.status);
        }
        if (filters.tags) {
            collection = collection.filter(job =>
                Array.isArray(job.tags) && job.tags.some(tag => filters.tags.includes(tag))
            );
        }

        if (filters.sort === 'title') {
            collection = collection.sortBy('title');
        }

        const totalCount = await collection.count();

        if (filters.page && filters.pageSize) {
            const offset = (filters.page - 1) * filters.pageSize;
            collection = collection.offset(offset).limit(filters.pageSize);
        }

        const data = await collection.toArray();

        return {
            data,
            totalCount,
            page: filters.page || 1,
            pageSize: filters.pageSize || totalCount
        };
    },

    // Fetches a single job by its ID
    async loadById(jobId) {
        return await db.jobs.get(jobId);
    },

    // Adds a new job to the database
    async add(job) {
        const lastOrder = await db.jobs.count();
        const newJob = { ...job, order: lastOrder + 1 };
        const id = await db.jobs.add(newJob);
        return { ...newJob, id };
    },

    // Updates an existing job in the database
    async update(job) {
        await db.jobs.put(job);
        return job;
    },

    // Deletes a job by its ID
    async remove(jobId) {
        await db.jobs.delete(jobId);
        return jobId;
    },

    // Reorders a job and updates the order of other affected jobs
    async reorder({ id, fromOrder, toOrder }) {
        if (fromOrder === toOrder) {
            return await db.jobs.toArray();
        }

        const transaction = db.transaction('rw', db.jobs);
        try {
            if (fromOrder < toOrder) {
                await db.jobs.where('order').between(fromOrder + 1, toOrder).modify(job => ({ order: job.order - 1 }));
            } else {
                await db.jobs.where('order').between(toOrder, fromOrder - 1).modify(job => ({ order: job.order + 1 }));
            }
            await db.jobs.update(id, { order: toOrder });
            await transaction.commit();
        } catch (error) {
            transaction.abort();
            throw error;
        }

        return await db.jobs.toArray();
    }
};

// ======================= Candidate Handlers =======================
export const candidateHandlers = {
    // Fetches all candidates with optional filters
    async loadAll(filters = {}) {
        let collection = db.candidates;

        if (filters.search) {
            collection = collection.filter(c => c.name.toLowerCase().includes(filters.search.toLowerCase()));
        }
        if (filters.stage) {
            collection = collection.where('stage').equals(filters.stage);
        }

        return await collection.toArray();
    },

    // Fetches a single candidate by ID
    async loadById(id) {
        return await db.candidates.get(id);
    },

    // Fetches a candidate's timeline by their ID
    async loadTimelineById(candidateId) {
        const candidate = await db.candidates.get(candidateId);
        return candidate?.timeline || [];
    },

    // Updates a candidate's stage
    async updateStage(id, stage) {
        await db.candidates.update(id, { stage });
        return await db.candidates.get(id);
    },

    // Adds a new candidate
    async add(candidate) {
        const id = await db.candidates.add(candidate);
        return { ...candidate, id };
    }
};

// ======================= Assessment Handlers =======================
export const assessmentHandlers = {
    // Fetches all assessments
    async loadAll() {
        return await db.assessments.toArray();
    },

    // Fetches a single assessment by jobId
    async loadById(jobId) {
        return await db.assessments.get({ jobId });
    },

    // Adds a new assessment
    async add(assessment) {
        const id = await db.assessments.add(assessment);
        return { ...assessment, id };
    },

    // Updates an existing assessment
    async update(assessment) {
        await db.assessments.put(assessment);
        return assessment;
    }
};

// ======================= Note Handlers =======================
export const noteHandlers = {
    // Fetches notes for a specific candidate
    async loadByCandidateId(candidateId) {
        return await db.notes.where("candidateId").equals(candidateId).toArray();
    },

    // Adds a new note
    async add(note) {
        const id = await db.notes.add(note);
        return { ...note, id };
    },

    // Updates an existing note
    async update(note) {
        await db.notes.put(note);
        return note;
    },

    // Deletes a note
    async remove(id) {
        await db.notes.delete(id);
        return id;
    }
};