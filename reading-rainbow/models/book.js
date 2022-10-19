// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user') // unused import 


const reviewSchema = require('./review')
// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const bookSchema = new Schema(// we always capitalize classes in JS / by extension also our model Schemas
	{
		title: { type: String, required: true },
		subtitle: {type: String},
		authors: { type: String, required: true },
        pageCount: { type: Number, required: true },
		genre: { type: String, required: true },
		description: {type: String, required: true},
		cover: {type: String, required: true},
		ibsn: { type: String, required: true },
		owner: { // unsure if it should be required or not 
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		reviews: [reviewSchema]
		},
		
	{ timestamps: true }
)

// const bookSchema = new Schema(
// 	{
// 		items: {
// 			volumeInfo: {
// 				title: {type: String, required: true},
// 				subtitle: {type: String},
// 				authors: {type: String, required: true},
// 				description: {type: String, required: true},
// 				pageCount: {type: Number, required: true},
// 			}
// 		}
// 	}
// )

const Book = model('Book', bookSchema) 

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Book
