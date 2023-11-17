const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://tensenit:8mzOR8gMwCgquRwW@coffee.ztf1ifr.mongodb.net/?retryWrites=true&w=majority",
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
