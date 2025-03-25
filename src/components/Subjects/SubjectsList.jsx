import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const SubjectsList = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const teacherId = localStorage.getItem("teacherId");

        if (!teacherId) {
          console.error("Teacher ID not found in localStorage!");
          return;
        }

        const res = await axios.get(
          `${BASE_URL}/api/subjects?teacherId=${teacherId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setSubjects(res.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#121212",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h5" style={{ color: "white", marginBottom: "20px" }}>
        Subjects
      </Typography>

      <Grid container spacing={3}>
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <Grid item xs={12} sm={6} md={4} key={subject._id}>
              <Card
                sx={{
                  backgroundColor: "#1e1e1e",
                  color: "white",
                  minHeight: "180px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography variant="h6">{subject.name}</Typography>
                  <Typography variant="body2">
                    Semester: {subject.semester}
                  </Typography>
                  <Typography variant="body2">
                    Class: {subject.className}
                  </Typography>
                  <Typography variant="body2">
                    Teacher: {subject.teacherName}
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#007bff",
                    color: "white",
                    margin: "10px",
                  }}
                  onClick={() => navigate(`/subjectpage/${subject._id}`)}
                >
                  View Details
                </Button>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" style={{ color: "white" }}>
            No subjects found.
          </Typography>
        )}
      </Grid>
    </div>
  );
};

export default SubjectsList;
