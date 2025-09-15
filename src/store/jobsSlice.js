// src/store/jobsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Load jobs from the mock API
export const loadJobs = createAsyncThunk("jobs/load", async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.tags) params.append('tags', filters.tags.join(','));
    if (filters.page) params.append('page', filters.page);
    if (filters.pageSize) params.append('pageSize', filters.pageSize);
    if (filters.sort) params.append('sort', filters.sort);

    const url = `/api/jobs?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to load jobs');
    }
    return response.json();
});

// Add job via the mock API
export const addJob = createAsyncThunk('jobs/add', async (job) => {
    const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
    });
    if (!response.ok) {
        throw new Error('Failed to add job');
    }
    return response.json();
});

// Update job via the mock API
export const updateJob = createAsyncThunk('jobs/update', async (job) => {
    const response = await fetch(`/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
    });
    if (!response.ok) {
        throw new Error('Failed to update job');
    }
    return response.json();
});

// Delete job via the mock API
export const deleteJob = createAsyncThunk('jobs/delete', async (id) => {
    const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete job');
    }
    return id;
});

// Async thunk for reordering a job
export const reorderJob = createAsyncThunk(
    "jobs/reorder",
    async ({ id, fromOrder, toOrder }, { rejectWithValue }) => {
        const response = await fetch(`/api/jobs/${id}/reorder`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fromOrder, toOrder }),
        });

        if (!response.ok) {
            const error = await response.json();
            return rejectWithValue(error);
        }
        return response.json();
    }
);

const jobsSlice = createSlice({
    name: 'jobs',
    initialState: {
        list: [],
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
            // loadJobs
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
                // For simplicity, re-fetch after add to update the list correctly.
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
            });
    },
});

export const { optimisticReorder } = jobsSlice.actions;

export default jobsSlice.reducer;