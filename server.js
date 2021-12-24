// Load the environment variables from .env file in the root directory when we are not in production
// In heroku, NODE_ENV is automatically set to production
// So in heroku the environmental variables that we set in the settings of heroku app will be used
if (process.env.NODE_ENV !== 'production') require('dotenv').load()

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

// Set our view engine
app.set('view engine', 'ejs')
// Set where our views are coming from
app.set('views', __dirname + '/views')
// Hook up exress layouts
app.set('layout', 'layouts/layout')
// Tell express we want to use express layouts
app.use(expressLayouts)
// Tell express where our public files are going to be
app.use(express.static('public'))
// To get requests in json format
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

// Connect to the database
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.on('open', () => console.log('Connected to Mongoose'))

// Define routes
app.use('/', require('./routes/index'))
app.use('/authors', require('./routes/authors'))
app.use('/books', require('./routes/books'))

app.listen(process.env.PORT || 3000)
