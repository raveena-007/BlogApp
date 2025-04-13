import React, { useEffect, useState } from "react";
import "./Create.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, description });
    axios
      .put(
        `http://localhost:3001/editpost/${id}`,
        { title, description },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data); // Debugging response
        if (res.data === "Success") {
          navigate("/");
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/getpostByid/${id}`)
      .then((result) => {
        console.log(result.data); // Debug fetched data
        setTitle(result.data.title);
        setDescription(result.data.description);
      })
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter the Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <textarea
            name="description"
            placeholder="Enter the Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          ></textarea>
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
}

export default EditPost;
