// src/components/JobsFilter.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './JobsFilter.module.css';

const JobsFilter = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const availableStatuses = useSelector(state => state.jobs.availableStatuses);

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        // Sync local state with URL parameters on mount and URL change
        const searchParams = new URLSearchParams(location.search);
        setSearch(searchParams.get('search') || '');
        setStatus(searchParams.get('status') || '');
    }, [location]);

    const handleFilterChange = () => {
        const searchParams = new URLSearchParams();
        if (search) {
            searchParams.set('search', search);
        }
        if (status) {
            searchParams.set('status', status);
        }
        // Navigate to the new URL to trigger a re-fetch in JobsBoard
        navigate(`?${searchParams.toString()}`);
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatus('');
        navigate('/jobs');
    };

    return (
        <div className={styles.filterContainer}>
            <div className={styles.formGroup}>
                <label htmlFor="search">Search by Title</label>
                <input
                    type="text"
                    id="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFilterChange()}
                    placeholder="e.g., Frontend Engineer"
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="status">Filter by Status</label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    {availableStatuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
            <div className={styles.actions}>
                <button className={styles.applyBtn} onClick={handleFilterChange}>Apply Filters</button>
                <button className={styles.clearBtn} onClick={handleClearFilters}>Clear</button>
            </div>
        </div>
    );
};

export default JobsFilter;