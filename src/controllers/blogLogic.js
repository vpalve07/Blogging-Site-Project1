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
        if (!checkId) return res.status(400).send({ invalidId: "Object id is Invalid" })
        let createdBlog = await blogModel.create(data)
        res.status(201).send({ DocCreated: createdBlog })
    } 
    catch (error) {
        res.status(400).send({ errorType: error.name, errorMsg: error.message })
    }
}

module.exports = { author, blog }