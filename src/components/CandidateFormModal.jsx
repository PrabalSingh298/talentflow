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

    // Simple function to generate a unique ID
    const generateUniqueId = () => {
        return 'candidate-' + Math.random().toString(36).substr(2, 9);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCandidateData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create a complete candidate object with a unique ID and a timeline field
            const newCandidate = {
                ...candidateData,
                id: generateUniqueId(),
                timeline: [{
                    stage: candidateData.stage,
                    timestamp: new Date().toISOString()
                }],
            };

            // Dispatch the thunk and wait for it to complete
            await dispatch(createCandidate(newCandidate)).unwrap();

            // Close the modal on successful submission
            onClose();
        } catch (error) {
            console.error('Failed to create candidate:', error);
            alert('Failed to create candidate. Check the console for details.');
        }
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