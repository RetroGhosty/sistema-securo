import express from 'express'
import {userModel} from '../models/userModel.mjs'
import pbkdf2 from 'pbkdf2';

const router = express.Router();

/* 
    /api/manageUsers
*/


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
        const createUsers = new userModel(req.body)
        const hashedPassword = HashThis(req.body.password)
        createUsers.password = hashedPassword
        await createUsers.save()
        res.status(200).json({
            Status_Title: "User created",
            User_Details: createUsers
        })
        
    }catch (err){
        next(`Error from /api/manageUsers/users: ${err}`)
    }
})

// Get user auth by Username
router.get('/users/username/:username/view', async(req, res, next) => {
    try{
        const result = await userModel.findOne({username : req.params.username})
        if (result != null){
            res.status(200).json({
                Status_Title: "Fetched user",
                User_Details: result
            })
        } else {
            res.status(404).json({
                Status_Title: "User not found"
            })
        }
    } catch (err){
        next(`Error from /api/manageUsers/users/"username"/view: ${err}`)
    }

})


// Get user auth info by ID
router.get('/users/id/:id/view', async (req, res, next) => {
    try{
        const {id} = req.params
        const result = await userModel.findOne({_id : id})
        if (result != null){
            res.status(200).json({
                Status_Title: "Fetched user",
                User_Details: result
            })
        } else {
            res.status(404).json({
                Status_Title: "User not found"
            })
        }
    
    } catch(err) {
        next(`Error from /api/manageUsers/users/"id"/view: ${err}`)
    }

})

// VIEW ALL
router.get('/users/view', async (req, res, next) => {
    try{
        const result = await userModel.find()
        if (result != null){
            res.status(200).json({
                Status_Title_Title: "Fetched users array",
                User_Details: result
            })
        } else {
            res.status(404).json({
                Status_Title: "Array Users not found"
            })
        }
    } catch(err) {
        next(`Error from /api/manageUsers/users/view: ${err}`)
    }

})

// UPDATE
router.put('/users/:id/edit', async(req, res, next) => {
    try{
        const {id, username} = req.body
        const result = await userModel.findOneAndUpdate(id, req.body)
        const newResult = await userModel.findOne({username: username})
        if (result != null){
            res.status(200).json({
                Status_Title: "Account update",
                Old_Detail: result,
                New_Detail: newResult,
                
            })
        } else {
            res.status(404).json({
                Status_Title: "User not found"
            })
        }
    } catch(err) {
        next(`Error from /api/manageUsers/users/"id"/edit: ${err}`)
    }
}) 


// DELETE
router.delete('/users/:id/drop', async(req, res, next) => {
    try{
        const {id} = req.params
        const result = await userModel.findByIdAndDelete(id)
        if (result != null){
            res.status(200).json({
                Status_Title: "Account deleted",
                Account_ID: id
            })
        } else {
            res.status(404).json({
                Status_Title: "User not found"
            })
        }
    } catch(err) {
        next(`Error from /api/manageUsers/users/"id"/drop: ${err}`)
    }
})

// DELETE ALL !! DELICATES
router.delete('/users/purgatory', async(req, res, next) => {
    try{
        const result = await userModel.find()
        if (result != null){
            res.status(200).json({
                Status: "Successfully Purge all users"}) 
            
        } else{
            res.status(404).json({
                Result: "Database already been purged"
            })
        }
        result.drop()
        
    } catch (err){
        next(`Error from /api/manageUsers/users/purgatory: ${err}`)
    }
})

export default {router, HashThis}