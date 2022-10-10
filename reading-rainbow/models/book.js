// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const bookSchema = new Schema(
	{
		title: { type: String, required: true },
		author: { type: String, required: true },
        pages: { type: Number, required: true },
		genre: { type: String, required: true },
		ibsn: { type: String, required: true },
		},
		
	{ timestamps: true }
)

const Book = model('Book', bookSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Book
