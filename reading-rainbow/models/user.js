// import what I need
const { Schema, model } = require('./connection.js')

const Book = require('./book') // unused import, we don't need the model to use refs 

// create the schema
const UserSchema = new Schema(
	{
		username: {
			type: String, 
			required: true, 
			unique: true // nice use of the options here
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
		toread: [{// should be camel case
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
