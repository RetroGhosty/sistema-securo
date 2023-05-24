import mongoose from 'mongoose'
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
        required: [true, 'username can not be blank'],
        unique: [true, 'username already in used']
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
        type: Number
    },
    isFlagged: {
        type: Boolean
    }
})
const userModel = model('User', userSchema)

export {userModel}
