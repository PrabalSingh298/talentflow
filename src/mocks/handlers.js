// src/mocks/handlers.js
import { http, HttpResponse, passthrough } from 'msw';
import { db } from '../db';
import { nanoid } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:5173/api';

const getNumericParam = (url, paramName, defaultValue) => {
    const value = url.searchParams.get(paramName);
    return value ? parseInt(value, 10) : defaultValue;
};

// Utility to simulate network delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Utility to simulate random write failures
const withError = () => {
    return Math.random() < 0.1; // 10% chance of failure
};

export const handlers = [
    // Passthrough handler for static assets
    http.get('http://localhost:5173/src/assets/*', () => passthrough()),

    // GET /api/jobs
    http.get(`${API_BASE}/jobs*`, async ({ request }) => {
        await delay(500);

        const url = new URL(request.url);
        const search = url.searchParams.get('search');
        const status = url.searchParams.get('status');
        const sort = url.searchParams.get('sort');
        const page = getNumericParam(url, 'page', 1);
        const pageSize = getNumericParam(url, 'pageSize', 10);

        let jobs = await db.jobs.toArray();

        if (search) {
            jobs = jobs.filter(job => job.title.toLowerCase().includes(search.toLowerCase()));
        }
        if (status) {
            jobs = jobs.filter(job => job.status === status);
        }

        if (sort === 'title') {
            jobs.sort((a, b) => a.title.localeCompare(b.title));
        }

        const startIndex = (page - 1) * pageSize;
        const paginatedJobs = jobs.slice(startIndex, startIndex + pageSize);

        return HttpResponse.json({
            data: paginatedJobs,
            totalCount: jobs.length,
            page,
            pageSize
        });
    }),

    // GET /api/jobs/:jobId
    http.get(`${API_BASE}/jobs/:jobId`, async ({ params }) => {
        await delay(500);
        const { jobId } = params;
        const job = await db.jobs.get(jobId);
        if (!job) {
            return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
        }
        return HttpResponse.json(job);
    }),

    // POST /api/jobs
    http.post(`${API_BASE}/jobs`, async ({ request }) => {
        await delay(700);
        if (withError()) {
            return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
        }
        const newJob = { ...await request.json(), id: nanoid() };
        await db.jobs.add(newJob);
        return HttpResponse.json(newJob, { status: 201 });
    }),

    // PUT /api/jobs/:jobId
    http.put(`${API_BASE}/jobs/:jobId`, async ({ request, params }) => {
        await delay(700);
        if (withError()) {
            return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
        }
        const { jobId } = params;
        const updatedJob = { ...await request.json(), id: jobId };
        await db.jobs.put(updatedJob);
        return HttpResponse.json(updatedJob);
    }),

    // PATCH /api/jobs/reorder (old bulk reorder)
    http.patch(`${API_BASE}/jobs/reorder`, async ({ request }) => {
        await delay(700);
        if (withError()) {
            return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
        }
        const reorderedJobs = await request.json();
        await db.jobs.bulkPut(reorderedJobs);
        return HttpResponse.json(reorderedJobs);
    }),

    // DELETE /api/jobs/:jobId
    http.delete(`${API_BASE}/jobs/:jobId`, async ({ params }) => {
        await delay(700);
        if (withError()) {
            return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
        }
        const { jobId } = params;
        await db.jobs.delete(jobId);
        return new HttpResponse(null, { status: 200 });
    }),

    // PATCH /api/jobs/:jobId/reorder (single job reorder)
    http.patch(`${API_BASE}/jobs/:jobId/reorder`, async ({ request, params }) => {
        await delay(700);
        if (withError()) {
            return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
        }

        const { jobId } = params;
        const { fromOrder, toOrder } = await request.json();
        let jobs = await db.jobs.toArray();
        const movedJob = jobs.find(j => j.id === jobId);
        if (!movedJob) {
            return new HttpResponse(null, { status: 404, statusText: 'Job not found' });
        }

        const direction = fromOrder < toOrder ? 'down' : 'up';
        if (direction === 'down') {
            jobs = jobs.map(j => {
                if (j.order > fromOrder && j.order <= toOrder) {
                    return { ...j, order: j.order - 1 };
                }
                return j;
            });
        } else {
            jobs = jobs.map(j => {
                if (j.order < fromOrder && j.order >= toOrder) {
                    return { ...j, order: j.order + 1 };
                }
                return j;
            });
        }
        const finalJobs = jobs.map(j => {
            if (j.id === jobId) {
                return { ...j, order: toOrder };
            }
            return j;
        });

        await db.jobs.bulkPut(finalJobs);
        return HttpResponse.json(finalJobs);
    }),

    // GET /api/candidates
    http.get(`${API_BASE}/candidates`, async ({ request }) => {
        await delay(500);
        const url = new URL(request.url);
        const search = url.searchParams.get('search');
        const stage = url.searchParams.get('stage');
        let candidates = await db.candidates.toArray();

        if (search) {
            candidates = candidates.filter(c =>
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.email.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (stage) {
            candidates = candidates.filter(c => c.stage === stage);
        }
        return HttpResponse.json(candidates);
    }),

    // GET /api/candidates/:id
    http.get(`${API_BASE}/candidates/:id`, async ({ params }) => {
        await delay(500);
        const candidate = await db.candidates.get(params.id);
        if (!candidate) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(candidate);
    }),

    // New: POST /api/candidates
    http.post(`${API_BASE}/candidates`, async ({ request }) => {
        await delay(700);
        if (withError()) {
            return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
        }

        const newCandidate = { ...await request.json(), id: `cand-${nanoid()}` };
        await db.candidates.add(newCandidate);

        return HttpResponse.json(newCandidate, { status: 201 });
    }),

    // PATCH /api/candidates/:id (for stage transitions)
    http.patch(`${API_BASE}/candidates/:id`, async ({ request, params }) => {
        await delay(700);
        if (withError()) return new HttpResponse(null, { status: 500 });
        const { id } = params;
        const updates = await request.json();
        await db.candidates.update(id, updates);
        const updatedCandidate = await db.candidates.get(id);
        return HttpResponse.json(updatedCandidate);
    }),

    // GET /api/candidates/:id/timeline
    http.get(`${API_BASE}/candidates/:id/timeline`, async ({ params }) => {
        await delay(500);
        const candidate = await db.candidates.get(params.id);
        if (!candidate) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(candidate.timeline);
    }),

    // New: POST /api/notes
    http.post(`${API_BASE}/notes`, async ({ request }) => {
        await delay(700);
        if (withError()) {
            return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
        }

        const newNote = { ...await request.json(), id: `note-${nanoid()}` };
        await db.notes.add(newNote);

        return HttpResponse.json(newNote, { status: 201 });
    }),
];