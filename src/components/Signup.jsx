import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    studentClass: "",
    userType: "",
    department: "",
    gender: "",
    mobileNumber: "",
  });

  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOTP = async () => {
    if (!formData.email) {
      alert("Please enter an email first.");
      return;
    }
    try {
      setIsSendingOtp(true);
      const response = await axios.post(`${BASE_URL}/api/auth/send-otp`, {
        email: formData.email,
      });
      alert(response.data.message);
      setIsOtpSent(true);
    } catch (error) {
      console.error("OTP Send Error:", error.response); // Debugging
      alert(error.response.data.message || "Failed to send OTP");
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
        email: formData.email,
        otp,
      });
      alert(response.data.message);
      setIsOtpVerified(true);
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      alert("Please verify your email first");
      return;
    }
    if (!isOtpSent) {
      alert("OTP not sent yet!");
      return;
    }
    if (
      formData.userType === "student" &&
      formData.mobileNumber.length !== 10
    ) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/signup`,
        formData
      );
      alert(response.data.message);

      const userType = response.data.user.userType;
      if (userType === "hod") {
        navigate("/hod-dash");
      } else if (userType === "student") {
        navigate("/student-dash");
      } else if (userType === "teacher") {
        navigate("/teacher-dash");
      }

      return;
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <>
      <div className="main-form">
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Enter your FullName"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter Valid Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            {!isOtpSent ? (
              <button type="button" onClick={sendOTP}>
                {isSendingOtp ? "Sending..." : "Verify Email"}
              </button>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    setOtp(numericValue);
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={verifyOTP}
                  disabled={isOtpVerified}
                >
                  {isOtpVerified ? "Verified ✅" : "Verify OTP"}
                </button>
                {isOtpSent && !isOtpVerified && (
                  <button type="button" onClick={sendOTP}>
                    Resend OTP
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="form-row">
            <input
              type="password"
              name="password"
              placeholder="Enter Password here"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label>Department:</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Your Department
              </option>
              <option value="CSE">Computer Science & Engineering</option>
              <option value="IT">Information Technology</option>
              <option value="MECH">Mechanical</option>
              <option value="CIVIL">Civil</option>
              <option value="ECE">Electronics & Communication</option>
            </select>
          </div>
          <div className="form-row">
            <label>Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="userType">Select Your Role</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Your Role
              </option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="hod">HOD</option>
            </select>
          </div>
          {formData.userType === "student" && (
            <>
              <div className="form-row">
                <label htmlFor="studentClass">Select Your Class:</label>
                <select
                  name="studentClass"
                  value={formData.studentClass}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Your Class
                  </option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
              <div className="form-row">
                <label>Mobile Number:</label>
                <input
                  type="text" // Using text to prevent browser-specific issues with `type="number"`
                  name="mobileNumber"
                  placeholder="Enter Mobile Number"
                  value={formData.mobileNumber}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                    if (value.length > 10) value = value.slice(0, 10); // Restrict to 10 digits
                    setFormData((prev) => ({ ...prev, mobileNumber: value })); // Update state
                  }}
                  required
                  maxLength="10" // Ensures max input is 10 characters
                />
              </div>
            </>
          )}
          <div className="form-row">
            <button type="submit" disabled={!isOtpVerified}>
              Signup
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signup;
