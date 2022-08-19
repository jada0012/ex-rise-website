const User = require('../data/Users')
const bcrypt = require('bcrypt')
const getUsers = async(req, res)=>{
    const users = await User.find()
    if(!users) res.status(204).send({'message': "no users found"})
    res.send(users)
}
const createUser = async(req, res)=>{
    console.log(req.body)
    const duplicate =await User.findOne({username: req.body.username})
    console.log(duplicate)
    if (duplicate) return res.sendStatus(409)
    if(!req.body.username || !req.body.password){
        return res.status(400).json({"message": "username and pwd are required"})
    }
    try{
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(req.body.password, salt)
        const result = await User.create({
            "username": req.body.username,
            "password": hash
        })
        res.status(201).json(result)
    } catch(err){
        console.error(err)
    }

}

module.exports = {getUsers, createUser}