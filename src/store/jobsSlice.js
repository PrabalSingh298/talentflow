// src/store/jobsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from "../db";

// MODIFIED: This thunk now handles filtering, pagination, and sorting directly from IndexedDB.
export const loadJobs = createAsyncThunk("jobs/load", async (filters = {}) => {
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

    // You can implement sorting and pagination with Dexie methods as well.
    if (filters.sort) {
        if (filters.sort === 'title') {
            collection = collection.sortBy('title');
        }
        // Add more sorting options as needed
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
});

// MODIFIED: This thunk now adds a job directly to IndexedDB.
export const addJob = createAsyncThunk('jobs/add', async (job) => {
    // Add an 'order' property to the new job based on the current job count
    const lastOrder = await db.jobs.count();
    const newJob = { ...job, order: lastOrder + 1 };
    const id = await db.jobs.add(newJob);
    return { ...newJob, id };
});

// MODIFIED: This thunk now updates a job directly in IndexedDB.
export const updateJob = createAsyncThunk('jobs/update', async (job) => {
    await db.jobs.put(job);
    return job;
});

// MODIFIED: This thunk now deletes a job directly from IndexedDB.
export const deleteJob = createAsyncThunk('jobs/delete', async (id) => {
    await db.jobs.delete(id);
    return id;
});

// MODIFIED: This thunk now handles reordering directly in IndexedDB.
export const reorderJob = createAsyncThunk(
    "jobs/reorder",
    async ({ id, fromOrder, toOrder }) => {
        if (fromOrder === toOrder) {
            // No change needed
            return await db.jobs.toArray();
        }

        const transaction = db.transaction('rw', db.jobs);
        try {
            const movedJob = await db.jobs.get(id);

            // Find jobs affected by the reorder
            let affectedJobs;
            if (fromOrder < toOrder) {
                // Moving down, increment orders of jobs in between
                affectedJobs = await db.jobs.where('order').between(fromOrder + 1, toOrder).toArray();
                await Promise.all(affectedJobs.map(job => db.jobs.update(job.id, { order: job.order - 1 })));
            } else {
                // Moving up, decrement orders of jobs in between
                affectedJobs = await db.jobs.where('order').between(toOrder, fromOrder - 1).toArray();
                await Promise.all(affectedJobs.map(job => db.jobs.update(job.id, { order: job.order + 1 })));
            }

            // Update the moved job's order
            await db.jobs.update(id, { order: toOrder });

            await transaction.commit();
        } catch (error) {
            transaction.abort();
            throw error;
        }

        return await db.jobs.toArray();
    }
);

// MODIFIED: This thunk now loads a single job by ID directly from IndexedDB.
export const loadJobById = createAsyncThunk(
    "jobs/loadById",
    async (id) => {
        const job = await db.jobs.get(id);
        if (!job) {
            throw new Error('Failed to load job');
        }
        return job;
    }
);

const jobsSlice = createSlice({
    name: 'jobs',
    initialState: {
        list: [],
        currentJob: null,
        totalCount: 0,
        status: 'idle',
        currentPage: 1,
        pageSize: 10,
        availableStatuses: ['active', 'archived', 'inactive'],
    },
    reducers: {
        optimisticReorder: (state, action) => {
            const { fromOrder, toOrder } = action.payload;
            const jobs = [...state.list];
            const movedJobIndex = jobs.findIndex(j => j.order === fromOrder);
            const [movedJob] = jobs.splice(movedJobIndex, 1);
            jobs.splice(toOrder - 1, 0, movedJob);
            state.list = jobs.map((job, index) => ({ ...job, order: index + 1 }));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadJobs.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadJobs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload.data;
                state.totalCount = action.payload.totalCount;
                state.currentPage = action.payload.page;
                state.pageSize = action.payload.pageSize;
            })
            .addCase(addJob.fulfilled, (state, action) => {
                // Assuming you handle adding the new job to the list in a separate reducer or by re-fetching
            })
            .addCase(updateJob.fulfilled, (state, action) => {
                const index = state.list.findIndex((j) => j.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(deleteJob.fulfilled, (state, action) => {
                state.list = state.list.filter((job) => job.id !== action.payload);
            })
            .addCase(reorderJob.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload.sort((a, b) => a.order - b.order);
            })
            .addCase(reorderJob.rejected, (state, action) => {
                state.status = 'failed';
            })
            .addCase(loadJobById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadJobById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentJob = action.payload;
            })
            .addCase(loadJobById.rejected, (state, action) => {
                state.status = 'failed';
                state.currentJob = null;
            });
    },
});

export const { optimisticReorder } = jobsSlice.actions;
export default jobsSlice.reducer;