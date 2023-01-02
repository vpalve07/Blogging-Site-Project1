const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true
    },
    body: {
        type: String,
        require: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    tags: {
        type: [String],
        category: {
            type: String,
            require: true,
            subcategory: {
                type: [String]
            }
        },
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    },
    publishedAt: {
        type: Date
    }
}, { timestamps: true })

module.exports = mongoose.model('Blog', blogSchema)