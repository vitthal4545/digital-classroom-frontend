import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Loader from "../Loader";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const DarkCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#1e1e1e",
  color: "#ffffff",
  boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)",
  borderRadius: "10px",
  marginBottom: "20px",
}));

const AttachmentImage = styled("img")({
  width: "100%",
  maxHeight: "200px",
  objectFit: "cover",
  borderRadius: "8px",
  marginTop: "10px",
});

function SubjectPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [teacher, setTeacher] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setTeacher(response.data.createdBy._id);
      } catch (error) {
        console.error("Error fetching subject details:", error);
      } finally {
        setLoading(false);
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
    joinedStudents(subjectId);
  }, [subjectId]);

  const handleCreateAnnouncement = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("teacherId", teacher);
      if (link) {
        formData.append("link", link);
      }
      if (file) formData.append("file", file);

      const response = await axios.post(
        `${BASE_URL}/api/announcements/${subjectId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAnnouncements((prev) => [response.data, ...prev]);
      toast.success("Announcement Create Successfully 🙂🎉", {
        position: "top-right",
      });
      navigate(`/subjectpage/${subjectId}`);
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast.error("Announcement Creation Failed 🤡", {
        position: "top-right",
      });
    }
  };

  const handleDeleteSubject = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/subjects/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Subject Deleted Successfully 🎉", {
        position: "top-right",
      });
      setTimeout(() => {
        navigate("/teacher-dash");
      }, 1500);
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error("Failed to delete subject 🤡", { position: "top-right" });
    }
  };

  const joinedStudents = async (subjectId) => {
    try {
      if (!subjectId) {
        console.error("❌ subjectId is missing in frontend!");
        toast.error("Invalid subject! Please select a valid subject.");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/announcements/joined-students/${subjectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudent(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load student data 🤡", { position: "top-right" });
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/announcements/${announcementId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Announcement Deleted 💀🚮 🎉", {
        position: "top-right",
      });
      setAnnouncements(announcements.filter((a) => a._id !== announcementId));
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const handleDownloadAttachment = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    link.click();
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
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#121212",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <Typography variant="h4" gutterBottom>
        {subject.name}
      </Typography>
      <Typography variant="h6">Teacher: {subject.createdBy.name}</Typography>
      <Typography variant="body1">
        Description: {subject.description}
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<DeleteIcon />}
        sx={{ marginTop: "20px" }}
        onClick={() => setOpenDeleteDialog(true)}
      >
        Delete Subject
      </Button>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        sx={{
          "& .MuiDialog-paper": {
            background: "rgba(30, 30, 30, 0.9)", // Dark semi-transparent background
            backdropFilter: "blur(10px)", // Frosted glass effect
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{ color: "#ff6b6b", fontWeight: "bold", fontSize: "1.4rem" }}
        >
          ⚠️ Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#e0e0e0", fontSize: "1rem" }}>
            Are you sure you want to delete this subject? This action{" "}
            <b>cannot be undone</b>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{
              color: "#90caf9",
              "&:hover": { backgroundColor: "rgba(144, 202, 249, 0.1)" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteSubject}
            sx={{
              backgroundColor: "#ff6b6b",
              color: "white",
              "&:hover": { backgroundColor: "#d63d3d" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {subject.createdBy.userType === "teacher" && (
        <DarkCard sx={{ padding: "20px", marginTop: "20px" }}>
          <Typography variant="h5">Create Announcement</Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ input: { color: "white" }, label: { color: "white" } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Content"
            variant="outlined"
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ input: { color: "white" }, label: { color: "white" } }}
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginTop: "10px" }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Attach a link"
            variant="outlined"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            sx={{ input: { color: "white" }, label: { color: "white" } }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateAnnouncement}
            sx={{ marginTop: "10px" }}
          >
            Post Announcement
          </Button>
        </DarkCard>
      )}

      {announcements.length === 0 ? (
        <Typography>No announcements yet.</Typography>
      ) : (
        announcements.map((announcement, index) => (
          <DarkCard key={announcement._id || index}>
            <CardContent>
              <Typography variant="h5">{announcement.title}</Typography>
              <Typography>{announcement.content}</Typography>
              <Typography variant="caption" color="gray">
                {new Date(announcement.timestamp).toLocaleString()}
              </Typography>
              {announcement.link && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  🔗{" "}
                  <a
                    href={announcement.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#90caf9" }}
                  >
                    {announcement.link}
                  </a>
                </Typography>
              )}
              {announcement.attachments && (
                <Box mt={2}>
                  {announcement.attachments.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <AttachmentImage
                      src={announcement.attachments}
                      alt="Attachment"
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
                    variant="outlined"
                    onClick={() =>
                      handleDownloadAttachment(announcement.attachments)
                    }
                    sx={{
                      marginTop: "10px",
                      color: "white",
                      borderColor: "white",
                    }}
                  >
                    📥 Download
                  </Button>
                </Box>
              )}
              {subject.createdBy.userType === "teacher" && (
                <>
                  <br />
                  <Button
                    variant="outlined"
                    sx={{
                      mt: 2,
                      color: "#90caf9",
                      borderColor: "#90caf9",
                      marginRight: "1rem",
                    }}
                    onClick={() =>
                      navigate(`/announcements/${announcement._id}`)
                    }
                  >
                    View Comments
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    color="secondary"
                    onClick={() => handleDeleteAnnouncement(announcement._id)}
                    sx={{ marginTop: "10px" }}
                  >
                    Delete
                  </Button>
                </>
              )}
            </CardContent>
          </DarkCard>
        ))
      )}

      <Typography variant="h5" style={{ marginTop: "20px" }}>
        Students
      </Typography>
      <TableContainer component={Paper} style={{ backgroundColor: "#222" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "#fff" }}>Name</TableCell>
              <TableCell style={{ color: "#fff" }}>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {student.length > 0 ? (
              student.map((stu) => (
                <TableRow key={stu._id}>
                  <TableCell style={{ color: "#fff" }}>{stu.name}</TableCell>
                  <TableCell style={{ color: "#fff" }}>{stu.email}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  style={{ color: "#fff", textAlign: "center" }}
                >
                  No students joined yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        sx={{ marginTop: "20px" }}
        onClick={() => navigate(`/teacher-dash`)}
      >
        Back
      </Button>
    </Box>
  );
}

export default SubjectPage;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Subjects.css";
// import Button from "@mui/material/Button";
// import DeleteIcon from "@mui/icons-material/Delete";

// function SubjectPage() {
//   const { subjectId } = useParams();
//   const navigate = useNavigate();
//   const [subject, setSubject] = useState(null);
//   // const [userType, setUserType] = useState("");
//   const [announcements, setAnnouncements] = useState([]);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [file, setFile] = useState(null);
//   const [link, setLink] = useState("");
//   // const [attachments, setAttachments] = useState("");
//   // const [errorMessage, setErrorMessage] = useState("");

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   // Handle Link Input
//   const handleLinkChange = (e) => {
//     setLink(e.target.value);
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     const fetchSubjectDetails = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/subjects/${subjectId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         setSubject(response.data);
//         console.log("fetched sub data:-", response.data);
//       } catch (error) {
//         console.error("Error fetching subject details:", error);
//       }
//     };

//     const fetchAnnouncements = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `http://localhost:5000/api/announcements/${subjectId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setAnnouncements(response.data);
//         console.log("Subject id from fetchAnnoucement:- ", subjectId);
//         console.log("Fetched Annoucements:- ", response.data);
//       } catch (error) {
//         console.error("Error fetching announcements:", error);
//       }
//     };

//     fetchSubjectDetails();
//     fetchAnnouncements();
//     console.log("Updated subject state:", subject);
//   }, [subjectId]);

//   const handleCreateAnnouncement = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("content", content);
//       if (link) {
//         formData.append("link", link);
//       }
//       if (file) formData.append("file", file);

//       console.log("formdata ", [...formData]);

//       const response = await axios.post(
//         `http://localhost:5000/api/announcements/${subjectId}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       console.log("✅ Response:", response.data);
//       navigate(`/subjectpage/${subjectId}`);
//     } catch (error) {
//       console.error("Error creating announcement:", error);
//     }
//   };

//   const handleDeleteAnnouncement = async (announcementId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(
//         `http://localhost:5000/api/announcements/${announcementId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setAnnouncements(announcements.filter((a) => a._id !== announcementId));
//     } catch (error) {
//       console.error("Error deleting announcement:", error);
//     }
//   };

//   // Handle attachment download
//   const handleDownloadAttachment = (url) => {
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = url.split("/").pop();
//     link.click();
//   };

//   if (!subject) {
//     return <p>Loading subject details...</p>;
//   }

//   return (
//     <div className="subject-container">
//       <h2>{subject.name}</h2>
//       <p>Teacher: {subject.createdBy.name}</p>
//       <p>Teacher: {subject.createdBy.userType}</p>
//       <p>Description: {subject.description}</p>

//       {subject.createdBy.userType === "teacher" && (
//         <div className="announcement-form">
//           <div className="announcement-form-child">
//             <h2>Create Announcement</h2>
//             <input
//               type="text"
//               placeholder="Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//             <textarea
//               placeholder="Content"
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//             />

//             <input type="file" onChange={handleFileChange} />
//             {file && (
//               <p>
//                 {file.name} <button onClick={() => setFile("")}>Remove</button>
//               </p>
//             )}

//             <input
//               type="text"
//               placeholder="Attach a link"
//               value={link}
//               onChange={handleLinkChange}
//             />
//             <button className="postBtn" onClick={handleCreateAnnouncement}>
//               Post Announcement
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="announcements-container">
//         {announcements.length === 0 ? (
//           <p>No announcements yet.</p>
//         ) : (
//           announcements.map((announcement) => (
//             <div key={announcement._id} className="announcement-card">
//               <div className="announcement-left">
//                 <div className="announcement-content">
//                   <h4>{announcement.title}</h4>
//                   <p>{announcement.content}</p>
//                   <p className="timestamp">
//                     {new Date(announcement.timestamp).toLocaleString()}
//                   </p>
//                 </div>
//                 {subject.createdBy.userType === "teacher" && (
//                   <>
//                     <Button
//                       variant="outlined"
//                       startIcon={<DeleteIcon />}
//                       onClick={() => handleDeleteAnnouncement(announcement._id)}
//                     >
//                       Delete
//                     </Button>
//                     {/* <button className="delete-btn">Delete</button> */}
//                   </>
//                 )}
//               </div>

//               <div className="announcement-right">
//                 {announcement.attachments && (
//                   <div className="attachments">
//                     <h5>Attachments:</h5>
//                     {announcement.attachments.match(
//                       /\.(jpg|jpeg|png|gif)$/i
//                     ) ? (
//                       <img
//                         src={announcement.attachments}
//                         alt="attachment"
//                         className="attachment-image"
//                       />
//                     ) : (
//                       <a
//                         href={announcement.attachments}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="attachment-link"
//                       >
//                         {announcement.attachments.split("/").pop()}
//                       </a>
//                     )}
//                     <button
//                       onClick={() =>
//                         handleDownloadAttachment(announcement.attachments)
//                       }
//                       className="download-btn"
//                     >
//                       📥 Download
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       <br />
//       <br />
//       <button className="" onClick={() => navigate(`/teacher-dash`)}>
//         Back
//       </button>
//     </div>
//   );
// }

// export default SubjectPage;
