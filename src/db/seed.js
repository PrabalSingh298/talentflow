// src/db/seed.js
import { db } from './index';
import { nanoid } from '@reduxjs/toolkit';

const createJob = (index) => ({
    id: `job-${nanoid()}`,
    title: `Job Title ${index}`,
    slug: `job-slug-${index}`,
    status: index % 2 === 0 ? 'active' : 'archived',
    tags: ['React', 'JavaScript', 'Node.js'],
    order: index,
});

export const seedDatabase = async () => {
    console.log('Attempting to seed database...');
    try {
        const hasJobs = (await db.jobs.count()) > 0;
        if (!hasJobs) {
            console.log("Database is empty. Seeding...");
            const jobs = Array.from({ length: 25 }, (_, i) => createJob(i));
            await db.jobs.bulkAdd(jobs);
            console.log('Successfully seeded with 25 jobs!');
        } else {
            console.log('Database already seeded. Skipping.');
        }
    } catch (error) {
        console.error("Failed to seed database:", error);
    }
};