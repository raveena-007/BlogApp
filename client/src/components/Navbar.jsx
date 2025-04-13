import React, { useContext } from "react";
import "./Navbar.css";
import { userContext } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const user = useContext(userContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .get("http://localhost:3001/logout", { withCredentials: true })
      .then((res) => {
        if (res.data === "Logout successful") navigate(0); // Reloads the page
      })
      .catch((err) => {
        console.error(err);
        alert("Logout failed. Please try again.");
      });
  };

  return (
    <div className="navbar">
      <div className="navbar-brand" onClick={() => navigate("/")}>
        <h3>Blogify</h3>
      </div>
      <div className="nav-links">
        <span className="nav-link" onClick={() => navigate("/")}>
          Home
        </span>
        {user.name && (
          <span className="nav-link" onClick={() => navigate("/create")}>
            Create
          </span>
        )}
        <span className="nav-link" onClick={() => navigate("/profile")}>
          Profile
        </span>
      </div>
      <div className="navbar-auth">
        {user.name ? (
          <input
            type="button"
            value="Logout"
            onClick={handleLogout}
            className="logout-button"
          />
        ) : (
          <h5 onClick={() => navigate("/register")} className="link">
            Register/Login
          </h5>
        )}
      </div>
    </div>
  );
}

export default Navbar;
