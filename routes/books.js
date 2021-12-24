const express = require('express')
const router = express.Router()
const fs = require('fs')
const Book = require('../models/book')
const Author = require('../models/author')

// Multer settings
const multer = require('multer')
const path = require('path')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    },
})

// All Books Route
router.get('/', async (req, res) => {
    let query = Book.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }

    try {
        const books = await query.exec()
        res.render('books/index', {
            books,
            searchOptions: req.query,
        })
    } catch (error) {
        res.redirect('/')
    }
})

// New Book Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

// Create Book Route
router.post('/', upload.single('cover'), async (req, res) => {
    // We first need to create the cover image file on our file system
    // Get the name from that and then save that in our book object
    // To do this we need a library called multer
    // Multer allows us to work with multipart forms which is a file form is

    const fileName = req.file != null ? req.file.filename : null

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
        coverImageName: fileName,
    })

    try {
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect(`books`)
    } catch (error) {
        // Delete the image that we added to file system if the book is not saved on the database.
        if (book.coverImageName != null) removeBookCover(book.coverImageName)

        renderNewPage(res, book, true)
    }
})

function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), (err) => {
        if (err) console.error(err)
    })
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors,
            book,
        }
        if (hasError) params.errorMessage = 'Error creating new book'

        res.render('books/new', params)
    } catch (error) {
        res.redirect('/books')
    }
}

module.exports = router
