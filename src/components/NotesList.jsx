// src/components/NotesList.jsx
import React from 'react';
import styles from './NotesList.module.css';

const NotesList = ({ notes }) => {
    return (
        <div className={styles.notesList}>
            {notes.map(note => (
                <div key={note.id} className={styles.noteItem}>
                    <p className={styles.noteText}>
                        {note.text}
                    </p>
                    <span className={styles.noteDate}>
                        {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default NotesList;