import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadCandidates, addCandidate } from "../../store/candidatesSlice";

function CandidatesList() {
    const dispatch = useDispatch();
    const candidates = useSelector((state) => state.candidates.list);

    useEffect(() => {
        dispatch(loadCandidates());
    }, [dispatch]);

    const handleAddCandidate = () => {
        const newCandidate = {
            id: Date.now().toString(),
            name: "Candidate " + Date.now(),
            email: "cand" + Date.now() + "@example.com",
            stage: "applied",
            jobId: "job-1", // assume linked to a job
            timeline: [],
        };
        dispatch(addCandidate(newCandidate));
    };

    return (
        <div>
            <h2>Candidates List</h2>
            <button onClick={handleAddCandidate}>Add Candidate</button>
            <ul>
                {candidates.map((cand) => (
                    <li key={cand.id}>
                        <strong>{cand.name}</strong> ({cand.email}) → Stage:{" "}
                        {cand.stage}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CandidatesList;
