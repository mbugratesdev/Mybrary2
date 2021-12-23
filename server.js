if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index')

// Set our view engine
app.set('view engine', 'ejs')
// Set where our views are coming from
app.set('views', __dirname + '/views')
// Hook up exress layouts
app.set('layout', 'layouts/layout')

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.on('open', () => console.log('Connected to Mongoose'))

// Tell express we want to use express layouts
app.use(expressLayouts)
// Tell express where our public files are going to be
app.use(express.static('public'))

app.use('/', indexRouter)

app.listen(process.env.PORT || 3000)
