import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./modules/homepage/Homepage";
import JobsBoard from "./modules/jobs/JobsBoard";
import CandidatesList from "./modules/candidates/CandidatesList";
import AssessmentBuilder from "./modules/assessments/AssessmentBuilder";
import ResponseTest from "./modules/assessments/ResponseTest";
import NotesTest from "./modules/candidates/NotesTest";
import "./App.css";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/jobs" element={<JobsBoard />} />
        <Route path="/candidates" element={<CandidatesList />} />
        <Route path="/assessments/:jobId" element={<AssessmentBuilder jobId="job-1" />} />
        <Route path="/responses" element={<ResponseTest />} />
        <Route path="/notes" element={<NotesTest />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
