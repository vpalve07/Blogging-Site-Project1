const { default: mongoose } = require('mongoose')
const authorModel = require('../models/authorModel')
const blogModel = require('../models/blogModel')

const author = async function (req, res) {
    try {
        let data = req.body
        let createdAuthor = await authorModel.create(data)
        res.status(201).send({ data: createdAuthor })
    } catch (error) {
        res.status(400).send({ errorType: error.name, errorMsg: error.message })
    }
}

const blog = async function (req, res) {
    try {
        let data = req.body
        let authorId = data.authorId
        let checkId = await authorModel.findById(authorId)
        if (!checkId) return res.status(400).send({ invalidId: "authorId id is Invalid" })
        let createdBlog = await blogModel.create(data)
        res.status(201).send({ DocCreated: createdBlog })
    }
    catch (error) {
        res.status(400).send({ errorType: error.name, errorMsg: error.message })
    }
}


const getBlogs = async function (req, res) {
    try {
        let queryParams = req.query
        let blogs = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }, queryParams] })
        if (blogs.length == 0) return res.status(404).send({ Status: false, msg: "Blogs doesn't exist" })
        res.status(200).send({ ActiveBlogs: blogs })
    }
    catch (error) {
        res.status(500).send({ errorType: error.name, errorMsg: error.message })
    }
}

const updateBlog = async function (req, res) {
    try {
        let data = req.body
        let blogId = req.params.blogId
        if (data.tags || data.subcategory) {
            let bodyTags = data.tags
            let subcategory = data.subcategory
            let updateDoc1 = await blogModel.find({ _id: blogId })
            let updateTags = updateDoc1[0].tags
            for (let i of bodyTags) {
                updateTags.push(i)
            }
            let updateSubcategories = updateDoc1[0].subcategory
            for (let i of subcategory) {
                updateSubcategories.push(i)
            }
            let newDoc = await blogModel.findOneAndUpdate({ _id: blogId }, { tags: updateTags, subcategory: updateSubcategories }, { new: true })
        }
        if (data.title || data.body) {
            let updateDoc = await blogModel.findOneAndUpdate({ _id: blogId }, { title: data.title, body: data.body }, { new: true })
            if (!updateDoc) return res.status(400).send({ Null: "Doc not find" })
        }
        let newUpdatedDoc = await blogModel.findById(blogId)
        res.status(200).send({UpdatedDoc:newUpdatedDoc})
    } catch (error) {
        res.status(500).send({ errorType: error.name, errorMsg: error.message })
    }
}


module.exports = { author, blog, getBlogs, updateBlog }