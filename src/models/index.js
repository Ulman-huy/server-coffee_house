const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
    type: { type: String, default: 'Coffee'},
    name: { type: String, required: true},
    brand: {type: String, default: 'no brand'},
    price: {type: Number, required: true},
    star: {type: Number, default: 5},
    like: {type: Boolean, default: false},
    sale: {type: Number, default: 0},
    brand: {type: String},
    description: {type: String},
    sold: { type: Number, default: 0},
    info: {type: String},
    images: {type: Array},
    date: {type: Date},
    slug: {type: String, slug: 'name'}
}, {
    timestamps: true
})

const imageSchema = new mongoose.Schema({
    filename: String,
    path: String,
    size: Number
}, {
    timestamps: true
})

const userSchema = new mongoose.Schema({
    username: { type: String },
    password: { type: String },
    cart: { type: Array },
    email: { type: String },
    phone: { type: String },
    name: { type: String },
    avatar: { type: String },
}, {
    timestamps: true
})
const Product = mongoose.model('coffee_house', productSchema);
const Image = mongoose.model('image', imageSchema);
const User = mongoose.model('user', userSchema);

module.exports = { 
    Product: Product,
    Image: Image,
    User: User
}