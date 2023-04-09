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


Page.insertMany([
  {pageType: 'homePage', title: 'Montalban Resort', value: "/"},
  {pageType: 'accountPages', title: 'Reserve now', value: "reserve"},
  {pageType: 'publicPages', title: 'About', value: "about"},
  {pageType: 'publicPages', title: 'Available Cottages', value: "available-cottage"},
]).then(data => {
  console.log('It worked')
  console.log(data)
})

