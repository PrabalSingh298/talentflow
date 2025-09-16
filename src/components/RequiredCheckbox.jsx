// src/components/RequiredCheckbox.jsx
import React from 'react';
import styles from './RequiredCheckbox.module.css';

const RequiredCheckbox = ({ required, onToggle }) => {
    return (
        <div className={styles.container}>
            <label className={styles.label}>
                <input
                    type="checkbox"
                    checked={required}
                    onChange={onToggle}
                    className={styles.checkbox}
                />
                Required
            </label>
        </div>
    );
};

export default RequiredCheckbox;