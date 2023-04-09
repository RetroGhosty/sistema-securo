const express = require('express')
const path = require('path')
const ShortUniqueId = require('short-unique-id');
const app = express()
const port = 3000

//Connect to mongoDB
const mongoose = require('mongoose');
const {Schema} = mongoose
mongoose.connect('mongodb://127.0.0.1:27017/montalban-resort')
.then(() => {
  console.log('Successfully connected')
})
.catch((err) => {
  console.log('Error', err)
})

const pageSchema = new Schema({
    pageType: String,
    title: String,
    value: String
})

const Page = mongoose.model('Page', pageSchema)


const accountAuth = require('./accountAuth.js')
let pageData = null

const uid = new ShortUniqueId({ length: 10 });

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))



const fakedataBase = [
    {
        uid: uid(),
        username: 'talipapa',
        password: '$2b$10$fy42l7WOsawpwvEO3denTOcEdjoD14Z76Uj1PKIYXtVdkJTRfEnHq'
    },
]




app.get('/', async (req, res) => {
    let pageData = await Page.find().lean()
    res.render('home', {pageData})
})

app.get('/about', async (req, res) => {
    let pageData = await Page.find().lean()
    res.render('about', {pageData})
})

app.get('/test', async (req, res) => {
    let pageData = await Page.find().lean()
    res.render('test', {fakedataBase, pageData})
})

app.get('/test/users/:id', async (req, res) => {
    let pageData = await Page.find().lean()
    const { id } = req.params
    const thisUser = fakedataBase.find(f => f.uid === id)
    res.render('userdetails', {thisUser, pageData})
})


app.get('/test/register', async (req, res) => {
    let pageData = await Page.find().lean()
    res.render('testCreate', {pageData})
})

app.post('/test/register', async (req, res) => {
    await pram(req.body, res)
    res.redirect('/test')
})

app.get('*', async (req, res) => {
    let pageData = await Page.find().lean()
    res.render('errorNotFound', {pageData}) 
    
})

app.listen(port, async () => {
    console.log(`Listening to port: ${port}`)
})

