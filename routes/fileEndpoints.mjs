import multer from 'multer'
import express from 'express'
const router = express.Router();
/* 
/api/manageFiles 
*/

const asgnedStorage = multer.diskStorage({
    destination: (req, files, cb) => {
        cb(null, 'company_files/pending_approval')
    },
    filename: (req, files, cb) => {
        cb(null, files.originalname)
    },
    
})
// KB
const maxSize = 600 * 1000

const upload = multer({storage: asgnedStorage, 
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "application/msword" || 
            file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            file.mimetype == "application/pdf"){
                cb(null, true)
            } else{
            cb(null, false)
        }
    }}).array("UserDocument")

router.get('*', (req, res ,next) => {
    res.send('hello')
})

router.post('/upload', upload, async (req, res, next) => {
    try{
        res.status(200).redirect('/dashboard')

    } catch(err){
        next(err)
    }
});

export default {router}