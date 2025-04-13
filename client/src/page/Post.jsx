import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./Post.css";
function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/getpostByid/${id}`)
      .then((result) => setPost(result.data))
      .catch((err) => {
        setError("Failed to load post.");
        console.error(err);
      });
  }, [id]);

  const handleDelete = () => {
    console.log("Attempting to delete post with ID:", id);
    axios
      .delete(`http://localhost:3001/deletepost/${id}`)
      .then((result) => {
        console.log(result.data);
        if (result.data === "Success") {
          navigate("/");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to delete post.");
      });
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!post) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="post-container">
      <img src={`http://localhost:3001/${post.file}`} alt="" />
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      <div>
        <Link to={`/editpost/${post._id}`}>Edit</Link>

        <button onClick={() => handleDelete(post._id)}>Delete</button>
      </div>
    </div>
  );
}

export default Post;
