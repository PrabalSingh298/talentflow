// src/components/PaginationControls.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PaginationControls.module.css';

const PaginationControls = ({ totalCount, pageSize }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const currentPage = parseInt(searchParams.get('page')) || 1;

    const totalPages = Math.ceil(totalCount / pageSize);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            searchParams.set('page', newPage);
            navigate(`?${searchParams.toString()}`);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`${styles.pageButton} ${currentPage === i ? styles.active : ''}`}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={styles.paginationContainer}>
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.navButton}
            >
                Previous
            </button>
            {renderPageNumbers()}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.navButton}
            >
                Next
            </button>
        </div>
    );
};

export default PaginationControls;