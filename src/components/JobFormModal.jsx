// src/components/JobFormModal.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addJob, updateJob } from '../store/jobsSlice';
import styles from './JobFormModal.module.css';

// Simple function to generate a unique ID for new jobs
const generateUniqueId = () => {
    return 'job-' + Math.random().toString(36).substr(2, 9);
};

const JobFormModal = ({ isOpen, onClose, initialJobData }) => {
    const dispatch = useDispatch();
    const availableStatuses = useSelector(state => state.jobs.availableStatuses);

    // State for the form data
    const [job, setJob] = useState({
        title: '',
        description: '',
        slug: '',
        status: 'active',
        tags: [],
    });

    // New state to manage the raw tags input string
    const [tagsInput, setTagsInput] = useState('');

    useEffect(() => {
        if (initialJobData) {
            setJob(initialJobData);
            // Initialize the raw tags input field with the joined tags array
            setTagsInput(initialJobData.tags ? initialJobData.tags.join(', ') : '');
        } else {
            setJob({
                title: '',
                description: '',
                slug: '',
                status: 'active',
                tags: [],
            });
            // Clear the tags input for a new job
            setTagsInput('');
        }
    }, [initialJobData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJob(prevJob => ({ ...prevJob, [name]: value }));
    };

    const handleTagsChange = (e) => {
        // Update the raw tags input state only
        setTagsInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Parse the tagsInput string into a clean array on submission
            const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

            // Create the final job object to be dispatched
            const jobToSave = { ...job, tags: tagsArray };

            if (initialJobData) {
                // For updates, explicitly pass the ID
                const finalJobToUpdate = { ...jobToSave, id: initialJobData.id };
                await dispatch(updateJob(finalJobToUpdate)).unwrap();
                console.log('Update successful:', finalJobToUpdate);
            } else {
                // For new jobs, generate and add a new ID
                const newJobWithId = { ...jobToSave, id: generateUniqueId() };
                await dispatch(addJob(newJobWithId)).unwrap();
                console.log('New job added successfully:', newJobWithId);
            }

            onClose();
        } catch (error) {
            console.error('Failed to save job:', error);
            alert('Failed to save job. Check the console for details.');
        }
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
                        {/* Bind the input value to the new tagsInput state */}
                        <input type="text" id="tags" name="tags" value={tagsInput} onChange={handleTagsChange} />
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