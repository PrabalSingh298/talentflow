import { useState, useEffect } from "react";
import hireImg from "../../assets/hire.svg";
import hiringImg from "../../assets/hiring.svg";
import profileImg from "../../assets/profile.svg";
import jobOffersImg from "../../assets/job-offers.svg";
import jobHuntImg from "../../assets/job-hunt.svg";
import careerProgressImg from "../../assets/career-progress.svg";

import StatCard from "../../components/StatCard";
import NavBar from "../../components/NavBar";
import styles from "./Homepage.module.css";

const images = [
    hireImg,
    hiringImg,
    profileImg,
    jobOffersImg,
    jobHuntImg,
    careerProgressImg,
];

function Homepage() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000); // change every 4 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <NavBar />

            <div className={styles.hero}>
                <div className={styles.heroText}>
                    <h1>Smart Hiring, Easy Hiring</h1>
                    <p>
                        TalentFlow helps companies and candidates connect effortlessly.
                        Streamline your hiring with structured workflows, assessments, and a
                        modern dashboard.
                    </p>
                </div>

                <div className={styles.heroImage}>
                    <img
                        key={currentIndex} // forces re-render for animation
                        src={images[currentIndex]}
                        alt="Hiring illustration"
                        className={styles.carouselImage}
                    />
                </div>
            </div>

            <div className={styles.statsSection}>
                <StatCard icon={jobOffersImg} value={25} label="Jobs Posted" />
                <StatCard icon={profileImg} value={1000} label="Candidates" />
                <StatCard icon={hireImg} value={12} label="Successful Hires" />
            </div>
        </div>
    );
}

export default Homepage;
