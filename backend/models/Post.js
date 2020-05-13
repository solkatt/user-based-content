const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    image: {
        _id: {
            type: String,
            required: false
        },
        filename: {
            type: String,
            required: false
        },
        required: false
    }
});

module.exports = mongoose.model('Post', postSchema)