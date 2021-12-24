const mongoose = require('mongoose')
const path = require('path')

const coverImageBasePath = 'uploads/bookCovers'

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
    // Instead of passing image itself into the database,
    // we're going to pass the name of the image
    // So we can just store a single small string
    // And then we can store the actual image itself on our server in file system
    // You always want to store files in the file system when you can
    coverImageName: {
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

// We need this to access the actual path of image in front end
// We cannot use arrow function in here
// Because we need to this keywork which is related to book itself
bookSchema.virtual('coverImagePath').get(function () {
    if (this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath
