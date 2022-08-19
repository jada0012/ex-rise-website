const express = require('express')
const router = express.Router()
const postController = require('../../controllers/postController')
const verifyJWT = require('../../middleware/verifyJWT')
router.route('/')
    .get( postController.getPosts)
    .post(verifyJWT, postController.createPost)
    


    
    
module.exports = router