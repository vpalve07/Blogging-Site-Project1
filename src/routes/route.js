const express = require('express')
const router = express.Router()
const middleware = require('../middlewares/validator')
const controller = require('../controllers/blogLogic')

router.get("/test-me",function(req,res){
    res.send("my API is very cool")
})


router.post("/author", middleware.emailValidate, controller.author)
router.post("/blog", middleware.authorId, controller.blog)

module.exports = router