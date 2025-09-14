// src/mocks/handlers.js
import { http, HttpResponse, passthrough } from 'msw';
import { db } from '../db';
import { nanoid } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:5173';

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
    // This tells MSW to ignore all requests for files inside the /src/assets/ directory
    http.get('http://localhost:5173/src/assets/*', () => passthrough()),

    // GET /api/jobs
    http.get(`${API_BASE}/api/jobs`, async ({ request }) => {
        await delay(500);

        const url = new URL(request.url);
        const title = url.searchParams.get('search');
        const status = url.searchParams.get('status');
        const sort = url.searchParams.get('sort');
        const page = getNumericParam(url, 'page', 1);
        const pageSize = getNumericParam(url, 'pageSize', 10);

        let jobs = await db.jobs.toArray();

        // 1. Apply Filters
        if (title) {
            jobs = jobs.filter(job => job.title.toLowerCase().includes(title.toLowerCase()));
        }
        if (status) {
            jobs = jobs.filter(job => job.status === status);
        }

        // 2. Apply Sorting
        if (sort === 'title') {
            jobs.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sort === 'date') {
            // Assuming jobs have a 'createdAt' timestamp
            // jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        // 3. Apply Pagination
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
    http.get(`${API_BASE}/api/jobs/:jobId`, async ({ params }) => {
        await delay(500);
        const { jobId } = params;
        const job = await db.jobs.get(jobId);
        if (!job) {
            return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
        }
        return HttpResponse.json(job);
    }),

    // POST /api/jobs
    http.post(`${API_BASE}/api/jobs`, async ({ request }) => {
        await delay(700);
        if (withError()) {
            return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
        }
        const newJob = { ...await request.json(), id: nanoid() };
        await db.jobs.add(newJob);
        return HttpResponse.json(newJob, { status: 201 });
    }),

    // PUT /api/jobs/:jobId
    http.put(`${API_BASE}/api/jobs/:jobId`, async ({ request, params }) => {
        await delay(700);
        if (withError()) {
            return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
        }
        const { jobId } = params;
        const updatedJob = { ...await request.json(), id: jobId };
        await db.jobs.put(updatedJob);
        return HttpResponse.json(updatedJob);
    }),

    // PATCH /api/jobs/reorder (Note: this is the old bulk reorder endpoint)
    http.patch(`${API_BASE}/api/jobs/reorder`, async ({ request }) => {
        await delay(700);
        if (withError()) {
            return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
        }
        const reorderedJobs = await request.json();
        await db.jobs.bulkPut(reorderedJobs);
        return HttpResponse.json(reorderedJobs);
    }),

    // DELETE /api/jobs/:jobId
    http.delete(`${API_BASE}/api/jobs/:jobId`, async ({ params }) => {
        await delay(700);
        if (withError()) {
            return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
        }
        const { jobId } = params;
        await db.jobs.delete(jobId);
        return new HttpResponse(null, { status: 200 });
    }),

    // --- New PATCH endpoint for single job reorder ---
    http.patch(`${API_BASE}/api/jobs/:jobId/reorder`, async ({ request, params }) => {
        console.log("PATCH /api/jobs/:jobId/reorder handler called.");
        await delay(700);
        // Simulate a random failure for rollback testing
        if (withError()) {
            console.log("Reorder API call failed.");
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

        console.log("Reorder API call succeeded. Returning updated jobs list.");
        return HttpResponse.json(finalJobs);
    }),
];