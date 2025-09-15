// src/components/JobListItem.jsx
import React from 'react';
import styles from './JobListItem.module.css';

const JobListItem = ({ job }) => {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3 className={styles.title}>{job.title}</h3>
                <span className={`${styles.status} ${styles[job.status]}`}>{job.status}</span>
            </div>
            <p className={styles.slug}>{job.slug}</p>
            <div className={styles.tags}>
                {job.tags.map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                ))}
            </div>
        </div>
    );
};

export default JobListItem;