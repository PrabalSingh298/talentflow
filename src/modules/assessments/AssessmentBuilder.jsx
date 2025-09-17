// src/modules/assessments/AssessmentBuilder.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { loadAssessment, saveNewAssessment, saveAssessment, clearAssessment } from '../../store/assessmentsSlice';
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
import NavBar from '../../components/NavBar'

const AssessmentBuilder = () => {
    const location = useLocation();
    const jobIdFromUrl = new URLSearchParams(location.search).get('jobId');

    const dispatch = useDispatch();

    const assessmentFromStore = useSelector(state => state.assessments.current);
    const status = useSelector(state => state.assessments.status);

    const [localAssessment, setLocalAssessment] = useState(null);

    // This effect handles loading an existing assessment or preparing a new one
    useEffect(() => {
        if (jobIdFromUrl) {
            dispatch(loadAssessment(jobIdFromUrl));
        } else {
            setLocalAssessment({
                jobId: nanoid(), // Generate a unique jobId for the new assessment
                title: 'Untitled Assessment',
                sections: [],
                // Do NOT generate an ID here. Let the database handle it on add.
            });
        }

        return () => {
            dispatch(clearAssessment());
        };
    }, [dispatch, jobIdFromUrl]);

    // This effect syncs local state with Redux store for editing existing assessments
    useEffect(() => {
        if (status === 'succeeded' && assessmentFromStore && assessmentFromStore.jobId === jobIdFromUrl) {
            setLocalAssessment(assessmentFromStore);
        }
    }, [assessmentFromStore, jobIdFromUrl, status]);

    const handleAddSection = () => {
        if (!localAssessment) return;
        setLocalAssessment(prev => ({
            ...prev,
            sections: [
                ...prev.sections,
                { id: nanoid(), title: 'New Section', questions: [] }
            ]
        }));
    };

    const handleAddQuestion = (sectionIndex, type) => {
        if (!localAssessment) return;
        setLocalAssessment(prev => {
            const newSections = [...prev.sections];
            const newQuestions = [...newSections[sectionIndex].questions, {
                id: nanoid(),
                type,
                text: '',
                required: false,
                ...(type === 'single-choice' || type === 'multi-choice' ? { options: [''] } : {}),
                ...(type === 'numeric' ? { validation: { min: 0, max: 100 } } : {})
            }];
            newSections[sectionIndex] = { ...newSections[sectionIndex], questions: newQuestions };
            return { ...prev, sections: newSections };
        });
    };

    const handleUpdateQuestion = useCallback((sectionIndex, questionIndex, updatedQuestion) => {
        if (!localAssessment) return;
        setLocalAssessment(prev => {
            const newSections = [...prev.sections];
            const newQuestions = [...newSections[sectionIndex].questions];
            newQuestions[questionIndex] = updatedQuestion;
            newSections[sectionIndex] = { ...newSections[sectionIndex], questions: newQuestions };
            return { ...prev, sections: newSections };
        });
    }, [localAssessment]);

    const handleDeleteQuestion = (sectionIndex, questionIndex) => {
        if (!localAssessment) return;
        setLocalAssessment(prev => {
            const newSections = [...prev.sections];
            const newQuestions = [...newSections[sectionIndex].questions];
            newQuestions.splice(questionIndex, 1);
            newSections[sectionIndex] = { ...newSections[sectionIndex], questions: newQuestions };
            return { ...prev, sections: newSections };
        });
    };

    const handleToggleRequired = (sectionIndex, questionIndex) => {
        if (!localAssessment) return;
        setLocalAssessment(prev => {
            const newSections = [...prev.sections];
            const newQuestions = [...newSections[sectionIndex].questions];
            newQuestions[questionIndex] = {
                ...newQuestions[questionIndex],
                required: !newQuestions[questionIndex].required,
            };
            newSections[sectionIndex] = { ...newSections[sectionIndex], questions: newQuestions };
            return { ...prev, sections: newSections };
        });
    };

    const handleSave = async () => {
        if (!localAssessment || !localAssessment.jobId) {
            alert('A job ID is required to save an assessment.');
            return;
        }

        try {
            if (assessmentFromStore && assessmentFromStore.id) {
                // Corrected: Ensure the ID is always present for updates
                const assessmentToSave = { ...localAssessment, id: assessmentFromStore.id };
                await dispatch(saveAssessment(assessmentToSave)).unwrap();
                alert('Assessment updated!');
            } else {
                await dispatch(saveNewAssessment(localAssessment)).unwrap();
                alert('Assessment saved!');
            }
        } catch (error) {
            console.error("Failed to save assessment:", error);
            alert("Failed to save assessment. Check console for details.");
        }
    };

    if (!localAssessment || !localAssessment.sections) {
        return <div>Loading assessment...</div>;
    }

    const allQuestions = localAssessment.sections.flatMap(s => s.questions);

    const questionComponents = {
        'short-text': ShortTextQuestion,
        'long-text': LongTextQuestion,
        'single-choice': SingleChoiceQuestion,
        'multi-choice': MultiChoiceQuestion,
        'numeric': NumericQuestion,
        'file-upload': FileUploadQuestion,
    };

    return (
        <>
            <NavBar />
            <div className={styles.container}>

                <div className={styles.builderPane}>
                    <h1>Assessment Builder</h1>
                    <input
                        type="text"
                        placeholder="Assessment Title"
                        value={localAssessment.title || ''}
                        onChange={(e) => setLocalAssessment({ ...localAssessment, title: e.target.value })}
                        className={styles.titleInput}
                    />
                    <button onClick={handleAddSection}>Add Section</button>
                    <div className={styles.sectionsList}>
                        {localAssessment.sections.map((section, sectionIndex) => (
                            <div key={section.id} className={styles.section}>
                                <input
                                    type="text"
                                    placeholder="Section Title"
                                    value={section.title}
                                    onChange={e => {
                                        const newSections = [...localAssessment.sections];
                                        const updatedSection = { ...newSections[sectionIndex], title: e.target.value };
                                        newSections[sectionIndex] = updatedSection;
                                        setLocalAssessment({ ...localAssessment, sections: newSections });
                                    }}
                                />
                                <div>
                                    {Object.keys(questionComponents).map(type => (
                                        <button key={type} onClick={() => handleAddQuestion(sectionIndex, type)}>
                                            Add {type.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>
                                {section.questions.map((question, questionIndex) => {
                                    const QuestionComponent = questionComponents[question.type];
                                    if (!QuestionComponent) return null;
                                    return (
                                        <div key={question.id}>
                                            <QuestionComponent
                                                question={question}
                                                onUpdate={updatedQuestion => handleUpdateQuestion(sectionIndex, questionIndex, updatedQuestion)}
                                                onDelete={() => handleDeleteQuestion(sectionIndex, questionIndex)}
                                            />
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
        </>);
};

export default AssessmentBuilder;