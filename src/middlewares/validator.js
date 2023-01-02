const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const emailValidate = function (req, res, next) {
    let email = req.body.email
    if (!email) return res.status(400).send({ emptyEmail: "Email is not present" })
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email.match(emailRegex)) {
        next()
    } else {
        res.status(400).send({ InvalidEmail: "Enter Valid Email ID" })
    }
}

const authorId = function (req, res, next) {
    let data = req.body
    let authorId = data.authorId
    if (!mongoose.isValidObjectId(authorId)) return res.status(400).send({ IdAbsent: "authorId is not present" })
    next()
}

module.exports = { emailValidate, authorId }