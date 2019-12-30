import mongoose from 'mongoose'
const Schema = mongoose.Schema

const StorageSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: String,
        required: true
    },
    mimetype: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model("Storage", StorageSchema)