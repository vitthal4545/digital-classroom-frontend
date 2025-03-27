import { useNavigate } from "react-router-dom";
import "./welcome.css";

function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="welcome-container">
      <video className="welcome-video-small" autoPlay loop muted playsInline>
        <source src="/Classroom.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <h1 className="welcome-heading">Welcome to Digital Classroom</h1>
      <div className="button-container">
        <button onClick={() => navigate("/signup")}>Signup</button>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>
  );
}

export default Welcome;

// import { useNavigate } from "react-router-dom";

// function Welcome() {
//   const navigate = useNavigate();
//   return (
//     <div className="welcome-container">
//       <h1>Welcome to Digital Classroom</h1>
//       <div className="button-container">
//         <button onClick={() => navigate("/signup")}>Signup</button>
//         <button onClick={() => navigate("/login")}>Login</button>
//       </div>
//     </div>
//   );
// }

// export default Welcome;
