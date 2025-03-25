import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Skeleton,
} from "@mui/material";
const BASE_URL = import.meta.env.VITE_BASE_URL;

function StudentDash() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [addSubject, setAddSubject] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${BASE_URL}/api/student/me`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        // Check if the teacher is verified
        if (!res.data.isVerified) {
          navigate("/waiting-approval");
          return;
        }
        setStudent(res.data);
        console.log("student info :-", res.data);
      } catch (error) {
        console.error("Error fetching student info:", error);
      }
    };

    fetchStudentInfo();
  }, []);

  useEffect(() => {
    const fetchJoinedSubjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(`${BASE_URL}/api/student/joined-subjects`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        console.log("joined subjects:-", res.data);
        setSubjects(res.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    if (student) {
      fetchJoinedSubjects();
    }
  }, [student]);

  const handleAddSubject = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !addSubject) return;

      const res = await axios.post(
        `${BASE_URL}/api/student/join-subject`,
        { joinCode: addSubject },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setSubjects([...subjects, res.data]);
      setAddSubject("");
      toast.success("Subject added successfully! 🎉");
    } catch (error) {
      console.error("Error adding subject:", error);
      toast.error(error.response?.data?.message || "Failed to add subject. ❌");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("token");
      navigate("/login");
      toast.info("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Try again. ❌");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        padding: "20px",
        color: "#fff",
      }}
    >
      <div>
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        {/* The rest of your JSX remains unchanged */}
      </div>
      <Paper
        style={{ padding: "20px", backgroundColor: "#1e1e1e", color: "#fff" }}
      >
        {student ? (
          <>
            <Typography variant="h4">Welcome, {student.name}</Typography>
            <Typography variant="subtitle1">
              Department: {student.department}
            </Typography>
            <Typography variant="subtitle1">Class: {student.class}</Typography>
            <Typography variant="subtitle1">Semester: {student.sem}</Typography>
            <Typography variant="subtitle1">Email: {student.email}</Typography>
          </>
        ) : (
          <Skeleton variant="text" width={300} height={40} />
        )}
      </Paper>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "15px" }}
        onClick={() => navigate("/student/meetings")}
      >
        🎥 Join Meeting
      </Button>

      <Typography variant="h5" style={{ marginTop: "20px" }}>
        Add New Subject
      </Typography>
      <TextField
        fullWidth
        label="Enter subject code"
        variant="outlined"
        value={addSubject}
        onChange={(e) => setAddSubject(e.target.value)}
        style={{
          marginTop: "10px",
          backgroundColor: "#333",
          borderRadius: "5px",
        }}
        InputProps={{ style: { color: "#fff" } }}
      />
      <Button
        variant="contained"
        color="success"
        onClick={handleAddSubject}
        style={{ marginTop: "10px" }}
      >
        Add Subject
      </Button>

      <Typography variant="h5" style={{ marginTop: "20px" }}>
        Subjects
      </Typography>
      <Grid container spacing={2} style={{ marginTop: "10px" }}>
        {loading ? (
          Array.from({ length: 4 }, (_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" width="100%" height={150} />
            </Grid>
          ))
        ) : subjects.length > 0 ? (
          subjects.map((subject, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={subject._id || `subject-${index}`}
            >
              <Card style={{ backgroundColor: "#1e1e1e", color: "#fff" }}>
                <CardContent>
                  <Typography variant="h6">{subject.name}</Typography>
                  <Typography variant="body2">
                    Semester: {subject.sem}
                  </Typography>
                  <Typography variant="body2">
                    Class: {subject.className}
                  </Typography>
                  <Typography variant="body2">
                    Teacher: {subject.createdBy.name}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "10px" }}
                    onClick={() => navigate(`/student/subject/${subject._id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No subjects found.</Typography>
        )}
      </Grid>

      <Button
        variant="contained"
        color="secondary"
        style={{ marginTop: "20px" }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
}

export default StudentDash;
