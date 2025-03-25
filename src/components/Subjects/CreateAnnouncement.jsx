import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

function CreateAnnouncement() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle Link Input
  const handleLinkChange = (e) => {
    setLink(e.target.value);
  };

  const handleCreateAnnouncement = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (link) {
        formData.append("link", link);
      }
      if (file) formData.append("file", file);

      console.log("formdata ", [...formData]);

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
      navigate(`/subjectpage/${subjectId}`);
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  return (
    <div>
      <h2>Create Announcement</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input type="file" onChange={handleFileChange} />
      {file && (
        <p>
          {file.name} <button onClick={() => setFile("")}>Remove</button>
        </p>
      )}

      <input
        type="text"
        placeholder="Attach a link"
        value={link}
        onChange={handleLinkChange}
      />
      <button onClick={handleCreateAnnouncement}>Post Announcement</button>
    </div>
  );
}

export default CreateAnnouncement;
