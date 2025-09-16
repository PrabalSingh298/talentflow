// src/components/MultiChoiceQuestion.jsx
import React from 'react';
import styles from './Question.module.css';

const MultiChoiceQuestion = ({ question, onUpdate, onDelete }) => {
    const handleTextChange = (e) => {
        onUpdate({
            ...question,
            text: e.target.value,
        });
    };

    const handleOptionChange = (index, e) => {
        const newOptions = [...(question.options || [])];
        newOptions[index] = e.target.value;
        onUpdate({
            ...question,
            options: newOptions,
        });
    };

    const handleAddOption = () => {
        onUpdate({
            ...question,
            options: [...(question.options || []), ''],
        });
    };

    const handleDeleteOption = (index) => {
        const newOptions = [...(question.options || [])];
        newOptions.splice(index, 1);
        onUpdate({
            ...question,
            options: newOptions,
        });
    };

    return (
        <div className={styles.questionContainer}>
            <div className={styles.questionMain}>
                <input
                    type="text"
                    placeholder="Multi-Choice Question"
                    value={question.text}
                    onChange={handleTextChange}
                    className={styles.questionInput}
                />
                <div className={styles.optionsList}>
                    {(question.options || []).map((option, index) => (
                        <div key={index} className={styles.optionItem}>
                            <input type="text" value={option} onChange={e => handleOptionChange(index, e)} placeholder={`Option ${index + 1}`} className={styles.optionInput} />
                            <button onClick={() => handleDeleteOption(index)} className={styles.deleteOptionBtn}>&times;</button>
                        </div>
                    ))}
                    <button onClick={handleAddOption} className={styles.addOptionBtn}>Add Option</button>
                </div>
            </div>
            <button onClick={onDelete} className={styles.deleteBtn}>Delete</button>
        </div>
    );
};

export default MultiChoiceQuestion;