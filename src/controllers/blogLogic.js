const { default: mongoose } = require('mongoose')
const authorModel = require('../models/authorModel')
const blogModel = require('../models/blogModel')
const jwt = require('jsonwebtoken')

const author = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data) == 0) return res.status(404).send({ status: false, msg: "request body cant be empty" })
        let { fname, lname, title, password, email } = data
        if (!fname) return res.status(400).send({ status: false, msg: "fname is mandatory" })
        if (!lname) return res.status(400).send({ status: false, msg: "lname is mandatory" })
        if (!title) return res.status(400).send({ status: false, msg: "title is mandatory" })
        if (!password) return res.status(400).send({ status: false, msg: "password is mandatory" })
        if (!email) return res.status(400).send({ status: false, msg: "email is mandatory" })
        let titleEnum = authorModel.schema.obj.title.enum
        if (!titleEnum.includes(author.title)) {
           return res.status(400).send({ status: false, msg: "title should be Mr, Mrs or Miss" })
        }
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
        if (password.match(passwordRegex)) {                                            // should contain at least one digit
            let createdAuthor = await authorModel.create(data)                          // should contain at least one lower case
            res.status(201).send({ status: true, data: createdAuthor })                 // should contain at least one upper case
        } else res.status(400).send({ status: false, msg: "Invalid password format" })  // should contain at least 8 from the mentioned characters
    } catch (error) {
        res.status(500).send({ status: false, errorType: error.name, errorMsg: error.message })
    }
}

const login = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data) == 0) return res.status(404).send({ status: false, msg: "request body cant be empty" })
        let { password, email } = data
        if (!password) return res.status(400).send({ status: false, msg: "password is mandatory" })
        if (!email) return res.status(400).send({ status: false, msg: "email is mandatory" })
        let findAuthor = await authorModel.findOne({ email: data.email, password: data.password })
        if (!findAuthor) return res.status(400).send({ status: false, msg: "credentials dont match" })
        let payload = { authorId: findAuthor._id.toString(), emailId: findAuthor.email }
        let token = jwt.sign(payload, "blogGroup17")
        res.status(200).send({ status: true, data: token })
    }
    catch (error) {
        res.status(500).send({ errorType: error.name, errorMsg: error.message })
    }

}

const blog = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data) == 0) return res.status(404).send({ status: false, msg: "request body cant be empty" })
        let { title, body, category, authorId } = data
        if (!title) return res.send({ status: false, msg: "title is mandatory" })
        if (!body) return res.send({ status: false, msg: "body is mandatory" })
        if (!category) return res.send({ status: false, msg: "category is mandatory" })
        let checkId = await authorModel.findById(authorId)
        if (!checkId) return res.status(400).send({ status: false, invalidId: "authorId id is Invalid" })
        let createdBlog = await blogModel.create(data)
        res.status(201).send({ status: true, data: createdBlog })
    }
    catch (error) {
        res.status(500).send({ status: false, errorType: error.name, errorMsg: error.message })
    }
}


const getBlogs = async function (req, res) {
    try {
        let queryParams = req.query
        if (Object.keys(queryParams).length == 0) return res.status(400).send({ status: false, msg: "please provide blog details" })
        let blogs = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }, queryParams] })
        if (blogs.length == 0) return res.status(404).send({ status: false, Status: false, msg: "Blogs doesn't exist" })
        res.status(200).send({ status: true, data: blogs })
    }
    catch (error) {
        res.status(500).send({ status: false, errorType: error.name, errorMsg: error.message })
    }
}

const updateBlog = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data) == 0) return res.status(404).send({ status: false, msg: "request body cant be empty" })
        let {title,body,tags,subcategory} = data
        let finalData = await blogModel.findOneAndUpdate({_id:req.params.blogId},{$set:{title:title,body:body},$push:{tags:tags,subcategory:subcategory}},{new:true})
        if(!finalData) return res.status(404).send({status:false,msg:"Document not found for update"})
        res.status(200).send({status:true,data:finalData})
    } catch (error) {
        res.status(500).send({ status: false, errorType: error.name, errorMsg: error.message })
    }
}


const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        let deleteDoc = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { deletedAt: Date.now(), isDeleted: true }, { new: true })
        if (!deleteDoc) return res.status(404).send({ status: false, msg: "Document not found" })
        res.status(200).send({ status: true, Info: "Document deleted successfully" })
    } catch (error) {
        res.status(500).send({ status: false, ErrorType: error.name, ErrorMsg: error.message })
    }
}

const deleteByQuery = async function (req, res) {
    try {
        const result = req.query;
        let decodedToken = jwt.verify(req.headers['x-api-key'],'blogGroup17')
        let authorizeAuthor = await blogModel.findOne({$and:[{authorId:decodedToken.authorId},{...result}]})
        if(!authorizeAuthor) return res.status(403).send({status:false,msg:"Authorization Failed"})
        const deleteBlog = await blogModel.findOneAndUpdate({authorId:decodedToken.authorId, ...result, isDeleted: false }, { $set: { deletedAt: Date.now(), isDeleted: true } }, { new: true });
        if (!deleteBlog) return res.status(404).send({ status: false, msg: "docs not found" });
        res.status(200).send({ status: true, Info: "Doc deleted successfully" });
    } catch (error) {
        res.status(500).send({ status: false, ErrorType: error.name, ErrorMsg: error.message })
    }
}

module.exports = { author, blog, getBlogs, updateBlog, deleteBlog, deleteByQuery, login }