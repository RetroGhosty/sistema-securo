const express = require('express')
const path = require('path')
const ShortUniqueId = require('short-unique-id');
const app = express()
const port = 3000

const accountAuth = require('./accountAuth.js')
const pageData = require('./availablePages.json')
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

app.get('/', (req, res) => {
    res.render('home', {...pageData})
})

app.get('/about', (req, res) => {
    res.render('about', {...pageData})
})

const pram = async (formBody) => {
    const {user, pass} = formBody
    const hashedData = await accountAuth.hashPassword(pass)
    let temp = {
        uid: uid(),
        username: user,
        password: hashedData,
    }
    fakedataBase.push(temp)
}

app.get('/test', (req, res) => {
    res.render('test', {fakedataBase, ...pageData})
})

app.get('/test/users/:id', (req, res) => {
    const { id } = req.params
    const thisUser = fakedataBase.find(f => f.uid === id)
    res.render('userdetails', {thisUser, ...pageData})
})


app.get('/test/register', (req, res) => {
    res.render('testCreate', {...pageData})
})

app.post('/test/register', async (req, res) => {
    await pram(req.body, res)
    res.redirect('/test')
})

app.get('*', (req, res) => {
    res.render('errorNotFound', {...pageData}) 
    
})


app.listen(port, () => {
    console.log(`Listening to port: ${port}`)
})
