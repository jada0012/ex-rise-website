const User = require('../data/Users')
const jwt = require('jsonwebtoken')

const handleLogout = async(req, res)=>{
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    console.log(cookies.jwt)
    const refreshToken = cookies.jwt

    const foundUser = await User.findOne({refreshToken}).exec()
    if (!foundUser) {
        res.clearCookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000} )
        return res.sendStatus(204)
    }
   
    foundUser.refreshToken = ''
    const result = await foundUser.save()
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000}) 
    res.sendStatus(204)
}

module.exports = {handleLogout}