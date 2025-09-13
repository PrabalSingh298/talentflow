import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadAssessment, saveAssessment } from "../../store/assessmentsSlice";

function AssessmentBuilder({ jobId }) {
    const dispatch = useDispatch();
    const assessment = useSelector((state) => state.assessments.current);

    useEffect(() => {
        dispatch(loadAssessment(jobId));
    }, [dispatch, jobId]);

    const handleAddQuestion = () => {
        const newAssessment = assessment || { jobId, sections: [] };
        const updated = {
            ...newAssessment,
            sections: [
                ...(newAssessment.sections || []),
                {
                    id: Date.now().toString(),
                    title: "New Section",
                    questions: [
                        {
                            id: "q" + Date.now(),
                            type: "short-text",
                            text: "Example Question?",
                            required: true,
                        },
                    ],
                },
            ],
        };
        dispatch(saveAssessment(updated));
    };

    return (
        <div>
            <h2>Assessment Builder (Job {jobId})</h2>
            <button onClick={handleAddQuestion}>Add Section with Question</button>
            <pre>{JSON.stringify(assessment, null, 2)}</pre>
        </div>
    );
}

export default AssessmentBuilder;
