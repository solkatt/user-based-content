const mongoose = require('mongoose');
const fs = require("fs")
/*
author: {
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
*/
const postSchema = new mongoose.Schema({

    image: {
        name: String,
        data: Buffer,
        contentType: String,
        required: false
    },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;