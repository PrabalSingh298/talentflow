// src/components/NumericQuestion.jsx
import React from 'react';
import styles from './Question.module.css';

const NumericQuestion = ({ question, onUpdate, onDelete }) => {
    const handleTextChange = (e) => {
        onUpdate({
            ...question,
            text: e.target.value,
        });
    };

    const handleValidationChange = (e) => {
        const { name, value } = e.target;
        onUpdate({
            ...question,
            validation: {
                ...(question.validation || {}),
                [name]: Number(value),
            },
        });
    };

    return (
        <div className={styles.questionContainer}>
            <div className={styles.questionMain}>
                <input
                    type="text"
                    placeholder="Numeric Question"
                    value={question.text}
                    onChange={handleTextChange}
                    className={styles.questionInput}
                />
                <div className={styles.validation}>
                    <label>Min:</label>
                    <input
                        type="number"
                        name="min"
                        value={question.validation?.min || ''}
                        onChange={handleValidationChange}
                        placeholder="Min"
                        className={styles.validationInput}
                    />
                    <label>Max:</label>
                    <input
                        type="number"
                        name="max"
                        value={question.validation?.max || ''}
                        onChange={handleValidationChange}
                        placeholder="Max"
                        className={styles.validationInput}
                    />
                </div>
            </div>
            <button onClick={onDelete} className={styles.deleteBtn}>Delete</button>
        </div>
    );
};

export default NumericQuestion;