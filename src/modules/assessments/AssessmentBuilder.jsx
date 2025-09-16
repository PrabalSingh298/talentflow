// src/modules/assessments/AssessmentBuilder.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { loadAssessment, saveAssessment } from '../../store/assessmentsSlice';
import AssessmentPreview from './AssessmentPreview';
import ShortTextQuestion from '../../components/ShortTextQuestion';
import LongTextQuestion from '../../components/LongTextQuestion';
import SingleChoiceQuestion from '../../components/SingleChoiceQuestion';
import MultiChoiceQuestion from '../../components/MultiChoiceQuestion';
import NumericQuestion from '../../components/NumericQuestion';
import FileUploadQuestion from '../../components/FileUploadQuestion';
import RequiredCheckbox from '../../components/RequiredCheckbox';
import ConditionalLogic from '../../components/ConditionalLogic'; // Import the new component
import styles from './AssessmentBuilder.module.css';

const AssessmentBuilder = () => {
    const { jobId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const assessment = useSelector(state => state.assessments.current);
    const status = useSelector(state => state.assessments.status);

    const [assessmentData, setAssessmentData] = useState(assessment || { jobId, sections: [] });

    useEffect(() => {
        dispatch(loadAssessment(jobId));
    }, [dispatch, jobId]);

    useEffect(() => {
        if (assessment && assessment.jobId === jobId) {
            setAssessmentData(assessment);
        }
    }, [assessment, jobId]);

    const handleAddSection = () => {
        setAssessmentData(prev => ({
            ...prev,
            sections: [
                ...prev.sections,
                { id: `section-${Date.now()}`, title: '', questions: [] }
            ]
        }));
    };

    const handleAddQuestion = (sectionIndex, type) => {
        const newSections = [...assessmentData.sections];
        let newQuestion = { id: `question-${Date.now()}`, type, text: '', required: false };
        if (type === 'single-choice' || type === 'multi-choice') {
            newQuestion.options = [''];
        }
        if (type === 'numeric') {
            newQuestion.validation = { min: 0, max: 100 };
        }
        newSections[sectionIndex].questions.push(newQuestion);
        setAssessmentData({ ...assessmentData, sections: newSections });
    };

    const handleUpdateQuestion = (sectionIndex, questionIndex, updatedQuestion) => {
        const newSections = [...assessmentData.sections];
        newSections[sectionIndex].questions[questionIndex] = updatedQuestion;
        setAssessmentData({ ...assessmentData, sections: newSections });
    };

    const handleDeleteQuestion = (sectionIndex, questionIndex) => {
        const newSections = [...assessmentData.sections];
        newSections[sectionIndex].questions.splice(questionIndex, 1);
        setAssessmentData({ ...assessmentData, sections: newSections });
    };

    const handleToggleRequired = (sectionIndex, questionIndex) => {
        const newSections = [...assessmentData.sections];
        const question = newSections[sectionIndex].questions[questionIndex];
        newSections[sectionIndex].questions[questionIndex] = {
            ...question,
            required: !question.required,
        };
        setAssessmentData({ ...assessmentData, sections: newSections });
    };

    const handleSave = () => {
        dispatch(saveAssessment(assessmentData));
        alert('Assessment saved!');
    };

    const allQuestions = assessmentData.sections.flatMap(s => s.questions);

    if (status === 'loading') {
        return <div>Loading assessment...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.builderPane}>
                <h1>Assessment Builder</h1>
                <button onClick={handleAddSection}>Add Section</button>
                <div className={styles.sectionsList}>
                    {assessmentData.sections.map((section, sectionIndex) => (
                        <div key={section.id} className={styles.section}>
                            <input type="text" placeholder="Section Title" value={section.title} onChange={e => {
                                const newSections = [...assessmentData.sections];
                                newSections[sectionIndex].title = e.target.value;
                                setAssessmentData({ ...assessmentData, sections: newSections });
                            }} />
                            <div>
                                <button onClick={() => handleAddQuestion(sectionIndex, 'short-text')}>Add Short Text Question</button>
                                <button onClick={() => handleAddQuestion(sectionIndex, 'long-text')}>Add Long Text Question</button>
                                <button onClick={() => handleAddQuestion(sectionIndex, 'single-choice')}>Add Single-Choice Question</button>
                                <button onClick={() => handleAddQuestion(sectionIndex, 'multi-choice')}>Add Multi-Choice Question</button>
                                <button onClick={() => handleAddQuestion(sectionIndex, 'numeric')}>Add Numeric Question</button>
                                <button onClick={() => handleAddQuestion(sectionIndex, 'file-upload')}>Add File Upload Question</button>
                            </div>
                            {section.questions.map((question, questionIndex) => {
                                const commonProps = {
                                    key: question.id,
                                    question: question,
                                    onUpdate: updatedQuestion => handleUpdateQuestion(sectionIndex, questionIndex, updatedQuestion),
                                    onDelete: () => handleDeleteQuestion(sectionIndex, questionIndex),
                                };
                                if (question.type === 'short-text') {
                                    return (
                                        <div key={question.id}>
                                            <ShortTextQuestion {...commonProps} />
                                            <RequiredCheckbox
                                                required={question.required}
                                                onToggle={() => handleToggleRequired(sectionIndex, questionIndex)}
                                            />
                                            <ConditionalLogic
                                                question={question}
                                                onUpdate={updatedQuestion => handleUpdateQuestion(sectionIndex, questionIndex, updatedQuestion)}
                                                allQuestions={allQuestions}
                                            />
                                        </div>
                                    );
                                }
                                if (question.type === 'long-text') {
                                    return (
                                        <div key={question.id}>
                                            <LongTextQuestion {...commonProps} />
                                            <RequiredCheckbox
                                                required={question.required}
                                                onToggle={() => handleToggleRequired(sectionIndex, questionIndex)}
                                            />
                                            <ConditionalLogic
                                                question={question}
                                                onUpdate={updatedQuestion => handleUpdateQuestion(sectionIndex, questionIndex, updatedQuestion)}
                                                allQuestions={allQuestions}
                                            />
                                        </div>
                                    );
                                }
                                if (question.type === 'single-choice') {
                                    return (
                                        <div key={question.id}>
                                            <SingleChoiceQuestion {...commonProps} />
                                            <RequiredCheckbox
                                                required={question.required}
                                                onToggle={() => handleToggleRequired(sectionIndex, questionIndex)}
                                            />
                                            <ConditionalLogic
                                                question={question}
                                                onUpdate={updatedQuestion => handleUpdateQuestion(sectionIndex, questionIndex, updatedQuestion)}
                                                allQuestions={allQuestions}
                                            />
                                        </div>
                                    );
                                }
                                if (question.type === 'multi-choice') {
                                    return (
                                        <div key={question.id}>
                                            <MultiChoiceQuestion {...commonProps} />
                                            <RequiredCheckbox
                                                required={question.required}
                                                onToggle={() => handleToggleRequired(sectionIndex, questionIndex)}
                                            />
                                            <ConditionalLogic
                                                question={question}
                                                onUpdate={updatedQuestion => handleUpdateQuestion(sectionIndex, questionIndex, updatedQuestion)}
                                                allQuestions={allQuestions}
                                            />
                                        </div>
                                    );
                                }
                                if (question.type === 'numeric') {
                                    return (
                                        <div key={question.id}>
                                            <NumericQuestion {...commonProps} />
                                            <RequiredCheckbox
                                                required={question.required}
                                                onToggle={() => handleToggleRequired(sectionIndex, questionIndex)}
                                            />
                                            <ConditionalLogic
                                                question={question}
                                                onUpdate={updatedQuestion => handleUpdateQuestion(sectionIndex, questionIndex, updatedQuestion)}
                                                allQuestions={allQuestions}
                                            />
                                        </div>
                                    );
                                }
                                if (question.type === 'file-upload') {
                                    return (
                                        <div key={question.id}>
                                            <FileUploadQuestion {...commonProps} />
                                            <RequiredCheckbox
                                                required={question.required}
                                                onToggle={() => handleToggleRequired(sectionIndex, questionIndex)}
                                            />
                                            <ConditionalLogic
                                                question={question}
                                                onUpdate={updatedQuestion => handleUpdateQuestion(sectionIndex, questionIndex, updatedQuestion)}
                                                allQuestions={allQuestions}
                                            />
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    ))}
                </div>
                <button onClick={handleSave}>Save Assessment</button>
            </div>
            <div className={styles.previewPane}>
                <h2>Live Preview</h2>
                <AssessmentPreview assessmentData={assessmentData} />
            </div>
        </div>
    );
};

export default AssessmentBuilder;