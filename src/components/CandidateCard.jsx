// src/components/CandidateCard.jsx
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import styles from './CandidateCard.module.css';

const CandidateCard = ({ candidate, index }) => {
    return (
        <Draggable draggableId={candidate.id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={styles.card}
                >
                    <Link to={`/candidates/${candidate.id}`} className={styles.link}>
                        <h4 className={styles.name}>{candidate.name}</h4>
                        <p className={styles.email}>{candidate.email}</p>
                    </Link>
                </div>
            )}
        </Draggable>
    );
};

export default CandidateCard;