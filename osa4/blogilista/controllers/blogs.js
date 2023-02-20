const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')


blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })

    res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)

    if (blog) {
        res.json(blog)
    } else {
        res.status(404).end()
    }

})


blogsRouter.post('/', userExtractor, async (req, res) => {
    const body = req.body
    const user = await req.user

    const likes = body.likes === undefined
        ? 0
        : body.likes

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(savedBlog)
})


blogsRouter.put('/:id', userExtractor, async (req, res) => {
    const body = req.body
    const user = await req.user
    const blog = await Blog.findById(req.params.id)

    const dataForBlogUpdate = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    if (blog.user.toString() === user._id.toString()) {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, dataForBlogUpdate, { new: true })
        res.json(updatedBlog)
    } else {
        res.status(401).json({
            error: 'no permission'
        })
    }
})


blogsRouter.delete('/:id', userExtractor, async (req, res) => {
    const user = await req.user
    const blog = await Blog.findById(req.params.id)

    if (blog.user.toString() === user._id.toString()) {
        await Blog.findByIdAndRemove(req.params.id)
        res.status(204).end()
    } else {
        res.status(401).json({
            error: 'no permission'
        })
    }

})


module.exports = blogsRouter