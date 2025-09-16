// src/db/seed.js
import { db } from './index';
import { nanoid } from '@reduxjs/toolkit';

const JOB_TITLES = [
    "Frontend Engineer", "Backend Engineer", "Product Designer",
    "UX/UI Designer", "Data Scientist", "DevOps Engineer",
    "Full Stack Developer", "Software Architect", "QA Engineer"
];

const JOB_TAGS = [
    "React", "JavaScript", "TypeScript", "Node.js", "Express",
    "Python", "Django", "SQL", "AWS", "Figma", "Sketch", "Docker"
];

const CANDIDATE_STAGES = [
    "applied", "screen", "tech", "offer", "hired", "rejected"
];

const CANDIDATE_NAMES = [
    "John Doe", "Jane Smith", "Alex Johnson", "Emily Davis", "Michael Brown",
    "Sarah Wilson", "David Garcia", "Jessica Martinez", "Chris Lee", "Priya Sharma",
    "Ryan Thomas", "Olivia White", "Daniel Clark", "Sophia Rodriguez", "Matthew Lopez"
];

const JOB_STATUSES = [
    "active", "archived", "inactive"
];

// List of HR members for @mentions
const HR_MEMBERS = ["Priya", "Raj", "Sarah", "Tom"];

// Function to create a mock note
const createNote = (candidateId, text) => ({
    id: `note-${nanoid()}`,
    candidateId,
    text,
    mentions: text.includes('@') ? text.split(' ').filter(word => word.startsWith('@')).map(mention => mention.substring(1)) : [],
    createdAt: new Date().toISOString(),
});

const createJob = (index) => {
    const title = JOB_TITLES[Math.floor(Math.random() * JOB_TITLES.length)];
    const slug = title.toLowerCase().replace(/\s+/g, '-') + `-${index}`;

    const tags = new Set();
    while (tags.size < 3) {
        tags.add(JOB_TAGS[Math.floor(Math.random() * JOB_TAGS.length)]);
    }

    const status = JOB_STATUSES[Math.floor(Math.random() * JOB_STATUSES.length)];

    return {
        id: `job-${nanoid()}`,
        title: title,
        slug: slug,
        status: status,
        tags: Array.from(tags),
        order: index,
        description: `This is a detailed description for the ${title} position. It involves working with cutting-edge technologies and collaborating with a dynamic team.`
    };
};

// Updated createCandidate function to not include notes
const createCandidate = (index, jobId) => {
    const name = CANDIDATE_NAMES[Math.floor(Math.random() * CANDIDATE_NAMES.length)];
    const email = name.toLowerCase().replace(/\s/g, '.') + `@email.com`;
    const candidateId = `cand-${nanoid()}`;

    const availableStages = ["applied", "screen", "tech", "offer", "hired"];
    const timelineLength = Math.floor(Math.random() * (availableStages.length)) + 1;

    let timeline = [];
    let currentTimestamp = Date.now() - (Math.floor(Math.random() * 1000000000));

    for (let i = 0; i < timelineLength; i++) {
        timeline.push({
            stage: availableStages[i],
            timestamp: new Date(currentTimestamp + (i * 100000000)).toISOString()
        });
    }

    const finalStage = timeline[timeline.length - 1].stage;

    return {
        id: candidateId,
        name: name,
        email: email,
        stage: finalStage,
        jobId: jobId,
        timeline: timeline
    };
};

const ASSESSMENT_QUESTION_TYPES = [
    'short-text', 'long-text', 'single-choice', 'multi-choice', 'numeric', 'file-upload'
];
const ASSESSMENT_OPTIONS = [
    ['Yes', 'No'],
    ['React', 'Vue', 'Angular', 'Svelte'],
    ['Mobile', 'Web', 'Backend'],
    ['Less than 1 year', '1-3 years', '3-5 years', '5+ years']
];
const ASSESSMENT_TEXTS = [
    'Please describe your experience.',
    'What is your favorite programming language?',
    'How many years of experience do you have with [Skill]?',
    'Which of the following frameworks are you proficient in?',
    'Please upload your resume.'
];

const createAssessment = (jobId) => {
    const questions = [];
    const numQuestions = 10;

    for (let i = 0; i < numQuestions; i++) {
        const type = ASSESSMENT_QUESTION_TYPES[Math.floor(Math.random() * ASSESSMENT_QUESTION_TYPES.length)];
        let question = {
            id: nanoid(),
            type: type,
            text: ASSESSMENT_TEXTS[Math.floor(Math.random() * ASSESSMENT_TEXTS.length)],
            required: Math.random() > 0.5,
        };

        if (type === 'single-choice' || type === 'multi-choice') {
            question.options = ASSESSMENT_OPTIONS[Math.floor(Math.random() * ASSESSMENT_OPTIONS.length)];
        }

        if (type === 'numeric') {
            question.validation = { min: 0, max: 10 };
        }

        questions.push(question);
    }

    return {
        jobId: jobId,
        sections: [
            {
                id: nanoid(),
                title: `Technical Assessment`,
                questions: questions
            }
        ]
    };
};

export const seedDatabase = async () => {
    console.log('Attempting to seed database...');
    try {
        const hasJobs = (await db.jobs.count()) > 0;
        if (!hasJobs) {
            console.log("Database is empty. Seeding...");

            const jobs = Array.from({ length: 25 }, (_, i) => createJob(i));
            await db.jobs.bulkAdd(jobs);
            console.log('Successfully seeded with 25 jobs!');

            const jobIds = jobs.map(j => j.id);

            const candidates = Array.from({ length: 1000 }, (_, i) => {
                const randomJobId = jobIds[Math.floor(Math.random() * jobIds.length)];
                return createCandidate(i, randomJobId);
            });
            await db.candidates.bulkAdd(candidates);
            console.log('Successfully seeded with 1000 candidates!');

            // Seed 3 assessments with 10 questions each
            const assessments = jobIds.slice(0, 3).map((jobId) => createAssessment(jobId));
            await db.assessments.bulkAdd(assessments);
            console.log('Successfully seeded with 3 assessments!');

            const sampleCandidateIds = candidates.slice(0, 3).map(c => c.id);
            const notes = sampleCandidateIds.flatMap(id => [
                createNote(id, `Initial screening call went well. @Priya should review.`),
                createNote(id, `Technical assessment scheduled for next week. Noted on the calendar.`),
            ]);
            await db.notes.bulkAdd(notes);
            console.log('Successfully seeded with sample notes!');

        } else {
            console.log('Database already seeded. Skipping.');
        }
    } catch (error) {
        console.error("Failed to seed database:", error);
    }
};