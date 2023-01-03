const express = require('express')
const router = express.Router()
const { emailValidate, authorId, blogId } = require('../middlewares/validator')
const { author, blog, getBlogs, updateBlog, deleteBlog, deleteByQuery } = require('../controllers/blogLogic')

router.get("/test-me", function (req, res) {
    res.send("my API is very cool")
})


router.post("/author", emailValidate, author)
router.post("/blogs", authorId, blog)
router.get("/blogs", getBlogs)
router.put("/blogs/:blogId", updateBlog)
router.delete("/blogs/:blogId", blogId, deleteBlog)
router.delete("/blogs", deleteByQuery)

module.exports = router