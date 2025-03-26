import React, { useState } from "react";

const TeacherMeeting = () => {
  const [roomName, setRoomName] = useState("");

  const handleStart = () => {
    const newRoom = "DigitalClass_" + Date.now(); // Unique room name
    setRoomName(newRoom);
    const meetingURL = `https://meet.jit.si/${newRoom}`;
    window.open(meetingURL, "_blank"); // Open in new tab
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Start Live Class</h1>
      <button
        onClick={handleStart}
        className="bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg hover:bg-green-700"
      >
        Start Meeting
      </button>
      {roomName && (
        <p className="mt-4 text-sm text-gray-600">
          Share this room name with students:{" "}
          <span className="font-semibold">{roomName}</span>
        </p>
      )}
    </div>
  );
};

export default TeacherMeeting;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Container, Button, Typography, Box, Paper } from "@mui/material";
// const BASE_URL = import.meta.env.VITE_BASE_URL;

// const TeacherMeetingsPage = () => {
//   const [meetingId, setMeetingId] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const createMeeting = async () => {
//       try {
//         let teacherid = localStorage.getItem("teacherId");
//         const response = await axios.post(`${BASE_URL}/api/meetings/create`, {
//           title: "New Meeting",
//           teacherId: teacherid,
//         });
//         setMeetingId(response.data.meetingId);
//       } catch (error) {
//         console.error("Error creating meeting", error);
//       }
//     };
//     createMeeting();
//   }, []);

//   return (
//     <Container component={Paper} sx={{ padding: 4, textAlign: "center" }}>
//       <Typography variant="h4">Teacher Meeting</Typography>
//       {meetingId ? (
//         <>
//           <Typography variant="h6">Meeting ID: {meetingId}</Typography>
//           <Button
//             variant="contained"
//             color="primary"
//             sx={{ mt: 2 }}
//             onClick={() => navigate(`/video-call/${meetingId}`)}
//           >
//             Start Meeting
//           </Button>
//         </>
//       ) : (
//         <Typography>Creating meeting...</Typography>
//       )}
//     </Container>
//   );
// };

// export default TeacherMeetingsPage;
