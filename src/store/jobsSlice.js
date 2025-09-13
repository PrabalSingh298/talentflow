import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../db";

// Async thunk: load jobs from IndexedDB
export const loadJobs = createAsyncThunk("jobs/load", async () => {
    return await db.jobs.toArray();
});

// Async thunk: add job
export const addJob = createAsyncThunk("jobs/add", async (job) => {
    await db.jobs.add(job);
    return job;
});

// Async thunk: update job
export const updateJob = createAsyncThunk("jobs/update", async (job) => {
    await db.jobs.put(job);
    return job;
});

// Async thunk: delete job
export const deleteJob = createAsyncThunk("jobs/delete", async (id) => {
    await db.jobs.delete(id);
    return id;
});

const jobsSlice = createSlice({
    name: "jobs",
    initialState: {
        list: [],
        status: "idle",
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadJobs.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loadJobs.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list = action.payload;
            })
            .addCase(addJob.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateJob.fulfilled, (state, action) => {
                const index = state.list.findIndex((j) => j.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(deleteJob.fulfilled, (state, action) => {
                state.list = state.list.filter((job) => job.id !== action.payload);
            });
    },
});

export default jobsSlice.reducer;
