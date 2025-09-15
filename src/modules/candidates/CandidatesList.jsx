// src/modules/candidates/CandidatesList.jsx
import React, { useEffect, useState } from 'react'; // Add useState
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { loadCandidates, updateCandidateStage } from '../../store/candidatesSlice';
import CandidateKanban from './CandidateKanban';
import CandidateFilter from '../../components/CandidateFilter';
import CandidateFormModal from '../../components/CandidateFormModal'; // Import the new modal
import { DragDropContext } from 'react-beautiful-dnd';

function CandidatesList() {
    const dispatch = useDispatch();
    const location = useLocation();
    const { list: candidates, status } = useSelector(state => state.candidates);
    const [isModalOpen, setIsModalOpen] = useState(false); // Add modal state

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const filters = {
            search: searchParams.get('search'),
            stage: searchParams.get('stage')
        };
        dispatch(loadCandidates(filters));
    }, [dispatch, location.search]);

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination || destination.droppableId === source.droppableId) {
            return;
        }
        dispatch(updateCandidateStage({ id: draggableId, stage: destination.droppableId }));
    };

    if (status === 'loading') {
        return <div>Loading candidates...</div>;
    }

    return (
        <div>
            <h1>Candidates Board</h1>
            <button onClick={() => setIsModalOpen(true)}>Create Candidate</button>
            <CandidateFilter />
            {candidates.length === 0 ? (
                <div>No candidates found.</div>
            ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                    <CandidateKanban candidates={candidates} />
                </DragDropContext>
            )}
            <CandidateFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

export default CandidatesList;