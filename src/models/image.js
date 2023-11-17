const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema(
  {
    filename: String,
    path: String,
    size: Number,
  },
  {
    timestamps: true,
  }
);
const Image = mongoose.model("image", imageSchema);
module.exports = {
  Image: Image,
};
