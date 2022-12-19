const QuizModel = require('../models/quiz.model.js')

const create = async (req, res) => {
	try {
		const creatorId = req.body.userId
		console.log(creatorId)
		const doc = await new QuizModel({
			title: '',
			imgPath: '',
			settings: {
				type: '',
				time: 10,
				isStart: false,
			},
			questions: [],
			creatorId,
		})

		const { _id } = await doc.save()

		res.json(_id)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось создать викторину',
		})
	}
}
const update = async (req, res) => {
	try {
		const postId = req.params.id

		const updatedQuiz = await QuizModel.findByIdAndUpdate(postId, req.body, {
			new: true,
		}).exec()

		res.json(updatedQuiz)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось обновить викторину',
		})
	}
}

const getAll = async (req, res) => {
	try {
		const quiz = await QuizModel.find()
		res.json(quiz)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить викторины',
		})
	}
}

const getAllSearchTerm = async (req, res) => {
	try {
		const searchTerm = req.query.searchTerm

		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						title: RegExp(searchTerm, 'i'),
					},
				],
			}
		}

		const doc = await QuizModel.find(options).exec()

		res.json(doc)
	} catch (error) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось удалить викторину',
		})
	}
}

const deleteOne = async (req, res) => {
	try {
		const quizId = req.params.id

		await QuizModel.findByIdAndDelete(quizId).exec()

		res.json({
			message: 'Викторина удалена',
		})
	} catch (error) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось удалить викторину',
		})
	}
}
const getOne = async (req, res) => {
	try {
		const quizId = req.params.id
		const Quiz = await QuizModel.findOne({ quizId })

		res.json(Quiz)
	} catch (error) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить викторину',
		})
	}
}

exports.getAllSearchTerm = getAllSearchTerm
exports.getOne = getOne
exports.deleteOne = deleteOne
exports.getAll = getAll
exports.update = update
exports.create = create
