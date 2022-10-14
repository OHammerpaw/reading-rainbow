///////////////////////////////////////////////////////////
// Import Dependencies
///////////////////////////////////////////////////////////
const mongoose = require('./connection')

// we're going to pull the Schema from mongoose
// we'll use a syntax called "destructuring"
const { Schema } = mongoose

// comment schema
const reviewSchema = new Schema({
    review: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

//////////////////////////////////////////////////
// Export our schema
//////////////////////////////////////////////////
module.exports = reviewSchema