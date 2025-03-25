import { useNavigate } from "react-router-dom";
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import SubjectsList from "../Subjects/SubjectsList";
import Loader from "../Loader";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
const BASE_URL = import.meta.env.VITE_BASE_URL;

function TeacherDash() {
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [loading, setLoading] = useState(true); // Full-screen loader state
  const subjectsRef = useRef(null);
  const featuresRef = useRef(null);
  const topRef = useRef(null);
  const navigate = useNavigate();

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found! Redirecting to login...");
          navigate("/login");
          return;
        }
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(`${BASE_URL}/api/teacher/profile`, {
          headers,
          withCredentials: true,
        });

        // Check if the teacher is verified
        if (!response.data.isVerified) {
          navigate("/waiting-approval");
          return;
        }

        setTeacherInfo(response.data);
      } catch (error) {
        console.error(
          "Error fetching teacher dashboard data",
          error.response?.data || error.message || error
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherInfo();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem("teacherId");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(8px)",
          zIndex: 9999,
        }}
      >
        <Loader />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Teacher Dashboard
      </Typography>

      <Box ref={topRef} sx={{ mb: 3 }}>
        <Card
          sx={{
            backgroundColor: "#121212",
            color: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.8)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(255, 255, 255, 0.1)",
              }}
            >
              Name: {teacherInfo.name}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(255, 255, 255, 0.1)",
              }}
            >
              Branch: {teacherInfo.department}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(255, 255, 255, 0.1)",
              }}
            >
              Email: {teacherInfo.email}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => scrollToSection(subjectsRef)}
        >
          Subjects
        </Button>
      </Box>

      <Box ref={subjectsRef} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Subjects
        </Typography>
        <Typography variant="body1" gutterBottom>
          List of subjects handled by the teacher.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate("/teacher/meetings")}
          >
            📹 Start Meeting
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/create-subject")}
          >
            + Create Subject
          </Button>
        </Box>

        <SubjectsList />
      </Box>

      <Box ref={featuresRef} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Other Features
        </Typography>
        <Typography variant="body1">
          Additional functionalities for teachers.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button variant="outlined" onClick={() => scrollToSection(topRef)}>
          ↑ Back to Top
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
}

export default TeacherDash;
