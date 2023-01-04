const express = require('express')
const router = express.Router()
const { emailValidate, authorId, blogId, validateToken , authorizeAuthorCreate, authorizeAuthorUpdateDelete } = require('../middlewares/validator')
const { author, blog, getBlogs, updateBlog, deleteBlog, deleteByQuery, login } = require('../controllers/blogLogic')

router.get("/test-me", function (req, res) {
    res.send("my API is very cool")
})


router.post("/author", emailValidate, author)
router.post("/login", login)
router.post("/blogs", validateToken, authorId, authorizeAuthorCreate, blog)
router.get("/blogs", validateToken, getBlogs)
router.put("/blogs/:blogId", validateToken, blogId, authorizeAuthorUpdateDelete, updateBlog)
router.delete("/blogs/:blogId", validateToken, blogId, authorizeAuthorUpdateDelete, deleteBlog)
router.delete("/blogs", validateToken, deleteByQuery)

module.exports = router