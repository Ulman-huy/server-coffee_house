const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const ObjectId = require('mongodb').ObjectId
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
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    name: { type: String, default: '' },
    avatar: { type: String, default: '' },
    location: { type: String, default: ''}
}, {
    timestamps: true
})

const packageSchema = new mongoose.Schema({
    userId: { type: String},
    name: {type: String},
    phone: {type: String},
    location: {type: String},
    message: { type: String},
    status: {type: String, default: 'Chờ xử lý...'},
    cart: [],
    time: { type: String, default: new Date }
}, {
    timestamps: true
})

const Product = mongoose.model('coffee_house', productSchema);
const Image = mongoose.model('image', imageSchema);
const User = mongoose.model('user', userSchema);
const Package = mongoose.model('package', packageSchema)

module.exports = { 
    Product: Product,
    Image: Image,
    User: User,
    Package: Package,
}