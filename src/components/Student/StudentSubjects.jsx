import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
const BASE_URL = import.meta.env.VITE_BASE_URL;

function StudentSubjects() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchSubjectDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/subjects/${subjectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubject(response.data);
      } catch (error) {
        console.error("Error fetching subject details:", error);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/announcements/${subjectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchSubjectDetails();
    fetchAnnouncements();
  }, [navigate, subjectId]);

  const handleDownloadAttachment = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    link.click();
  };

  if (!subject) {
    return (
      <Typography variant="h6" color="white">
        Loading subject details...
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ color: "white", mt: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold" }}
      >
        {subject.name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <strong>Teacher:</strong> {subject.createdBy.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Description:</strong> {subject.description}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {announcements.length === 0 ? (
          <Typography variant="body1">No announcements yet.</Typography>
        ) : (
          announcements.map((announcement) => (
            <Grid item xs={12} key={announcement._id}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Attachments
              </Typography>
              <Card
                sx={{
                  backgroundColor: "#1e1e1e",
                  color: "white",
                  boxShadow: 3,
                  p: 2,
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {announcement.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {announcement.content}
                  </Typography>
                  <Typography variant="caption" color="gray">
                    {new Date(announcement.timestamp).toLocaleString()}
                  </Typography>
                  {announcement.attachments && (
                    <Paper
                      elevation={3}
                      sx={{ backgroundColor: "#252525", p: 2, mt: 2 }}
                    >
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Attachment:
                      </Typography>
                      {announcement.attachments.match(
                        /\.(jpg|jpeg|png|gif)$/i
                      ) ? (
                        <img
                          src={announcement.attachments}
                          alt="attachment"
                          style={{ width: "100%", borderRadius: "8px" }}
                        />
                      ) : (
                        <a
                          href={announcement.attachments}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#90caf9" }}
                        >
                          {announcement.attachments.split("/").pop()}
                        </a>
                      )}
                      <Button
                        variant="contained"
                        startIcon={<CloudDownloadIcon />}
                        onClick={() =>
                          handleDownloadAttachment(announcement.attachments)
                        }
                        sx={{ mt: 1, backgroundColor: "#1976d2" }}
                      >
                        Download
                      </Button>
                      <br />
                      <Button
                        variant="outlined"
                        sx={{ mt: 2, color: "#90caf9", borderColor: "#90caf9" }}
                        onClick={() =>
                          navigate(`/announcements/${announcement._id}`)
                        }
                      >
                        View Comments
                      </Button>
                    </Paper>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Button
        variant="contained"
        sx={{ mt: 3, backgroundColor: "#d32f2f" }}
        onClick={() => navigate(`/student-dash`)}
      >
        Back
      </Button>
    </Container>
  );
}

export default StudentSubjects;
