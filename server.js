const express = require('express')
const path = require('path')
const axios = require('axios')
const methodOverride = require('method-override')
const app = express()
const port = 3000


// API ENDPOINTS
const authEndpoints = require('./routes/authEndpoints.js')
const fileEndpoints = require('./routes/fileEndPoints.js')
const usersRoute = require('./routes/userEndpoints.js')


// Middlewares
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// API ENDPOINTS MIDDLEWARES
app.use('/api/auth', authEndpoints.router)
app.use('/api/manageUsers', usersRoute.router)
app.use('/api/manageFiles', fileEndpoints.router)


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))


app.get('/', async (req, res, next) => {
    res.render('home')
})


app.get('*', async (req, res, next) => {
    try{

        res.render('errorNotFound') 
    } catch(err) {
        next(err)
    }

})

// Error handling middleware
app.use(async (err, req, res, next) => {
    return res.status(500).send(`${err}`)
})

app.listen(port, async () => {
    console.log(`Listening to port: ${port}`)
})
