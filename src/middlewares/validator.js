const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

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
    if (!mongoose.isValidObjectId(authorId)) return res.status(400).send({ status: false, IdAbsent: "authorId is not present" })
    next()
}

const blogId = function (req, res, next) {
    let blogId = req.params.blogId
    if (!mongoose.isValidObjectId(blogId)) return res.status(400).send({ status: false, IdAbsent: "BlogId is Incorrect" })
    next()
}

// const authorIdQuery = function(req,res,next){
//     let authorId = req.query.authorId
//     if (!mongoose.isValidObjectId(authorId)) return res.status(400).send({ IdAbsent: "BlogId is Incorrect" })
//     next()
// }

module.exports = { emailValidate, authorId, blogId }