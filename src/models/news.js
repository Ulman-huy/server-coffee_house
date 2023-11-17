const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    author: { type: String },
    idAuthor: { type: String },
  },
  {
    timestamps: true,
  }
);

const News = mongoose.model("news", newsSchema);

module.exports = {
  News: News,
};
