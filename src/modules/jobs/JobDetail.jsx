// src/modules/jobs/JobDetail.jsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadJobById } from '../../store/jobsSlice';
import JobListItem from '../../components/JobListItem';

const JobDetail = () => {
    const { jobId } = useParams();
    const dispatch = useDispatch();
    const job = useSelector(state => state.jobs.currentJob);
    const status = useSelector(state => state.jobs.status);

    useEffect(() => {
        dispatch(loadJobById(jobId));
    }, [dispatch, jobId]);

    if (status === 'loading') {
        return <div>Loading job details...</div>;
    }

    if (status === 'succeeded' && (!job || job.id !== jobId)) {
        return <div>Job not found. <Link to="/jobs">Go back to Jobs Board</Link></div>;
    }

    if (job && job.id === jobId) {
        return (
            <div>
                <Link to="/jobs">Go Back</Link>
                <h1>Job Details</h1>
                <JobListItem job={job} />
                {/* Add a separate section for the description */}
                <div>
                    <h3>Description:</h3>
                    <p>{job.description}</p>
                </div>
            </div>
        );
    }

    return null;
};

export default JobDetail;