import PropTypes from "prop-types";
import "./TopNavbar.css";
import { useDispatch } from "react-redux";
import { handleLogout } from "../../../services/logout";

const TopNavber = ({ title, user = "Femi Akinwade" }) => {

  // handle logout
  const dispatch = useDispatch();
  const logoutUser = async () => {
    try {
      await handleLogout();
      dispatch(logoutUser());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="Inline mb-4">
      <div>
        <h4 id="Title">{title}</h4>
      </div>
      <button onClick={logoutUser} className="" style={{ backgroundColor: "#145098", marginRight: "10px", color: "white", fontSize: "23px", borderRadius: "5px", paddingLeft: "20px", paddingRight: "20px", paddingTop: "6px", paddingBottom: "6px" }}>Log Out</button>
    </div>
  );
};

TopNavber.propTypes = {
  title: PropTypes.string,
  user: PropTypes.string,
};

export default TopNavber;
