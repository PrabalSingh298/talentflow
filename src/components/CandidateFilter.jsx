// src/components/CandidateFilter.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './CandidateFilter.module.css';

const CandidateFilter = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
    const [search, setSearch] = useState('');
    const [stage, setStage] = useState('');

    useEffect(() => {
        // Sync local state with URL parameters on mount and URL change
        const searchParams = new URLSearchParams(location.search);
        setSearch(searchParams.get('search') || '');
        setStage(searchParams.get('stage') || '');
    }, [location]);

    const handleFilterChange = () => {
        const searchParams = new URLSearchParams();
        if (search) {
            searchParams.set('search', search);
        }
        if (stage) {
            searchParams.set('stage', stage);
        }
        // Navigate to the new URL to trigger a re-fetch in CandidatesList
        navigate(`?${searchParams.toString()}`);
    };

    const handleClearFilters = () => {
        setSearch('');
        setStage('');
        navigate('/candidates');
    };

    return (
        <div className={styles.filterContainer}>
            <div className={styles.formGroup}>
                <label htmlFor="search">Search by Name or Email</label>
                <input
                    type="text"
                    id="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFilterChange()}
                    placeholder="e.g., John Doe"
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="stage">Filter by Stage</label>
                <select
                    id="stage"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                >
                    <option value="">All Stages</option>
                    {stages.map(s => (
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

export default CandidateFilter;