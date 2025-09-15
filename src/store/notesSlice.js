// src/store/notesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../db";

// Load notes for a candidate
export const loadNotes = createAsyncThunk(
    "notes/load",
    async (candidateId) => {
        return await db.notes.where("candidateId").equals(candidateId).toArray();
    }
);

// Add a note
export const addNote = createAsyncThunk(
    "notes/add",
    async (note) => {
        // Corrected: Use a fetch call to the mock API
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note),
        });
        if (!response.ok) {
            throw new Error('Failed to add note');
        }
        return response.json();
    }
);

// Update a note
export const updateNote = createAsyncThunk(
    "notes/update",
    async (note) => {
        await db.notes.put(note);
        return note;
    }
);

// Delete a note
export const deleteNote = createAsyncThunk(
    "notes/delete",
    async (id) => {
        await db.notes.delete(id);
        return id;
    }
);

const notesSlice = createSlice({
    name: "notes",
    initialState: {
        list: [],
        status: "idle",
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadNotes.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loadNotes.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list = action.payload;
            })
            .addCase(addNote.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateNote.fulfilled, (state, action) => {
                const index = state.list.findIndex((n) => n.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.list = state.list.filter((n) => n.id !== action.payload);
            });
    },
});


export default notesSlice.reducer;