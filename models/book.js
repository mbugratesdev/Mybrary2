const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    publishDate: {
        type: Date,
        required: true,
    },
    pageCount: {
        type: Number,
        required: true,
    },
    // To show them in the main page as most recent ones
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    // Cover image itself
    coverImage: {
        type: Buffer,
        required: true,
    },
    // The file type of the image
    coverImageType: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // Collection name
        ref: 'Author',
    },
})

// We cannot use arrow function in here
// Because we need to this keywork which is related to book itself
bookSchema.virtual('coverImagePath').get(function () {
    if (this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Book', bookSchema)
