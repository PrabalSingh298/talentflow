import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadJobs, addJob } from "../../store/jobsSlice";

function JobsBoard() {
    const dispatch = useDispatch();
    const jobs = useSelector((state) => state.jobs.list);

    useEffect(() => {
        dispatch(loadJobs());
    }, [dispatch]);

    const handleAddJob = () => {
        const newJob = {
            id: Date.now().toString(),
            title: "New Job " + Date.now(),
            slug: "new-job-" + Date.now(),
            status: "active",
            tags: ["example"],
            order: jobs.length + 1,
        };
        dispatch(addJob(newJob));
    };

    return (
        <div>
            <h2>Jobs Board</h2>
            <button onClick={handleAddJob}>Add Job</button>
            <ul>
                {jobs.map((job) => (
                    <li key={job.id}>
                        <strong>{job.title}</strong> ({job.status})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default JobsBoard;
