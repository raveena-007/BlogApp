import React, { useEffect, useState, useContext } from "react";
import "./Profile.css";
import axios from "axios";
import { userContext } from "../App";

function Profile() {
  const user = useContext(userContext);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (user && user._id) {
      axios
        .get(`http://localhost:3001/userPosts/${user._id}`, {
          withCredentials: true,
        })
        .then((res) => setUserPosts(res.data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  return (
    <div className="profile-container">
      <div className="profile-info">
        <img
          src={`http://localhost:3001/Images/${
            user.profilePic || "default.jpg"
          }`}
          alt="Profile"
          className="profile-pic"
        />
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Bio: {user.bio || "No bio available"}</p>
      </div>

      <div className="user-posts">
        <h3>Your Posts</h3>
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <div className="post-card" key={post._id}>
              <h4>{post.title}</h4>
              <p>{post.description.slice(0, 100)}...</p>
              <a href={`/post/${post._id}`} className="view-post">
                View Post
              </a>
            </div>
          ))
        ) : (
          <p>You haven't written any posts yet.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
