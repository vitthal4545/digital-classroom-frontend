import { useNavigate } from "react-router-dom";

function WaitingApproval() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Your account is awaiting approval from the HOD.</h2>
      <p>Please wait until an admin verifies your account.</p>
      <button onClick={() => navigate("/")}>Go Back</button>
    </div>
  );
}

export default WaitingApproval;
