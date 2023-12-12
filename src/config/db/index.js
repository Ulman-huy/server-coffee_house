const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://devyyuh:0DLgARLGRt5DXkN0@coffee.u667nzn.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
      }
    );
    console.log("Connect database successfully!");
  } catch (error) {
    console.log("Connect database failure!");
  }
};

module.exports = { connect };
