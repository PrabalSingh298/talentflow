// src/components/JobFormModal.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addJob, updateJob } from '../store/jobsSlice';
import styles from './JobFormModal.module.css';

const JobFormModal = ({ isOpen, onClose, initialJobData }) => {
    const dispatch = useDispatch();
    const availableStatuses = useSelector(state => state.jobs.availableStatuses);

    const [job, setJob] = useState({
        title: '',
        description: '',
        slug: '',
        status: 'active',
        tags: [],
    });

    useEffect(() => {
        // Populate the form with initial data when editing an existing job
        if (initialJobData) {
            setJob(initialJobData);
        } else {
            // Clear the form when creating a new job
            setJob({
                title: '',
                description: '',
                slug: '',
                status: 'active',
                tags: [],
            });
        }
    }, [initialJobData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJob(prevJob => ({ ...prevJob, [name]: value }));
    };

    const handleTagsChange = (e) => {
        const tagsArray = e.target.value.split(',').map(tag => tag.trim());
        setJob(prevJob => ({ ...prevJob, tags: tagsArray }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (initialJobData) {
            // Dispatch the updateJob thunk
            dispatch(updateJob({ ...job, tags: job.tags.filter(tag => tag !== '') }));
        } else {
            // Dispatch the addJob thunk
            dispatch(addJob({ ...job, tags: job.tags.filter(tag => tag !== '') }));
        }
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{initialJobData ? 'Edit Job' : 'Create New Job'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" name="title" value={job.title} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description</label>
                        <textarea id="description" name="description" value={job.description} onChange={handleChange} required></textarea>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="slug">Slug</label>
                        <input type="text" id="slug" name="slug" value={job.slug} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="status">Status</label>
                        <select id="status" name="status" value={job.status} onChange={handleChange}>
                            {availableStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="tags">Tags (comma separated)</label>
                        <input type="text" id="tags" name="tags" value={job.tags.join(', ')} onChange={handleTagsChange} />
                    </div>
                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                        <button type="submit" className={styles.submitBtn}>{initialJobData ? 'Save Changes' : 'Create Job'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobFormModal;