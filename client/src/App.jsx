import React, { createContext, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./page/Register";
import Login from "./page/Login";
import Home from "./page/Home";
import axios from "axios";
import Create from "./page/Create";
import Profile from "./page/Profile";
import Post from "./page/Post";
import EditPost from "./page/EditPost";
import "./App.css";

export const userContext = createContext();

function App() {
  const [user, setUser] = useState(null); // Initialize as null for loading state
  const [loading, setLoading] = useState(true); // Loading state to show until user data is fetched
  const [error, setError] = useState(null); // To handle any errors

  useEffect(() => {
    axios
      .get("http://localhost:3001/", { withCredentials: true })
      .then((response) => {
        setUser(response.data); // Set user data
        setLoading(false); // Set loading to false once user data is fetched
      })
      .catch((err) => {
        setError("Failed to fetch user data.");
        setLoading(false); // Ensure loading is set to false even on error
        console.log(err);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching user data
  }

  if (error) {
    return <div>{error}</div>; // Display error message if fetching fails
  }

  return (
    <div>
      <userContext.Provider value={user}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            {user && (
              <>
                <Route path="/create" element={<Create />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/post/:id" element={<Post />} />
                <Route path="/editpost/:id" element={<EditPost />} />
              </>
            )}
          </Routes>
        </Router>
      </userContext.Provider>
    </div>
  );
}

export default App;
