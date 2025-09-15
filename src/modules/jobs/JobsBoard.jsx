// src/modules/jobs/JobsBoard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { loadJobs, addJob, reorderJob } from '../../store/jobsSlice';
import JobListItem from '../../components/JobListItem';

function JobsBoard() {
    const dispatch = useDispatch();
    const location = useLocation();
    const { list: jobs, status, currentPage, pageSize } = useSelector((state) => state.jobs);

    useEffect(() => {
        // Parse URL search parameters to get filters
        const searchParams = new URLSearchParams(location.search);
        const filters = {
            search: searchParams.get('search'),
            status: searchParams.get('status'),
            tags: searchParams.get('tags'),
            page: searchParams.get('page'),
            pageSize: searchParams.get('pageSize'),
            sort: searchParams.get('sort')
        };

        // Only dispatch if the status is 'idle' to prevent multiple fetches
        // This is a good practice for preventing unnecessary reloads
        if (status === 'idle') {
            dispatch(loadJobs(filters));
        }
    }, [status, dispatch, location]);

    const handleAddJob = () => {
        const newJob = {
            id: `job-${Date.now()}`,
            title: "New Job " + Date.now(),
            slug: "new-job-" + Date.now(),
            status: "active",
            tags: ["example"],
            order: jobs.length + 1,
        };
        dispatch(addJob(newJob));
    };

    const handleReorderTest = () => {
        const jobToMoveId = jobs[2]?.id;
        const fromOrder = jobs[2]?.order;
        const toOrder = 1;

        if (jobToMoveId && fromOrder) {
            dispatch(reorderJob({ id: jobToMoveId, fromOrder, toOrder }));
        } else {
            console.error("Jobs list is not loaded yet.");
        }
    };

    if (status === 'loading') {
        return <div>Loading jobs...</div>;
    }

    if (status === 'succeeded' && jobs.length === 0) {
        return <div>No jobs found.</div>;
    }

    return (
        <div>
            <h1>Jobs Board</h1>
            <button onClick={handleAddJob}>Add Job</button>
            <button onClick={handleReorderTest}>Test Reorder</button>
            <ul>
                {jobs.map((job) => (
                    <li key={job.id}>
                        <JobListItem job={job} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default JobsBoard;