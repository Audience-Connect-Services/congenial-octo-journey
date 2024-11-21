/* eslint-disable no-undef */
import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/reducers/adminAuthReducer";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import "./Navigation.css";
import { Link } from "react-router-dom";
import { handleLogout } from "../../services/logout";

const TopNav = ({ settings }) => {
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

  // get current admin
  const currentUser = useSelector((state) => state.adminAuth.user);

  // change navbar color on scroll
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector(".Nav");
      if (nav) {
        nav.classList.toggle("Sticky", window.scrollY > 0);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="TopNavContainer ">
      <div className="Topnav my-2">
        <div className="BrandCon">
          <Link to="/">
            <img
              src="/images/boclogo.jpeg"
              alt="Boctrust Microfinance Bank Logo"
              width="150px"
            />
          </Link>
        </div>
        <div className="Hero">
          <h1 className="Welcome">
            {settings?.siteTitle
              ? settings?.siteTitle
              : "Welcome to BOCTRUST Microfinance Bank Limited"}
          </h1>
        </div>
        <div>
          <button className="CallUs">Licenced by CBN</button>
          <img src="/images/cbn.jpeg" alt="cbn" height={40} />
        </div>
      </div>


    </div>
  );
};

TopNav.propTypes = {
  settings: PropTypes.any,
};

export default TopNav;
