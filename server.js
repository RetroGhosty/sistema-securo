const express = require('express')
const path = require('path')
const axios = require('axios')
const methodOverride = require('method-override')
const session = require('express-session')
const app = express()
const port = 3000


// API ENDPOINTS
const fileEndpoints = require('./routes/fileEndPoints.js')
const usersRoute = require('./routes/userEndpoints.js')


// Middlewares
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({secret: 'mySecret'})) //SECRET COOKIE

// API ENDPOINTS MIDDLEWARES
app.use('/api/manageUsers', usersRoute.router)
app.use('/api/manageFiles', fileEndpoints.router)


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))


app.get('/', async (req, res, next) => {
    res.render('home')
})

const verify = (req, res, next) => {
    const {password} = req.query
    if (password == "elaina"){
        next();
    }else{
        res.send("Authentication failed")
    }
}



app.get('/login', async(req, res, next) => {
    res.render("login")
})

app.post('/login', async(req, res, next) => {
    try{
        const apiRes = await axios.get(`http://localhost:${port}/api/manageUsers/users/${req.body.Username}/view`)
        if (apiRes.data.username != req.body.Username){
            res.redirect('/dashboard')
        } else if(apiRes.data.password != usersRoute.HashThis(req.body.Password)){
            res.redirect('/dashboard')
        }else{
            req.session.user_name = apiRes.data.username
            req.session.user_id = apiRes.data._id
            req.session.user_fingerID = apiRes.data.fingerprintId
            res.redirect('/dashboard')
        }
    } catch(err) {
        next(err)
    }

})

app.post('/logout', (req, res, next) => {
    try{
        req.session.user_id = null
        res.redirect('/login')
    } catch (err){
        next(err)
    }
})

app.get('/dashboard', async (req, res, next) => {
    try{
        if(!req.session.user_id){
            res.redirect('/login')
        } else{
            const {user_name, user_id, user_fingerID} = req.session
            res.render('dashboard', {user_name, user_id, user_fingerID})
        }

    } catch(err) {
        next(err)
    }
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
