// src/components/FileUploadQuestion.jsx
import React from 'react';
import styles from './Question.module.css';

const FileUploadQuestion = ({ question, onUpdate, onDelete }) => {
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
                placeholder="File Upload Question"
                value={question.text}
                onChange={handleChange}
                className={styles.questionInput}
            />
            <button onClick={onDelete} className={styles.deleteBtn}>Delete</button>
        </div>
    );
};

export default FileUploadQuestion;