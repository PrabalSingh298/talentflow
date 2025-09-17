// src/modules/jobs/JobsBoard.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { loadJobs, reorderJob, optimisticReorder } from '../../store/jobsSlice';
import JobListItem from '../../components/JobListItem';
import JobFormModal from '../../components/JobFormModal';
import JobsFilter from '../../components/JobsFilter';
import PaginationControls from '../../components/PaginationControls';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function JobsBoard() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate(); // Hook for navigation

    const { list: jobs, status, totalCount, currentPage, pageSize } = useSelector((state) => state.jobs);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);

    // Centralized function to get all filters from the URL
    const getFiltersFromURL = () => {
        const searchParams = new URLSearchParams(location.search);
        return {
            search: searchParams.get('search') || '',
            status: searchParams.get('status') || '',
            page: parseInt(searchParams.get('page')) || 1,
            pageSize: parseInt(searchParams.get('pageSize')) || 10, // Default to 10
            sort: searchParams.get('sort') || ''
        };
    };

    // Correctly load jobs whenever the URL's search parameters change
    useEffect(() => {
        dispatch(loadJobs(getFiltersFromURL()));
    }, [dispatch, location.search]);

    const handlePageChange = (newPage) => {
        const currentParams = getFiltersFromURL();
        const newParams = new URLSearchParams({
            ...currentParams,
            page: newPage,
        });
        navigate(`?${newParams.toString()}`);
    };

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
        // Reload jobs with all current filters to see the newly added/edited job
        dispatch(loadJobs(getFiltersFromURL()));
    };

    const onDragEnd = (result) => {
        if (!result.destination || result.source.index === result.destination.index) {
            return;
        }

        const fromIndex = result.source.index;
        const toIndex = result.destination.index;

        // Dispatch the optimistic update first
        dispatch(optimisticReorder({
            fromOrder: jobs[fromIndex].order,
            toOrder: jobs[toIndex].order,
        }));

        const draggedJob = jobs.find(job => job.id === result.draggableId);
        if (draggedJob) {
            // Then, dispatch the persistent update to IndexedDB
            dispatch(reorderJob({
                id: draggedJob.id,
                fromOrder: jobs[fromIndex].order,
                toOrder: jobs[toIndex].order,
            }));
        }
    };

    if (status === 'loading') {
        return <div>Loading jobs...</div>;
    }

    const sortedJobs = [...jobs].sort((a, b) => a.order - b.order);

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
                            {sortedJobs.map((job, index) => (
                                <Draggable key={job.id} draggableId={job.id} index={index}>
                                    {(provided) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
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

            {/* Pass the page change handler to PaginationControls */}
            <PaginationControls
                totalCount={totalCount}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />

            <JobFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialJobData={editingJob}
            />
        </div>
    );
}

export default JobsBoard;