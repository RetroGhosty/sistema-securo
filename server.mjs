import express from 'express'
import path from 'path'
import axios from 'axios'
import methodOverride from 'method-override'
import session from 'express-session'
import qs from 'qs'
const app = express()
const port = 3000

// API ENDPOINTS
import fileEndpoints from './routes/fileEndPoints.mjs'
import usersRoute from './routes/userEndpoints.mjs'
import fingerPilahanEndpoint from './routes/pilaNgFingerprintRequest.mjs'


// Middlewares
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({secret: 'mySecret', resave: true, saveUninitialized: true})) //SECRET COOKIE

// API ENDPOINTS MIDDLEWARES
app.use('/api/manageUsers', usersRoute.router)
app.use('/manageFiles', fileEndpoints.router)
app.use('/api/fingerprint',fingerPilahanEndpoint.router)


import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url))



app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))


app.get('/', async (req, res, next) => {
    res.render('home')
})


app.get('/login', async(req, res, next) => {
    res.render("login")
})




app.post('/login', async(req, res, next) => {
    try{
        const apiRes = await axios.get(`http://localhost:${port}/api/manageUsers/users/username/${req.body.Username}/view`)
        if (apiRes.data['User_Details'].username != req.body.Username && 
            apiRes.data['User_Details'].password != usersRoute.HashThis(req.body.Password)){
                
        } else{
            const body = qs['stringify']({
                accountStatusRequest : 'authenticate',
                username : req.body.Username
            })
            const config = {
                Headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            // Make finger pilahan post request here
            const makeFingerPilahanQuery = await axios.post(`http://localhost:${port}/api/fingerprint/create`, body, config)
            console.log(makeFingerPilahanQuery.data)

            req.session.user_name = apiRes.data['User_Details'].username
            req.session.user_id = apiRes.data['User_Details']._id
            req.session.user_fingerID = apiRes.data['User_Details'].fingerprintId 
            res.redirect('/dashboard')
        }   

    } catch(err) {
        //next(err) 
        res.redirect('/dashboard')
    }
})

const fingerAuth = async (req, res, next) => {
    //const isAuthenticated = getResponse.data[]
    try{
        const getResponse = await axios.get(`http://localhost:${port}/api/fingerprint/fetch/${!req.session.user_name}`)
        if(!req.session.user_name){
            return res.redirect('/login')
        }
        else if(!isAuthenticated){
            return res.redirect('login')
        }
        next()
    } catch (err) {
        return res.redirect('/login')
    }
}



app.post('/logout', (req, res, next) => {
    try{
        req.session.destroy()
        res.redirect('/login')
    } catch (err){
        next(err)
    }
})


app.get('/dashboard', fingerAuth, async (req, res, next) => {
    try{
        const {user_name, user_id, user_fingerID} = req.session
        res.render('dashboard', {user_name, user_id, user_fingerID})

    } catch(err) {
        next(err)
    }
})

app.get('*', async (req, res, next) => {
    try{

        res.send('errorNotFound') 
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
