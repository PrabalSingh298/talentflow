// src/components/CandidateFormModal.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCandidate } from '../store/candidatesSlice';
import styles from './CandidateFormModal.module.css';

const CandidateFormModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];

    const [candidateData, setCandidateData] = useState({
        name: '',
        email: '',
        stage: 'applied', // New candidates start in the 'applied' stage
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCandidateData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newCandidate = {
            ...candidateData,
            timeline: [{ stage: candidateData.stage, timestamp: new Date().toISOString() }],
            notes: [],
        };
        dispatch(createCandidate(newCandidate));
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Create New Candidate</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" value={candidateData.name} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={candidateData.email} onChange={handleChange} required />
                    </div>
                    {/* New: Stage Dropdown */}
                    <div className={styles.formGroup}>
                        <label htmlFor="stage">Initial Stage</label>
                        <select id="stage" name="stage" value={candidateData.stage} onChange={handleChange}>
                            {stages.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                        <button type="submit" className={styles.submitBtn}>Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CandidateFormModal;