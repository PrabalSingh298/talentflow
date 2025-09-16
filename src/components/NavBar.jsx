// src/components/NavBar.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";

const NavBar = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.left}>
                <Link to="/" className={styles.logo}>
                    <span className={styles.logoHighlight}>Talent</span>Flow
                </Link>
            </div>

            <ul className={styles.navLinks}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/jobs">Jobs</Link></li>
                <li><Link to="/candidates">Candidates</Link></li>
                <li><Link to="/assessments">Assessments</Link></li>
            </ul>

            <div className={styles.cta}>
                <Link to="/login" className={styles.loginBtn}>Login</Link>
                <Link to="/signup" className={styles.signupBtn}>Sign Up</Link>
            </div>
        </nav>
    );
};

export default NavBar;