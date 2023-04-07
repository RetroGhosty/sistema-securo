const express = require('express')
const path = require('path')
const app = express()
const port = 3000

const accountAuth = require('./accountAuth.js')
const pageData = require('./availablePages.json')

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))


app.get('/', (req, res) => {
    res.render('home', {...pageData})
})

app.get('/test', (req, res) => {
    const {convert} = req.query
    const pram = async () => {
        const hashedData = await accountAuth.hashPassword(convert)
        res.render('test', {hashedData, ...pageData})

    }
    pram()
})

app.get('*', (req, res) => {
    res.render('errorNotFound', {...pageData}) 
})


app.listen(port, () => {
    console.log(`Listening to port: ${port}`)
})
