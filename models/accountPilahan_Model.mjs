import mongoose from 'mongoose'
const {Schema, model} = mongoose



mongoose.connect('mongodb://127.0.0.1:27017/securo-system')
.then(() => {
    console.log('Connection Open')
})
.catch((err) => {
  console.log('Error', err)
})


const pilahanSchema = new Schema({
    accountStatusRequest: {
        type: String,
        required: true,
        enum: ["register", "authenticate", "update"]
    },
    username: {
        type: String,
        required: [true, 'username can not be blank'],
    },
    fingerprintId: {
        type: Number,
        default: null
    },

    isVerified: {
        type: Boolean,
        default: null
    },
    createdAt: {
        type: Date, 
        default: Date.now
    }
})
const pilahanAccountModel = model('Fingertraffic', pilahanSchema)

export {pilahanAccountModel}
