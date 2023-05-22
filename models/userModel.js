const { unique } = require('jquery');
const mongoose = require('mongoose');
const {Schema, model} = mongoose

mongoose.connect('mongodb://127.0.0.1:27017/securo-system')
.then(() => {
    console.log('Connection Open')
})
.catch((err) => {
  console.log('Error', err)
})


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userRank: {
        type: String,
        required: true
    },
    fingerprintId: {
        type: Number,
        required: true,
        unique: true
    },
    isFlagged: {
        type: Boolean,
        required: true
    }
})

module.exports.Users = model('User', userSchema)
