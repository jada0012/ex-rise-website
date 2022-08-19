const User = require('../data/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    console.log(req.body)
    if (!req.body.username || !req.body.password) return res.status(400).json({ 'message': 'username and password are required' })

    const foundUser = await User.findOne({ username: req.body.username }).exec()
    if (!foundUser) return res.sendStatus(401)

    const match = await bcrypt.compare(req.body.password, foundUser.password)
    if (match) {
        const roles = Object.values(foundUser.roles)
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '45s' }

        )
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '2d' }

        )
        foundUser.refreshToken = refreshToken
        const result = await foundUser.save()
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
        res.json({ roles, accessToken })
        console.log(`logged in user ${foundUser.username}`)
    } else {
        res.sendStatus(401)
    }
}

module.exports = { handleLogin }