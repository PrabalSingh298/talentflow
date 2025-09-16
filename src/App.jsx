// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./modules/homepage/Homepage";
import JobsBoard from "./modules/jobs/JobsBoard";
import JobDetail from "./modules/jobs/JobDetail";
import CandidatesList from "./modules/candidates/CandidatesList";
import CandidateProfile from "./modules/candidates/CandidateProfile";
import AssessmentsPage from "./modules/assessments/AssessmentsPage";
import AssessmentsList from "./modules/assessments/AssessmentsList";
import AssessmentBuilder from "./modules/assessments/AssessmentBuilder";
import AssessmentViewer from "./modules/assessments/AssessmentViewer";

import NotesTest from "./modules/candidates/NotesTest";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/jobs/:jobId" element={<JobDetail />} />
        <Route path="/jobs" element={<JobsBoard />} />
        <Route path="/candidates" element={<CandidatesList />} />
        <Route path="/candidates/:id" element={<CandidateProfile />} />
        <Route path="/assessments" element={<AssessmentsPage />} />
        <Route path="/assessments/list" element={<AssessmentsList />} />
        <Route path="/assessments/builder" element={<AssessmentBuilder />} /> // Updated route
        <Route path="/assessments/view/:jobId" element={<AssessmentViewer />} />
        <Route path="/notes" element={<NotesTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;