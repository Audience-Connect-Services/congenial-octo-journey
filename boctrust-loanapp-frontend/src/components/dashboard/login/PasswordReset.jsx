import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Form, Button } from "react-bootstrap";

import HeadLine from "../../shared/Headline";
import "./Login.css";

import resetAdminPass from "./resetAdminPass";

const PasswordReset = () => {
  const { token } = useParams();
  console.log("token", token);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    loginAs: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);

  //   handle on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //   clear fields
  const clearField = () => {
    setFormData({
      newPassword: "",
      confirmPassword: "",
      loginAs: "",
    });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, loginAs } = formData;

    if (loginAs === "staff") {
      console.log("staff");
      // change password at the backend
      // redirect to login page
      // clear fields
      const response = await resetAdminPass(newPassword, token);
      if (response.success) {
        clearField();
        navigate("/login");
      } else {
        setErrorMessage(response.error);
      }
    } else if (loginAs === "customer") {
      console.log("customer");
    }
  };

  // check if user is logged in and redirect to dashboard
  const navigate = useNavigate();

  return (
    <div className="LogContainer">
      <div>
        <HeadLine text="Create a New Password" />
        <p className="Error">{errorMessage}</p>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="my-4">
            <Form.Control
              type={revealPassword ? "text" : "password"}
              placeholder="Enter new password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setRevealPassword(!revealPassword)}
              className="reveal-btn"
            >
              {revealPassword ? "Hide" : "Show"}
            </Button>
          </Form.Group>

          <Form.Group className="mb-3 password-group">
            <Form.Control
              type={revealPassword ? "text" : "password"}
              placeholder="Confirm password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setRevealPassword(!revealPassword)}
              className="reveal-btn"
            >
              {revealPassword ? "Hide" : "Show"}
            </Button>
          </Form.Group>
          <Form.Group className="mb-3">
            <p className="asText">I am a:</p>
            <div className="asBox">
              <div>
                <input
                  type="radio"
                  name="loginAs"
                  className="radio"
                  value="staff"
                  onChange={handleChange}
                />
                <label className="Remember">Staff </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="loginAs"
                  className="radio"
                  value="customer"
                  onChange={handleChange}
                />
                <label className="Remember">Customer </label>
              </div>
            </div>
          </Form.Group>

          <Button type="submit" className="LoginBtn">
            Change Password
          </Button>
        </Form>
      </div>
    </div>
  );
};

PasswordReset.propTypes = {
  setLogin: PropTypes.func,
};

export default PasswordReset;
