const Post = require('../data/Post')


const getPosts = async(req, res)=>{
    const posts = await Post.find()
    if (!posts) return res.status(204).json({"message": "no posts are there yet"})
    res.json(posts)
}

const createPost = async (req, res) =>{
    // res.send('hello world')
    console.log(req.body)
    if(!req?.body?.title || !req?.body?.content || !req?.body?.author) {
        return res.status(400).json({"message": "title and content and author are required"})
    }
    try{
        const result = await Post.create({
            "title": req.body.title,
            "author": req.body.author,
            "content": req.body.content
            
        })
        res.status(201).json(result)
    } catch(err){
        console.error(err)
    }
}

module.exports = {getPosts, createPost}