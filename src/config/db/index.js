const mongoose = require('mongoose')

const connect = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/coffee_house', {
            useNewUrlParser: true
        });
        console.log("Connect database successfully!");
    } catch (error) {
        console.log("Connect database failure!");
    }
}

module.exports = { connect };