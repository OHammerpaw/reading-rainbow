// import what I need
const { Schema, model } = require('./connection.js')

const Book = require('./book')

// create the schema
const UserSchema = new Schema(
	{
		username: { 
			type: String, 
			required: true, 
			unique: true 
		},
		password: { 
			type: String, 
			required: true 
		},
		read: [{
			type: Schema.Types.ObjectId,
			unique: true,
			ref: 'Book'
		}],
		toread: [{
			type: Schema.Types.ObjectId,
			unique: true,
			ref: 'Book'
		}]
	}
)

// create the model
const User = model('User', UserSchema)

// export the model
module.exports = User
