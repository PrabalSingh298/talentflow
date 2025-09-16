// src/modules/assessments/AssessmentViewer.jsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadAssessment, clearAssessment } from '../../store/assessmentsSlice';
import styles from './AssessmentViewer.module.css';

const AssessmentViewer = () => {
    const { jobId } = useParams();
    const dispatch = useDispatch();
    const assessment = useSelector(state => state.assessments.current);
    const status = useSelector(state => state.assessments.status);

    useEffect(() => {
        dispatch(loadAssessment(jobId));
        return () => {
            dispatch(clearAssessment());
        };
    }, [dispatch, jobId]);

    if (status === 'loading') {
        return <div>Loading assessment...</div>;
    }

    if (!assessment || assessment.jobId !== jobId) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Assessment Not Found</h1>
                    <Link to="/assessments/list">Go Back</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Assessment for Job ID: {jobId}</h1>
                <Link to="/assessments/list">Go Back</Link>
            </div>

            <div className={styles.assessment}>
                {assessment.sections.map((section, sectionIndex) => (
                    <div key={section.id} className={styles.section}>
                        <h3 className={styles.sectionTitle}>{section.title}</h3>
                        {section.questions.map((question, questionIndex) => (
                            <div key={question.id} className={styles.question}>
                                <p>{question.text}</p>
                                {question.options && (
                                    <ul className={styles.optionsList}>
                                        {question.options.map((option, index) => (
                                            <li key={index}>{option}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssessmentViewer;