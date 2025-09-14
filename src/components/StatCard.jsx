import React from "react";
import styles from "./StatCard.module.css";

const StatCard = ({ value, label, subLabel }) => {
    return (
        <div className={styles.card}>
            <div className={styles.top}>
                <div className={styles.value}>{value}</div>
            </div>
            <div className={styles.label}>{label}</div>
            {subLabel && <div className={styles.sublabel}>{subLabel}</div>}
        </div>
    );
};

export default StatCard;
