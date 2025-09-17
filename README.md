             README: TalentFlow
************************************************************
Prerequisites:
Node.js: Ensure you have a recent version installed.
npm: Comes bundled with Node.js.
Code Editor: A tool like VS Code is recommended.




Installation:

1. Clone the repository:
    git clone https://github.com/PrabalSingh298/talentflow

2. Navigate to the project directory:
    cd <your-project-folder>

3. Install the dependencies:
    npm install

4. Start the development server:
    npm run dev



Architecture and Technical Decisions:

Frontend: The application is built with React and uses Vite for a fast development experience. State management is handled by Redux Toolkit to ensure predictable data flow.

Data Management: Data is stored locally in the browser's IndexedDB. Dexie.js is used as a wrapper to simplify database interactions. This architecture makes TalentFlow an offline-first Single-Page Application (SPA) with no backend dependency.

Routing: React Router is used for client-side navigation. All routing is handled on the frontend, which requires specific host configurations for deployment.



Key Features:

Job Management: Create, edit, and make status archived to job listings. The Jobs board supports drag-and-drop reordering to easily prioritize listings, pagination of 10 job per page and search feature by job name and status of job. Each job has proper Job Page.

Candidate Kanban: A visual Kanban board allows HR members to track candidates through stages like applied, screen, tech, and hired using an intuitive drag-and-drop interface.

Candidate Profiles: Detailed profiles for each candidate, including a timeline of their progress and a notes section for internal communication. Noteslist of previous notes is also available.

Offline Support: All data is persisted locally, enabling the application to work without an internet connection.

Seeding Logic: Seed the database intially with 1000 candidates, 25 jobs, 3 assessment with at least 10 questions in each assessment one our platform loaded on the system.

Assessment Page: Provide facility of view or edit the existing assessments and create new assessments. There are six types of question can be added Long text question, short text question, single choice questions, multiple choice question, numerical type questions, file upload questions.




Issues and Technical Decisions

Mock API Dependency: The initial project architecture was dependent on a mock API (MSW) for data fetching. This was a major issue for production deployment.

State Immutability: We encountered TypeError issues due to direct state mutation. These were resolved by implementing immutable update patterns across all components and Redux reducers, ensuring state changes are handled correctly.



Deployment

1. Run the build command:
    npm run build

2. The optimized assets will be generated in the dist directory.

3. For correct client-side routing, a _redirects file is used to redirect all traffic to index.html. This file is already in the public folder.

4. The dist folder can be deployed manually via drag-and-drop or by connecting to a Git repository for continuous deployment.

