const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			unique: true,
			require: true,
		},

		passwordHash: {
			type: String,
			require: true,
		},
	},
	{
		timestamps: true,
	}
)
module.exports = mongoose.model('User', UserSchema)

