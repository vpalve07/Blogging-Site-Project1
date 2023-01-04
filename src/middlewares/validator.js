const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const blogModel = require('../models/blogModel')

const emailValidate = function (req, res, next) {
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
    let authorId = data.authorId
    if (!mongoose.isValidObjectId(authorId)) return res.status(400).send({ status: false, IdAbsent: "authorId is not Valid" })
    next()
}


const blogId = function (req, res, next) {
    let blogId = req.params.blogId
    if (!mongoose.isValidObjectId(blogId)) return res.status(400).send({ status: false, IdAbsent: "BlogId is not Valid" })
    next()
}

const validateToken = function (req, res, next) {
    try {
        let token = req.headers['x-api-key']
        if (!token) return res.status(400).send({ status: false, msg: "token is required" })
        let decodeToken = jwt.verify(token, 'blogGroup17')
        if (!decodeToken) return res.status(401).send({ status: false, msg: "Login is required" })
        next()
    }
    catch (error) {
        res.status(500).send({ status: false, errorType: error.name, errorMsg: error.message })
    }
}

const authorizeAuthorCreate =  function(req,res,next){
    let token = req.headers['x-api-key']
    let decodeToken = jwt.verify(token,"blogGroup17")
    if(decodeToken.authorId!==req.body.authorId) return res.status(403).send({status:false, msg:"You are not authorized to do this task"})
    next()
}

const authorizeAuthorUpdateDelete = async function(req,res,next){
    let blogId = req.params.blogId
    let token = req.headers['x-api-key']
    let decodeToken = jwt.verify(token,"blogGroup17")
    let findAuthor = await blogModel.findById(blogId)
    if(!findAuthor) return res.status(403).send({status:false , msg:"BlogId is invalid"})
    if(decodeToken.authorId==findAuthor.authorId) next()
    else{return res.status(403).send({status:false, msg:"You are not authorized to do this task"})}
    
}

module.exports = { emailValidate, authorId, blogId, validateToken, authorizeAuthorCreate, authorizeAuthorUpdateDelete}