import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const [posts, setPost] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/getPosts")
      .then((posts) => {
        setPost(posts.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleNavigation = (id) => {
    navigate(`/post/${id}`);
  };

  return (
    <div className="home-container">
      {posts.map((post) => (
        <div
          key={post._id}
          className="post-card"
          onClick={() => handleNavigation(post._id)}
        >
          <img
            className="post-image"
            src={`http://localhost:3001/Images${post.file}`}
            alt=""
          />
          <div className="post-content">
            <h2 className="post-title">{post.title}</h2>
            <p className="post-description">{post.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
