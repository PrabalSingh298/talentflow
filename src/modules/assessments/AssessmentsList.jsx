// src/modules/assessments/AssessmentsList.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { loadAssessments } from '../../store/assessmentsSlice';
import styles from './AssessmentsList.module.css';
import NavBar from '../../components/NavBar'

const AssessmentsList = () => {
    const dispatch = useDispatch();
    const assessments = useSelector(state => state.assessments.list);
    const status = useSelector(state => state.assessments.status);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(loadAssessments());
        }
    }, [dispatch, status]);

    if (status === 'loading') {
        return <div>Loading assessments...</div>;
    }

    if (!assessments || assessments.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Assessments</h1>
                </div>
                <div className={styles.emptyState}>
                    <p>No assessments found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <NavBar />
            <div className={styles.header}>
                <h1>Assessments</h1>
            </div>

            <ul className={styles.list}>
                {assessments.map(assessment => (
                    <li key={assessment.jobId} className={styles.listItem}>
                        <Link to={`/assessments/builder?jobId=${assessment.jobId}`}>{assessment.jobId}</Link>
                        <Link to={`/assessments/builder?jobId=${assessment.jobId}`} className={styles.editBtn}>Edit</Link>
                        <Link to={`/assessments/view/${assessment.jobId}`} className={styles.editBtn}>View</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AssessmentsList;