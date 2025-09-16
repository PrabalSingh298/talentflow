// src/modules/assessments/AssessmentBuilder.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { loadAssessment, saveNewAssessment, clearAssessment } from '../../store/assessmentsSlice';
import AssessmentPreview from './AssessmentPreview';
import ShortTextQuestion from '../../components/ShortTextQuestion';
import LongTextQuestion from '../../components/LongTextQuestion';
import SingleChoiceQuestion from '../../components/SingleChoiceQuestion';
import MultiChoiceQuestion from '../../components/MultiChoiceQuestion';
import NumericQuestion from '../../components/NumericQuestion';
import FileUploadQuestion from '../../components/FileUploadQuestion';
import RequiredCheckbox from '../../components/RequiredCheckbox';
import ConditionalLogic from '../../components/ConditionalLogic';
import styles from './AssessmentBuilder.module.css';
import { nanoid } from '@reduxjs/toolkit';

const AssessmentBuilder = () => {
    const location = useLocation();
    const jobIdFromUrl = new URLSearchParams(location.search).get('jobId');

    const dispatch = useDispatch();

    const assessment = useSelector(state => state.assessments.current);
    const status = useSelector(state => state.assessments.status);

    const [localAssessment, setLocalAssessment] = useState(null);
    const [linkedJobId, setLinkedJobId] = useState(jobIdFromUrl || null);

    useEffect(() => {
        if (jobIdFromUrl) {
            dispatch(loadAssessment(jobIdFromUrl));
        } else {
            dispatch(clearAssessment());
        }

        return () => {
            dispatch(clearAssessment());
        };
    }, [dispatch, jobIdFromUrl]);

    useEffect(() => {
        if (assessment && assessment.jobId === jobIdFromUrl) {
            setLocalAssessment(assessment);
        } else if (!jobIdFromUrl) {
            setLocalAssessment({ jobId: `job-${nanoid()}`, sections: [] });
        }
    }, [assessment, jobIdFromUrl]);

    const handleAddSection = () => {
        if (!localAssessment) return;
        setLocalAssessment(prev => ({
            ...prev,
            sections: [
                ...prev.sections,
                { id: `section-${Date.now()}`, title: '', questions: [] }
            ]
        }));
    };

    const handleAddQuestion = (sectionIndex, type) => {
        if (!localAssessment) return;
        const newSections = [...localAssessment.sections];
        let newQuestion = { id: `question-${Date.now()}`, type, text: '', required: false };
        if (type === 'single-choice' || type === 'multi-choice') {
            newQuestion.options = [''];
        }
        if (type === 'numeric') {
            newQuestion.validation = { min: 0, max: 100 };
        }
        newSections[sectionIndex].questions.push(newQuestion);
        setLocalAssessment({ ...localAssessment, sections: newSections });
    };

    const handleUpdateQuestion = (sectionIndex, questionIndex, updatedQuestion) => {
        if (!localAssessment) return;
        const newSections = [...localAssessment.sections];
        newSections[sectionIndex].questions[questionIndex] = updatedQuestion;
        setLocalAssessment({ ...localAssessment, sections: newSections });
    };

    const handleDeleteQuestion = (sectionIndex, questionIndex) => {
        if (!localAssessment) return;
        const newSections = [...localAssessment.sections];
        newSections[sectionIndex].questions.splice(questionIndex, 1);
        setLocalAssessment({ ...localAssessment, sections: newSections });
    };

    const handleToggleRequired = (sectionIndex, questionIndex) => {
        if (!localAssessment) return;
        const newSections = [...localAssessment.sections];
        const question = newSections[sectionIndex].questions[questionIndex];
        newSections[sectionIndex].questions[questionIndex] = {
            ...question,
            required: !question.required,
        };
        setLocalAssessment({ ...localAssessment, sections: newSections });
    };

    const handleSave = () => {
        if (!localAssessment || !localAssessment.jobId) {
            alert('A job ID is required to save an assessment.');
            return;
        }
        dispatch(saveNewAssessment(localAssessment));
        alert('Assessment saved!');
    };

    const allQuestions = localAssessment?.sections?.flatMap(s => s.questions) || [];

    if (status === 'loading') {
        return <div>Loading assessment...</div>;
    }

    if (!localAssessment) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.builderPane}>
                <h1>Assessment Builder</h1>
                <button onClick={handleAddSection}>Add Section</button>
                <div className={styles.sectionsList}>
                    {localAssessment.sections.map((section, sectionIndex) => (
                        <div key={section.id} className={styles.section}>
                            <input type="text" placeholder="Section Title" value={section.title} onChange={e => {
                                const newSections = [...localAssessment.sections];
                                newSections[sectionIndex].title = e.target.value;
                                setLocalAssessment({ ...localAssessment, sections: newSections });
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
                <AssessmentPreview assessmentData={localAssessment} />
            </div>
        </div>
    );
};

export default AssessmentBuilder;