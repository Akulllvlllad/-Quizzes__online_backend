const RoomModel = require('../models/room.model.js')
const QuizModel = require('../models/quiz.model.js')

const createRoom = async (req, res) => {
	try {
		const doc = await new RoomModel({
			room: req.body.room,
			quizId: req.body.quizId,
			isStart: false,
			players: [],
			top: [],
			settings: {},
			questions: [],
		})

		const { _id } = await doc.save()

		res.json(_id)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось создать комнату',
		})
	}
}

const startRoom = async (req, res) => {
	try {
		const roomID = req.params.room

		await RoomModel.findOneAndUpdate({ room: roomID }, { isStart: true })
	} catch (error) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось начать игру',
		})
	}
}

const getRoom = async (req, res) => {
	try {
		const currentRoom = req.params.id

		const { quizId, ...room } = await RoomModel.findOne({ room: currentRoom })

		const quiz = await QuizModel.findById(quizId)

		res.json({ ...room._doc, quiz: { ...quiz._doc } })
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось найти игру',
		})
	}
}

const getRoomsByUserId = async (req, res) => {
	try {
		const userId = req.params.id

		const rooms = await RoomModel.find({ creatorId: userId }).populate(
			'quizId',
			'',
			'Quiz'
		)

		res.json(rooms)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось найти игру',
		})
	}
}

const getAllRooms = async (req, res) => {
	try {
		const rooms = await RoomModel.find()
			.populate('quizId', '', 'Quiz')
			.populate('creatorId', '', 'User')

		res.json(rooms)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не удалось найти игру',
		})
	}
}

exports.getAllRooms = getAllRooms

exports.getRoomsByUserId = getRoomsByUserId

exports.getRoom = getRoom

exports.startRoom = startRoom

exports.createRoom = createRoom
