const express = require('express')
const userModel = require('../models/userModel.js')
const pbkdf2 = require('pbkdf2')

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello')
})


const HashThis = (theText) => {
    // https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2_password_salt_iterations_keylen_digest_callback
    return pbkdf2.pbkdf2Sync(theText, 'salt', 1, 32, 'sha512')
}

/* CRUD SECTION */

// CREATE
router.post('/users', async (req, res, next) => {
    try{
        const createCottage = new userModel.Users(req.body)
        const hashedPassword = HashThis(req.body.password)
        createCottage.password = hashedPassword
        await createCottage.save()
        res.send("User Created")
    }catch(err){
        next(`User or Fingerprint already exist: ${err}`)
    }
})

// Get user auth by Username
router.get('/users/:username/view', async(req, res, next) => {
    try{
        const result = await userModel.Users.findOne({username : req.params.username})
        if (result != null){
            res.status(200)
            res.send(result)
        } else {
            res.send("User not found")
        }
    } catch (err){
        next(err)
    }

})


// Get user auth info
router.get('/users/:id/view', async (req, res, next) => {
    try{
        const {username, password, fingerprintId} = await userModel.Users.findById(`${req.params.id}`)
        res.status(200)
        res.send(username + password + fingerprintId)


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

module.exports = {router, HashThis}