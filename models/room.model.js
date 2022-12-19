const mongoose = require('mongoose')


const RoomSchema = new mongoose.Schema(
	{
		room: {
			type: String,
			require: true,
		},
		quizId: {
			type: String,
			require: true,
		},
		isStart: {
			type: Boolean,
		},
		players: {
			type: Array,
		},
		top: {
			type: Array,
		},
		settings: {
			type: Object,
		},
		creatorId: {
			type: String,
			require: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Room', RoomSchema)
