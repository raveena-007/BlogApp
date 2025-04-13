const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
 title: String,
  description: String,
  file: String,
});

const PostModel = mongoose.model("posts", PostSchema);
module.exports = PostModel;
