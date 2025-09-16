// src/modules/assessments/AssessmentPreview.jsx
import React from 'react';
import styles from './AssessmentPreview.module.css';

const AssessmentPreview = ({ assessmentData }) => {
    if (!assessmentData || assessmentData.sections.length === 0) {
        return <div className={styles.emptyState}>Start building your assessment to see the live preview.</div>;
    }

    return (
        <div className={styles.previewForm}>
            {assessmentData.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className={styles.section}>
                    <h3 className={styles.sectionTitle}>{section.title || `Section ${sectionIndex + 1}`}</h3>
                    <div className={styles.questionsList}>
                        {section.questions.map((question, questionIndex) => (
                            <div key={questionIndex} className={styles.question}>
                                <label className={styles.questionLabel}>
                                    {question.text || `Question ${questionIndex + 1}`}
                                </label>
                                {/* Rendering logic for different question types will go here */}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AssessmentPreview;