const express = require('express')
const userModel = require('../models/userModel.js')


const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello')
})

/* CRUD SECTION */

// CREATE
router.post('/users', async (req, res, next) => {
    try{
        const createCottage = new userModel.Users(req.body)
        await createCottage.save()
        res.send("User Created")
    }catch(err){
        next(`User or Fingerprint already exist: ${err}`)
    }
})

// SINGLE VIEW BY ID
router.get('/users/:id/view', async (req, res, next) => {
    try{
        const findResult = await userModel.Users.findById(`${req.params.id}`)
        res.status(200)
        res.send(findResult)
    } catch(err) {
        next(err)
    }

    
})

// VIEW ALL
router.get('/users/view', async (req, res, next) => {
    try{
        const findResult = await userModel.Users.find()
        res.status(200)
        res.send(findResult)
    } catch(err) {
        next(err)
    }

})

// UPDATE
router.put('/users/:id/edit', async(req, res, next) => {
    try{
        const {id} = req.body
        await userModel.Users.findOneAndUpdate(id, req.body)
        res.send(`Updated ${id}: with new ${req.body}`)
    } catch(err) {
        next(err)
    }
}) 


// DELETE
router.delete('/users/:id/drop', async(req, res, next) => {
try{
    const {id} = req.params
    await userModel.Users.findByIdAndDelete(id)
    res.send(`Deleted: ${id}`)
} catch(err) {
    next(err)
}
})

// DELETE ALL !! DELICATES
router.delete('/users/purgatory', async(req, res, next) => {
    try{
        await userModel.Users.deleteMany({})
        res.send(`Purges all account`)
    }catch (err){
        next(err)
    }
})

module.exports = {router}