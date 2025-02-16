const mongoose = require("mongoose");
const extrasubcategorySchema = mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    subcategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategory",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    tags: {
        type: String,
        required: false
    },
    status: {
        type: String,
        default: "deactive"
    }
});
module.exports = mongoose.model('extrasubcategory', extrasubcategorySchema);