// src/components/NotesSection.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNote, loadNotes } from '../store/notesSlice';
import NotesList from './NotesList';
import styles from './NotesSection.module.css';

const HR_MEMBERS = ["Priya", "Raj", "Sarah", "Tom"];

// Simple function to generate a unique ID
const generateUniqueId = () => {
    return 'note-' + Math.random().toString(36).substr(2, 9);
};

const NotesSection = ({ candidateId }) => {
    const dispatch = useDispatch();
    const notes = useSelector(state => state.notes.list);
    const notesStatus = useSelector(state => state.notes.status);

    const [noteText, setNoteText] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        // Corrected: Dispatch a new fetch whenever the candidateId changes.
        // The notesStatus check is removed here to ensure it re-fetches every time.
        dispatch(loadNotes(candidateId));
    }, [dispatch, candidateId]);

    const handleTextChange = (e) => {
        const text = e.target.value;
        setNoteText(text);

        const mentionTrigger = text.lastIndexOf('@');
        if (mentionTrigger !== -1) {
            const query = text.substring(mentionTrigger + 1).toLowerCase();
            const filteredSuggestions = HR_MEMBERS.filter(member =>
                member.toLowerCase().startsWith(query)
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (noteText.trim() === '') return;

        try {
            // New: Generate a unique ID and include it in the new note object
            const newNote = {
                id: generateUniqueId(),
                candidateId,
                text: noteText,
                mentions: noteText.split(' ').filter(word => word.startsWith('@')).map(mention => mention.substring(1)),
                createdAt: new Date().toISOString(),
            };

            // New: Await the thunk dispatch to ensure a new note is added successfully
            await dispatch(addNote(newNote)).unwrap();

            // Clear the form and suggestions on success
            setNoteText('');
            setSuggestions([]);
        } catch (error) {
            console.error('Failed to add note:', error);
            alert('Failed to add note. Check the console for details.');
        }
    };

    const handleSelectSuggestion = (name) => {
        const mentionTrigger = noteText.lastIndexOf('@');
        const newText = noteText.substring(0, mentionTrigger) + `@${name} `;
        setNoteText(newText);
        setSuggestions([]);
    };

    return (
        <div className={styles.notesSection}>
            {notesStatus === 'loading' && <div>Loading notes...</div>}
            {notesStatus === 'succeeded' && <NotesList notes={notes} />}
            <form onSubmit={handleAddNote} className={styles.form}>
                <textarea
                    value={noteText}
                    onChange={handleTextChange}
                    placeholder="Add a note... @mention a colleague"
                    className={styles.textarea}
                />
                {suggestions.length > 0 && (
                    <ul className={styles.suggestionsList}>
                        {suggestions.map(name => (
                            <li key={name} onClick={() => handleSelectSuggestion(name)}>
                                @{name}
                            </li>
                        ))}
                    </ul>
                )}
                <button type="submit" className={styles.submitBtn}>Add Note</button>
            </form>
        </div>
    );
};

export default NotesSection;