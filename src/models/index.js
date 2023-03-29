const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const coffeeSchema = new mongoose.Schema({
    name: { type: String, required: true},
    price: {type: Number, required: true},
    star: {type: Number, default: 5},
    like: {type: Boolean, default: false},
    sale: {type: Number},
    brand: {type: String},
    description: {type: String, required: true},
    image: {type: String},
    slug: {type: String, slug: 'name'}
}, {
    timestamps: true
})

module.exports = mongoose.model('coffee_house', coffeeSchema);