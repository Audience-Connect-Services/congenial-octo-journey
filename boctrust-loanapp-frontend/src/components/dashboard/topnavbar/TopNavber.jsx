import PropTypes from "prop-types";
import "./TopNavbar.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { performLogout } from "../../../redux/reducers/adminAuthReducer";

const TopNavber = ({ title, user = "Femi Akinwade" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate

  const logoutUserHandler = async () => {
    try {
      await dispatch(performLogout()); // Dispatch the thunk
      navigate("/login"); // Redirect after successful logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="Inline mb-4">
      <div>
        <h4 id="Title">{title}</h4>
      </div>
      <button
        onClick={logoutUserHandler}
        className=""
        style={{
          backgroundColor: "#145098",
          marginRight: "10px",
          color: "white",
          fontSize: "23px",
          borderRadius: "5px",
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingTop: "6px",
          paddingBottom: "6px",
        }}
      >
        Log Out
      </button>
    </div>
  );
};

TopNavber.propTypes = {
  title: PropTypes.string,
  user: PropTypes.string,
};

export default TopNavber;
