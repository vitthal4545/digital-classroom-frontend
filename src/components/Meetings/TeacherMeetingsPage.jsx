import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button, Typography, Box, Paper } from "@mui/material";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const TeacherMeetingsPage = () => {
  const [meetingId, setMeetingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const createMeeting = async () => {
      try {
        let teacherid = localStorage.getItem("teacherId");
        const response = await axios.post(`${BASE_URL}/api/meetings/create`, {
          title: "New Meeting",
          teacherId: teacherid,
        });
        setMeetingId(response.data.meetingId);
      } catch (error) {
        console.error("Error creating meeting", error);
      }
    };
    createMeeting();
  }, []);

  return (
    <Container component={Paper} sx={{ padding: 4, textAlign: "center" }}>
      <Typography variant="h4">Teacher Meeting</Typography>
      {meetingId ? (
        <>
          <Typography variant="h6">Meeting ID: {meetingId}</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate(`/video-call/${meetingId}`)}
          >
            Start Meeting
          </Button>
        </>
      ) : (
        <Typography>Creating meeting...</Typography>
      )}
    </Container>
  );
};

export default TeacherMeetingsPage;
