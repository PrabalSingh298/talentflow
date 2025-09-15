// src/modules/candidates/CandidateKanban.jsx
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import CandidateCard from '../../components/CandidateCard';
import styles from './CandidateKanban.module.css';

const CandidateKanban = ({ candidates }) => { // Accept candidates as a prop
    const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];

    const candidatesByStage = stages.reduce((acc, stage) => {
        acc[stage] = candidates.filter(c => c.stage === stage);
        return acc;
    }, {});

    return (
        <div className={styles.kanbanBoard}>
            {stages.map(stage => (
                <div key={stage} className={styles.kanbanColumn}>
                    <h3 className={styles.columnTitle}>{stage}</h3>
                    <Droppable droppableId={stage}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={styles.cardList}
                            >
                                {candidatesByStage[stage].map((candidate, index) => (
                                    <CandidateCard key={candidate.id} candidate={candidate} index={index} />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            ))}
        </div>
    );
};

export default CandidateKanban;