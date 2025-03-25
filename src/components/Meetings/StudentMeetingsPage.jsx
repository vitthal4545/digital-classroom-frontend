import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";

const StudentMeetingsPage = () => {
  const [meetingCode, setMeetingCode] = useState("");
  const navigate = useNavigate();

  const handleJoinMeeting = () => {
    if (!meetingCode.trim()) {
      alert("Please enter a valid meeting code");
      return;
    }
    navigate(`/video-call/${meetingCode}`);
  };

  return (
    <Container component={Paper} sx={{ padding: 4, textAlign: "center" }}>
      <Typography variant="h4">Join a Meeting</Typography>
      <TextField
        label="Meeting Code"
        variant="outlined"
        fullWidth
        value={meetingCode}
        onChange={(e) => setMeetingCode(e.target.value)}
        sx={{ my: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleJoinMeeting}>
        Join Meeting
      </Button>
    </Container>
  );
};

export default StudentMeetingsPage;
