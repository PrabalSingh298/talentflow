import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadResponses, saveResponses } from "../../store/assessmentResponsesSlice";

function ResponseTest() {
    const dispatch = useDispatch();
    const current = useSelector((state) => state.assessmentResponses.current);

    useEffect(() => {
        const jobId = "job-1";
        const candidateId = "cand-1";

        dispatch(
            saveResponses({
                jobId,
                candidateId,
                responses: { q1: "Yes", q2: "42" },
            })
        ).then(() => {
            dispatch(loadResponses({ jobId, candidateId }));
        });
    }, [dispatch]);

    return (
        <div>
            <h2>Response Test</h2>
            <pre>{JSON.stringify(current, null, 2)}</pre>
        </div>
    );
}

export default ResponseTest;
