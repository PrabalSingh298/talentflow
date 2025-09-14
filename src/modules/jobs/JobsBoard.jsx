import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadJobs, addJob, reorderJob } from "../../store/jobsSlice";

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

    // Add this temporary function inside your JobsBoard component
    const handleReorderTest = () => {
        const jobToMoveId = '1tJBnNZLJPQFy2hutxnJ9'; // Replace with a real ID from your IndexedDB
        const fromOrder = 3; // The original order of the job
        const toOrder = 1; // The new order you want to move it to

        dispatch(reorderJob({ id: jobToMoveId, fromOrder, toOrder }));
    };



    return (
        <div>
            <h2>Jobs Board</h2>
            <button onClick={handleAddJob}>Add Job</button>
            {/* // Add a button to trigger the function */}
            <button onClick={handleReorderTest}>Test Reorder</button>
            <ul>
                {jobs.map(job => (
                    <li key={job.id}>
                        <strong>{job.title}</strong> ({job.status})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default JobsBoard;
