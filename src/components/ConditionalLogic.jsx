// src/components/ConditionalLogic.jsx
import React from 'react';
import styles from './ConditionalLogic.module.css';

const ConditionalLogic = ({ question, onUpdate, allQuestions }) => {
    const handleQuestionIdChange = (e) => {
        const newConditional = {
            ...question.conditional,
            questionId: e.target.value,
        };
        onUpdate({
            ...question,
            conditional: newConditional,
        });
    };

    const handleValueChange = (e) => {
        const newConditional = {
            ...question.conditional,
            value: e.target.value,
        };
        onUpdate({
            ...question,
            conditional: newConditional,
        });
    };

    return (
        <div className={styles.container}>
            <label className={styles.label}>Show this question if:</label>
            <div className={styles.controls}>
                <select value={question.conditional?.questionId || ''} onChange={handleQuestionIdChange} className={styles.select}>
                    <option value="">Select a question...</option>
                    {allQuestions.filter(q => q.id !== question.id).map(q => (
                        <option key={q.id} value={q.id}>{q.text || `Question ${q.id}`}</option>
                    ))}
                </select>
                <span>equals</span>
                <input type="text" value={question.conditional?.value || ''} onChange={handleValueChange} placeholder="Enter value" className={styles.input} />
            </div>
        </div>
    );
};

export default ConditionalLogic;