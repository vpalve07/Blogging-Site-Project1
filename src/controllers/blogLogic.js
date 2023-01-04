const { default: mongoose } = require('mongoose')
const authorModel = require('../models/authorModel')
const blogModel = require('../models/blogModel')
const jwt = require('jsonwebtoken')

const author = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data) == 0) return res.status(404).send({ status: false, msg: "request body cant be empty" })
        let password = data.password
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
        if (password.match(passwordRegex)) {                                            // should contain at least one digit
            let createdAuthor = await authorModel.create(data)                          // should contain at least one lower case
            res.status(201).send({ status: true, data: createdAuthor })                 // should contain at least one upper case
        } else res.status(400).send({ status: false, msg: "Invalid password format" })  // should contain at least 8 from the mentioned characters
    } catch (error) {
        res.status(400).send({ status: false, errorType: error.name, errorMsg: error.message })
    }
}

const login = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data) == 0) return res.status(404).send({ status: false, msg: "request body cant be empty" })
        let findAuthor = await authorModel.findOne({ email: data.email, password: data.password })
        if (!findAuthor) return res.status(400).send({ status: false, msg: "credentials dont match" })
        let payload = { authorId: findAuthor._id.toString(), emailId: findAuthor.email }
        let token = jwt.sign(payload, "blogGroup17")
        res.status(200).send({ status: true, generatedToken: token })
    }
    catch (error) {
        res.status(500).send({ errorType: error.name, errrorMsg: error.message })
    }

}

const blog = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data) == 0) return res.status(404).send({ status: false, msg: "request body cant be empty" })
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
        if (Object.keys(queryParams).length == 0) return res.status(400).send({ status: false, msg: "please provide blog details" })
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
        if (Object.keys(data) == 0) return res.status(404).send({ status: false, msg: "request body cant be empty" })
        let findBlog = await blogModel.findById(req.params.blogId)
        let tagsArr = findBlog.tags
        if (data.tags) tagsArr.push(data.tags)
        let subArr = findBlog.subcategory
        if (data.subcategory) subArr.push(data.subcategory)
        let updateBlog = await blogModel.findOneAndUpdate({ _id: req.params.blogId, isDeleted:false }, { $set: { title: data.title, body: data.body, tags: tagsArr, subcategory: subArr } }, { new: true })
        res.status(200).send({ status: true, UpdatedDoc: updateBlog })
    } catch (error) {
        res.status(500).send({ status: false, errorType: error.name, errorMsg: error.message })
    }
}


const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        let deleteDoc = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { deletedAt: Date.now(), isDeleted: true }, { new: true })
        if (!deleteDoc) return res.status(404).send({ status: false, msg: "Document not found" })
        res.status(200).send({ status: true, msg: "Document deleted successfully" })
    } catch (error) {
        res.status(500).send({ status: false, ErrorType: error.name, ErrorMsg: error.message })
    }
}

const deleteByQuery = async function (req, res) {
    try {
        const result = req.query;
        const deleteBlog = await blogModel.findOneAndUpdate({ ...result, isDeleted: false }, { $set: { deletedAt: Date.now(), isDeleted: true } }, { new: true });
        if (!deleteBlog) return res.status(404).send({ status: false, msg: "docs not found" });
        res.status(200).send({ status: true, Msg: "Doc deleted successfully" });
    } catch (error) {
        res.status(500).send({ status: false, ErrorType: error.name, ErrorMsg: error.message })
    }
}

module.exports = { author, blog, getBlogs, updateBlog, deleteBlog, deleteByQuery, login }