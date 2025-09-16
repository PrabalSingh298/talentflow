// src/modules/assessments/AssessmentsPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadAssessments } from '../../store/assessmentsSlice';
import styles from './AssessmentsPage.module.css';

const AssessmentsPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLoadExisting = () => {
        dispatch(loadAssessments());
        navigate('/assessments/list'); // We'll add this route next
    };

    const handleCreateNew = () => {
        navigate('/assessments/builder');
    };

    return (
        <div className={styles.container}>
            <h1>Manage Assessments</h1>
            <div className={styles.buttonGroup}>
                <button onClick={handleLoadExisting} className={styles.button}>
                    Load Existing Assessments
                </button>
                <button onClick={handleCreateNew} className={styles.button}>
                    Create New Assessment
                </button>
            </div>
        </div>
    );
};

export default AssessmentsPage;