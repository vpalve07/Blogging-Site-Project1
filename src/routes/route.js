const express = require('express')
const router = express.Router()
const authorModel = require('../models/authorModel')
const blogModel = require('../models/blogModel')

router.get("/test-me",function(req,res){
    res.send("my API is very cool")
})

module.exports = router