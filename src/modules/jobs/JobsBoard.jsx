// src/modules/jobs/JobsBoard.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { loadJobs, addJob, reorderJob, optimisticReorder } from '../../store/jobsSlice';
import JobListItem from '../../components/JobListItem';
import JobFormModal from '../../components/JobFormModal';
import JobsFilter from '../../components/JobsFilter';
import PaginationControls from '../../components/PaginationControls';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function JobsBoard() {
    const dispatch = useDispatch();
    const location = useLocation();
    const { list: jobs, status, totalCount, pageSize } = useSelector((state) => state.jobs);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const filters = {
            search: searchParams.get('search'),
            status: searchParams.get('status'),
            page: searchParams.get('page'),
            pageSize: searchParams.get('pageSize'),
            sort: searchParams.get('sort')
        };

        dispatch(loadJobs(filters));
    }, [dispatch, location.search]);

    const handleOpenCreateModal = () => {
        setEditingJob(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (jobData) => {
        setEditingJob(jobData);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingJob(null);
        const searchParams = new URLSearchParams(location.search);
        const filters = {
            search: searchParams.get('search'),
            status: searchParams.get('status'),
        };
        dispatch(loadJobs(filters));
    };

    // Corrected onDragEnd handler
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const draggedJob = jobs.find(job => job.id === result.draggableId);
        if (!draggedJob) {
            return;
        }

        const fromIndex = result.source.index;
        const toIndex = result.destination.index;

        // Check if the order has actually changed
        if (fromIndex === toIndex) {
            return;
        }

        // Dispatch the optimistic update first
        dispatch(optimisticReorder({
            fromOrder: jobs[fromIndex].order,
            toOrder: jobs[toIndex].order,
        }));

        // Then, dispatch the API call to persist the change
        dispatch(reorderJob({
            id: draggedJob.id,
            fromOrder: jobs[fromIndex].order,
            toOrder: jobs[toIndex].order,
        }));
    };

    if (status === 'loading') {
        return <div>Loading jobs...</div>;
    }

    if (status === 'succeeded' && jobs.length === 0) {
        return <div>No jobs found.</div>;
    }

    return (
        <div>
            <h1>Jobs Board</h1>
            <button onClick={handleOpenCreateModal}>Create New Job</button>
            <JobsFilter />

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="job-list">
                    {(provided) => (
                        <ul
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {jobs.map((job, index) => (
                                <Draggable key={job.id} draggableId={job.id} index={index}>
                                    {(provided) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                ...provided.draggableProps.style,
                                            }}
                                        >
                                            <JobListItem job={job} />
                                            <button onClick={() => handleOpenEditModal(job)}>Edit</button>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>

            <PaginationControls totalCount={totalCount} pageSize={pageSize} />

            <JobFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialJobData={editingJob}
            />
        </div>
    );
}

export default JobsBoard;