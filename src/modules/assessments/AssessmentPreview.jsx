// src/modules/assessments/AssessmentPreview.jsx
import React from 'react';
import styles from './AssessmentPreview.module.css';

const AssessmentPreview = ({ assessmentData }) => {
    if (!assessmentData || assessmentData.sections.length === 0) {
        return <div className={styles.emptyState}>Start building your assessment to see the live preview.</div>;
    }

    const renderQuestionInput = (question) => {
        switch (question.type) {
            case 'single-choice':
                return (
                    <div className={styles.optionsContainer}>
                        {question.options.map((option, index) => (
                            <div key={index} className={styles.option}>
                                <input type="radio" name={question.id} id={`${question.id}-${index}`} disabled />
                                <label htmlFor={`${question.id}-${index}`}>{option}</label>
                            </div>
                        ))}
                    </div>
                );
            case 'multi-choice':
                return (
                    <div className={styles.optionsContainer}>
                        {question.options.map((option, index) => (
                            <div key={index} className={styles.option}>
                                <input type="checkbox" name={question.id} id={`${question.id}-${index}`} disabled />
                                <label htmlFor={`${question.id}-${index}`}>{option}</label>
                            </div>
                        ))}
                    </div>
                );
            case 'short-text':
                return <input type="text" className={styles.textInput} placeholder="Short answer" disabled />;
            case 'long-text':
                return <textarea className={styles.textareaInput} placeholder="Long answer" disabled />;
            case 'numeric':
                return <input type="number" className={styles.textInput} placeholder="Numeric answer" disabled />;
            case 'file-upload':
                return <input type="file" className={styles.fileInput} disabled />;
            default:
                return null;
        }
    };

    return (
        <div className={styles.previewForm}>
            {assessmentData.sections.map((section, sectionIndex) => (
                <div key={section.id} className={styles.section}>
                    <h3 className={styles.sectionTitle}>{section.title || `Section ${sectionIndex + 1}`}</h3>
                    <div className={styles.questionsList}>
                        {section.questions.map((question) => (
                            <div key={question.id} className={styles.question}>
                                <label className={styles.questionLabel}>
                                    {question.text || `Question ${question.id}`}
                                </label>
                                {renderQuestionInput(question)}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AssessmentPreview;