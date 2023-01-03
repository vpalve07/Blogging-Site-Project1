const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    tags: [String],
    category: {
        type: String,
        required: true
    },
    subcategory: [String],
    isDeleted: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    publishedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model('Blog', blogSchema)