import express from 'express'
import {userModel} from '../models/userModel.mjs'
import { pilahanAccountModel } from '../models/accountPilahan_Model.mjs';

const router = express.Router();

/* 
    /api/manageUsers
*/

/* CRUD SECTION */

// CREATE
router.post('/create', async (req, res, next) => {
    try{
        const gawaRequest = new pilahanAccountModel(req.body)
        await gawaRequest.save()
        res.status(200).json({
            requestType: gawaRequest.accountStatusRequest,
            Username: gawaRequest.username,
            OldestRequest_Created_At: gawaRequest.createdAt}) 
    }catch(err){
        next(`Error from /api/fingerprint/create: ${err}`)
    }
})

// Get user auth by Username
router.get('/fetch', async(req, res, next) => {
    try{
        const result = await pilahanAccountModel.findOne().sort({createdAt: 1})
        if (result != null){
            res.status(200).json({
                Request_Type: result.accountStatusRequest,
                Username: result.username,
                FingerPrint: result.fingerprintId, 
                OldestRequest_Created_At: result.createdAt}) 
            
        } else{
            res.status(404).json({
                Result: "No request found"
            })
        }
        
    } catch (err){
        next(`Error from /api/fingerprint/fetch: ${err}`)
    }
})

// BOOLEAN VALUE FOR FINGERPRINT VERIFICATION
router.get('/fetch/:username', async(req, res, next) => {
    try{
        const result = await pilahanAccountModel.findOne({username: req.params.username})
        if (result != null){
            res.status(200).json({
                Request_Type: result.accountStatusRequest,
                Username: result.username,
                FingerPrint: result.fingerprintId,
                isVerified: result.isVerified, 
                OldestRequest_Created_At: result.createdAt}) 
        } else{
            res.status(404).json({
                Result: "No request found"
            })
        }
        
    } catch (err){
        next(`Error from /api/fingerprint/fetch: ${err}`)
    }
})


// DELETE OLD REQUEST
router.delete('/drop', async(req, res, next) => {
    try{
        const result = await pilahanAccountModel.findOne().sort({createdAt: 1})
        if (result != null){
            res.status(200).json({
                Status: "Deleting old request",
                Username: result.username,
                FingerPrint: result.fingerprintId, 
                OldestRequest_Created_At: result.createdAt}) 
            
        } else{
            res.status(404).json({
                Result: "No request found"
            })
        }
        result.deleteOne()
        
    } catch (err){
        next(`Error from /api/fingerprint/drop: ${err}`)
    }
})

// UPDATE
router.put('/bindfinger/:id', async(req, res, next) => {
    try{
        const result = await userModel.findByIdAndUpdate(req.params.id, req.body)
        const newResult = await userModel.findOne({_id: req.params.id})
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
        next(`Error from /api/manageUsers/users/bindfinger: ${err}`)
    }
}) 



// DELETE ALL !! DELICATES
router.delete('/clearall', async(req, res, next) => {
    try{
        const result = await pilahanAccountModel.find()
        if (result != null){
            res.status(200).json({
                Status: "Fingerprint request cleansed"}) 
            
        } else{
            res.status(404).json({
                Result: "Database already cleansed"
            })
        }
        result.drop()
        
    } catch (err){
        next(`Error from /api/fingerprint/clearall: ${err}`)
    }
})

export default {router}