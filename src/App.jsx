import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Signup from "./components/Signup";
import HODDash from "./components/HOD/HODDash";
import StudentDash from "./components/Student/StudentDash";
import TeacherDash from "./components/Teacher/TeacherDash";
import CreateSubjectPage from "./components/Subjects/CreateSubjectPage";
import WaitingApproval from "./components/WaitingApproval";
import SubjectPage from "./components/Subjects/SubjectPage";
import CreateAnnouncement from "./components/Subjects/CreateAnnouncement";
import StudentSubjectPage from "./components/Student/StudentSubjects";
import AcademicRecords from "./components/HOD/AcademicRecords";
import AnnouncementDetails from "./components/Subjects/AnnouncementDetails";
import TeacherMeetingsPage from "./components/Meetings/TeacherMeetingsPage";
import StudentMeetingsPage from "./components/Meetings/StudentMeetingsPage";
import VideoCall from "./components/Meetings/VideoCall";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/hod-dash" element={<HODDash />} />
      <Route path="/student-dash" element={<StudentDash />} />
      <Route path="/teacher-dash" element={<TeacherDash />} />
      <Route path="/create-subject" element={<CreateSubjectPage />} />
      <Route path="/waiting-approval" element={<WaitingApproval />} />
      <Route path="/subjectpage/:subjectId" element={<SubjectPage />} />
      <Route path="/academic-record" element={<AcademicRecords />} />
      <Route
        path="/student/subject/:subjectId"
        element={<StudentSubjectPage />}
      />
      <Route
        path="/create-announcement/:subjectId"
        element={<CreateAnnouncement />}
      />
      <Route
        path="/announcements/:announcementId"
        element={<AnnouncementDetails />}
      />
      <Route path="/teacher/meetings" element={<TeacherMeetingsPage />} />
      <Route path="/student/meetings" element={<StudentMeetingsPage />} />
      <Route path="/video-call/:meetingId" element={<VideoCall />} />
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
