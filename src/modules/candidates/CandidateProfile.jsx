// src/modules/candidates/CandidateProfile.jsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadCandidateById, loadTimelineByCandidateId } from '../../store/candidatesSlice'; // Import the new thunk
import NotesSection from '../../components/NotesSection';
import styles from './CandidateProfile.module.css';
import NavBar from '../../components/NavBar'

const CandidateProfile = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const candidate = useSelector(state => state.candidates.currentCandidate);
    const timeline = useSelector(state => state.candidates.currentTimeline); // Get the new state
    const status = useSelector(state => state.candidates.status);

    useEffect(() => {
        // Fetch candidate details
        if (!candidate || candidate.id !== id) {
            dispatch(loadCandidateById(id));
        }
        // Fetch the candidate's timeline separately
        dispatch(loadTimelineByCandidateId(id));
    }, [dispatch, id, candidate]);

    // Handle loading and error states first
    if (status === 'loading') {
        return <div>Loading candidate profile...</div>;
    }

    // Conditionally render based on a successful fetch
    if (status === 'succeeded') {
        if (!candidate || candidate.id !== id) {
            return <div>Candidate not found. <Link to="/candidates">Go back to the board</Link></div>;
        }

        // If the correct candidate is found, render the details
        return (
            <div className={styles.profileContainer}>
                <NavBar />
                <Link to="/candidates" className={styles.backLink}>Go Back</Link>
                <div className={styles.header}>
                    <h1 className={styles.name}>{candidate.name}</h1>
                    <p className={styles.stage}>Current Stage: <span>{candidate.stage}</span></p>
                </div>
                <p className={styles.email}>{candidate.email}</p>

                <div className={styles.timeline}>
                    <h2>Timeline</h2>
                    {timeline && timeline.map((event, index) => (
                        <div key={index} className={styles.timelineEvent}>
                            <span className={styles.timelineStage}>{event.stage}</span>
                            <span className={styles.timelineDate}>{new Date(event.timestamp).toLocaleDateString()}</span>
                        </div>
                    ))}
                </div>

                <div className={styles.notes}>
                    <h2>Notes</h2>
                    <NotesSection candidateId={id} />
                </div>
            </div>
        );
    }

    // Default fallback for initial render or stale state
    return null;
};

export default CandidateProfile;