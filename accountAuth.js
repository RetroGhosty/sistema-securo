const bcrypt = require('bcrypt')
const saltRounds = 10;

module.exports.hashPassword = async (plainText) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plainText, saltRounds, (err, hash) => {
            try{
                resolve(hash)
            } catch(err){
                reject('Something went wrong!')
            }
        })
    })
}

module.exports.comParePassword = async (plainText, hashed) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainText, hashed, (err, hash) => {
            try{
                resolve(hash)
            } catch(err){
                reject('Something went wrong!')
            }
        })
    })
}

