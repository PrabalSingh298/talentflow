// src/components/ShortTextQuestion.jsx
import React from 'react';
import styles from './Question.module.css';

const ShortTextQuestion = ({ question, onUpdate, onDelete }) => {
    const handleChange = (e) => {
        onUpdate({
            ...question,
            text: e.target.value,
        });
    };

    return (
        <div className={styles.questionContainer}>
            <input
                type="text"
                placeholder="Short Text Question"
                value={question.text}
                onChange={handleChange}
                className={styles.questionInput}
            />
            <button onClick={onDelete} className={styles.deleteBtn}>Delete</button>
        </div>
    );
};

export default ShortTextQuestion;