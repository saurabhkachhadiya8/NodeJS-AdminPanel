const mongoose = require("mongoose");
const categorySchema = mongoose.Schema({
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
},{ timestamps: true });
module.exports = mongoose.model('category', categorySchema);