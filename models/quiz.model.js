const mongoose = require('mongoose') 

const QuizSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			require: true,
		},
		imgPath: {
			type: String,
		},
		settings: {
			type: Object,
			require: true,
		},
		questions: {
			type: Array,
			require: true,
		},
		creatorId: {
			type: String,
			require: true
		}
	},
	{
		timestamps: true,
	}
)


module.exports =  mongoose.model('Quiz', QuizSchema)



