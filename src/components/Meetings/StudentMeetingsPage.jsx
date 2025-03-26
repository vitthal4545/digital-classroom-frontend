import React, { useState } from "react";

const StudentMeeting = () => {
  const [roomName, setRoomName] = useState("");

  const handleJoin = () => {
    if (roomName.trim() === "") return alert("Please enter room name!");
    const meetingURL = `https://meet.jit.si/${roomName}`;
    window.open(meetingURL, "_blank");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Join Live Class</h1>
      <input
        type="text"
        placeholder="Enter Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="px-4 py-2 border rounded-lg mb-4"
      />
      <button
        onClick={handleJoin}
        className="bg-blue-600 text-white px-5 py-3 rounded-xl shadow-lg hover:bg-blue-700"
      >
        Join Meeting
      </button>
    </div>
  );
};

export default StudentMeeting;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Container, TextField, Button, Typography, Paper } from "@mui/material";

// const StudentMeetingsPage = () => {
//   const [meetingCode, setMeetingCode] = useState("");
//   const navigate = useNavigate();

//   const handleJoinMeeting = () => {
//     if (!meetingCode.trim()) {
//       alert("Please enter a valid meeting code");
//       return;
//     }
//     navigate(`/video-call/${meetingCode}`);
//   };

//   return (
//     <Container component={Paper} sx={{ padding: 4, textAlign: "center" }}>
//       <Typography variant="h4">Join a Meeting</Typography>
//       <TextField
//         label="Meeting Code"
//         variant="outlined"
//         fullWidth
//         value={meetingCode}
//         onChange={(e) => setMeetingCode(e.target.value)}
//         sx={{ my: 2 }}
//       />
//       <Button variant="contained" color="primary" onClick={handleJoinMeeting}>
//         Join Meeting
//       </Button>
//     </Container>
//   );
// };

// export default StudentMeetingsPage;
