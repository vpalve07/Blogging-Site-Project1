const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const blogModel = require('../models/blogModel')

const emailValidate = function (req, res, next) {
    if(Object.keys(req.body).length == 0) return res.status(400).send({status:false,msg:"request body cant be empty"})
    let email = req.body.email
    if (!email) return res.status(400).send({ status: false, emptyEmail: "Email is not present" })
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email.match(emailRegex)) {
        next()
    } else {
        res.status(400).send({ status: false, InvalidEmail: "Enter Valid Email ID" })
    }
}

const authorId = function (req, res, next) {
    let data = req.body
    if (Object.keys(data).length == 0) return res.status(404).send({ status: false, msg: "request body cant be empty" })
    let authorId = data.authorId
    if (!authorId) return res.status(400).send({ status: false, msg: "authorId is mandatory" })
    if (!mongoose.isValidObjectId(authorId)) return res.status(400).send({ status: false, IdAbsent: "authorId is not Valid" })
    next()
}


const blogId = function (req, res, next) {
    if (!mongoose.isValidObjectId(req.params.blogId)) return res.status(400).send({ status: false, IdAbsent: "BlogId is not Valid" })
    next()
}

const validateToken = function (req, res, next) {
    try {
        let token = req.headers['x-api-key']
        if (!token) return res.status(400).send({ status: false, msg: "token is required" })
        // let decodeToken = jwt.verify(token, 'blogGroup17')
        // if (!decodeToken) return res.status(401).send({ status: false, msg: "Login is required" })
        jwt.verify(token, "blogGroup17", function (err, decode) {
            if (err) { return res.status(401).send({ status: false, data: "Authentication Failed" }) };
            req.decode = decode;
            next()
        })
    }
    catch (error) {
        res.status(500).send({ status: false, errorType: error.name, errorMsg: error.message })
    }
}

const authorizeAuthorCreate = function (req, res, next) {
    // let token = req.headers['x-api-key']
    // let decodeToken = jwt.verify(token, "blogGroup17")
    if (req.decode.authorId !== req.body.authorId) return res.status(403).send({ status: false, msg: "You are not authorized to do this task" })
    next()
}

const authorizeAuthorUpdateDelete = async function (req, res, next) {
    // let blogId = req.params.blogId
    // let token = req.headers['x-api-key']
    // let decodeToken = jwt.verify(token, "blogGroup17")
    let findAuthor = await blogModel.findById(req.params.blogId)
    if (!findAuthor) return res.status(404).send({ status: false, msg: "Blog not found" })
    if (req.decode.authorId == findAuthor.authorId) next()
    else { return res.status(403).send({ status: false, msg: "You are not authorized to do this task" }) }

}

module.exports = { emailValidate, authorId, blogId, validateToken, authorizeAuthorCreate, authorizeAuthorUpdateDelete }