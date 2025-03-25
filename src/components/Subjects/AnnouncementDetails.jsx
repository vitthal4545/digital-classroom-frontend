import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const StyledContainer = styled(Container)({
  backgroundColor: "#121212",
  color: "#fff",
  minHeight: "100vh",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const StyledCard = styled(Card)({
  backgroundColor: "#1E1E1E",
  color: "#fff",
  marginBottom: "20px",
  padding: "16px",
  width: "100%",
  maxWidth: "800px",
});

const StyledButton = styled(Button)({
  backgroundColor: "#6200EA",
  color: "#fff",
  marginTop: "10px",
  "&:hover": {
    backgroundColor: "#3700B3",
  },
});

const StyledTextField = styled(TextField)({
  backgroundColor: "#333",
  borderRadius: "5px",
  marginTop: "10px",
  "& input": {
    color: "#fff", // Fixes black text issue
  },
  "& fieldset": {
    borderColor: "#555",
  },
});

function AnnouncementDetails() {
  const navigate = useNavigate();
  const { announcementId } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [subject, setsubject] = useState("");

  useEffect(() => {
    const fetchAnnouncementDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await axios.get(
          `${BASE_URL}/api/announcements/single/${announcementId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAnnouncement(response.data);
        setsubject(response.data.subjectId);
      } catch (error) {
        console.error("Error fetching announcement:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/comments/${announcementId}`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchAnnouncementDetails();
    fetchComments();
  }, [announcementId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/comments/${announcementId}`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([...comments, response.data.newComment]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!announcement) {
    return (
      <Typography color="white">Loading announcement details...</Typography>
    );
  }

  return (
    <StyledContainer maxWidth="md">
      {/* Announcement Details */}
      <StyledCard>
        <Typography variant="h4" gutterBottom>
          {announcement.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {announcement.content}
        </Typography>
        <Typography variant="caption" color="gray">
          {new Date(announcement.timestamp).toLocaleString()}
        </Typography>
        <br />
        {/* <Button
          variant="contained"
          sx={{ marginTop: "20px" }}
          onClick={() => navigate(`/student/subject/${subject}`)}
        >
          Back
        </Button> */}
      </StyledCard>

      {/* Comments Section */}
      <StyledCard>
        <Typography variant="h5" gutterBottom>
          Comments
        </Typography>
        <List sx={{ width: "100%" }}>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        color="#BB86FC"
                        sx={{ fontWeight: "bold" }}
                      >
                        {comment.user?.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          color="#fff"
                          component="span"
                          sx={{ display: "block", marginTop: "5px" }}
                        >
                          {comment.text}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="gray"
                          sx={{ display: "block", marginTop: "3px" }}
                        >
                          {new Date(comment.timestamp).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider sx={{ backgroundColor: "#444" }} />
              </React.Fragment>
            ))
          ) : (
            <Typography color="gray" sx={{ textAlign: "center", padding: 2 }}>
              No comments yet.
            </Typography>
          )}
        </List>

        {/* Comment Input */}
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <StyledButton onClick={handleAddComment} fullWidth>
          Add Comment
        </StyledButton>
      </StyledCard>
    </StyledContainer>
  );
}

export default AnnouncementDetails;
