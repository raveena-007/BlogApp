import React, { useState } from "react";
import "./Create.css";
import axios from "axios";

function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    axios
      .post("http://localhost:3001/create", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data === "Success") {
          window.location.href = "/";
        }
      })
      .catch((err) => console.log(err));
  };

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
          <input
            type="file"
            className="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
}

export default Create;
