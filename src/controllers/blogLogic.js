const { default: mongoose } = require('mongoose')
const authorModel = require('../models/authorModel')
const blogModel = require('../models/blogModel')

const author = async function (req, res) {
    try {
        let data = req.body
        let createdAuthor = await authorModel.create(data)
        res.status(201).send({ status: true, data: createdAuthor })
    } catch (error) {
        res.status(400).send({ status: false, errorType: error.name, errorMsg: error.message })
    }
}

const blog = async function (req, res) {
    try {
        let data = req.body
        let authorId = data.authorId
        let checkId = await authorModel.findById(authorId)
        if (!checkId) return res.status(400).send({ status: false, invalidId: "authorId id is Invalid" })
        let createdBlog = await blogModel.create(data)
        res.status(201).send({ status: true, DocCreated: createdBlog })
    }
    catch (error) {
        res.status(400).send({ status: false, errorType: error.name, errorMsg: error.message })
    }
}


const getBlogs = async function (req, res) {
    try {
        let queryParams = req.query
        let blogs = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }, queryParams] })
        if (blogs.length == 0) return res.status(404).send({ status: false, Status: false, msg: "Blogs doesn't exist" })
        res.status(200).send({ status: true, ActiveBlogs: blogs })
    }
    catch (error) {
        res.status(500).send({ status: false, errorType: error.name, errorMsg: error.message })
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
            if (!updateDoc) return res.status(400).send({ status: false, Null: "Doc not find" })
        }
        let newUpdatedDoc = await blogModel.findById(blogId)
        if (newUpdatedDoc.isPublished == false) {
            let updateIsPublished = await blogModel.findOneAndUpdate({ _id: blogId }, { isPublished: true, publishedAt: Date.now() })
            return res.status(200).send({ status: true, UpdatedDoc: updateIsPublished })
        }
        res.status(200).send({ status: true, UpdatedDoc: newUpdatedDoc })
    } catch (error) {
        res.status(500).send({ status: false, errorType: error.name, errorMsg: error.message })
    }
}


const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        let deleteDoc = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { deletedAt: Date.now(), isDeleted: true }, { new: true })
        if(!deleteDoc) return res.status(404).send({status:false,msg:"Document not found"})
        res.status(200).send({ status: true, msg: "Document deleted successfully" })
    } catch (error) {
        res.status(500).send({ status: false, ErrorType: error.name, ErrorMsg: error.message })
    }
}

const deleteByQuery = async function (req, res) {
    try {
        let queryParams = req.query
        let deleteDoc = await blogModel.findOneAndUpdate({ $or: [queryParams, { tags: queryParams.tags }, { subcategory: queryParams.subcategory }] }, { deletedAt: Date.now(), isDeleted: true }, { new: true })
        if (!deleteDoc) return res.status(404).send({ status: false, msg: "Document not found" })
        return res.status(200).send({ status: true, deletedDoc: deleteDoc })
    } catch (error) {
        res.status(500).send({ status: false, ErrorType: error.name, ErrorMsg: error.message })
    }
}

module.exports = { author, blog, getBlogs, updateBlog, deleteBlog, deleteByQuery }