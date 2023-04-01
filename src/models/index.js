const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const coffeeSchema = new mongoose.Schema({
    name: { type: String, required: true},
    brand: {type: String, default: 'no brand'},
    price: {type: Number, required: true},
    star: {type: Number, default: 5},
    like: {type: Boolean, default: false},
    sale: {type: Number, default: 0},
    brand: {type: String},
    description: {type: String},
    info: {type: String},
    images: {type: Array},
    date: {type: Date},
    slug: {type: String, slug: 'name'}
}, {
    timestamps: true
})

module.exports = mongoose.model('coffee_house', coffeeSchema);