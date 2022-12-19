const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const mongoose = require('mongoose')
const {
	create,
	update,
	getAll,
	deleteOne,
	getOne,
	getAllSearchTerm,
} = require('./controllers/quiz.controller')
const {
	createRoom,
	startRoom,
	getRoom,
	getRoomsByUserId,
	getAllRooms,
} = require('./controllers/room.controller')
const { register, getMe, login } = require('./controllers/user.controller')

const { checkAuth } = require('./middleware/checkAuth')

const { randomName } = require('./utils/randomName.js')

const RoomModel = require('./models/room.model')

const { upload, uploadIMG } = require('./controllers/upload.controller')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const httpServer = createServer(app)
const io = new Server(httpServer, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST', 'PUT'],
	},
})

mongoose
	.connect(
		'mongodb+srv://admin:admin@cluster0.i632jv9.mongodb.net/quiz?retryWrites=true&w=majority'
	)
	.then(() => console.log('BD is OK'))
	.catch(err => console.log('BD is ERROR', err))

//===========Quiz <=================
app.post('/quiz-create', create)
app.put('/quiz-update/:id', update)
app.get('/quiz-all', getAll)
app.get('/quiz-one/:id', getOne)
app.delete('/quiz-delete/:id', deleteOne)
app.get('/quiz-search', getAllSearchTerm)
//=============Media <=====================
app.use('/media', express.static('media'))
app.post('/multiple', upload.array('media', 5), uploadIMG)

//=============Room <======================
app.post('/room', createRoom)
app.put('/room/start/:room', startRoom)
app.get('/room-current/:id', getRoom)
app.get('/rooms/:id', getRoomsByUserId)
app.get('/rooms-all', getAllRooms)
//=============Auth <======================
app.post('/auth/register', register)
app.get('/auth/me', checkAuth, getMe)
app.post('/auth/login', login)

const top = new Map()
const onlinePlayer = new Map()

app.get('/room/:id', (req, res) => {
	const room = req.params.id

	res.json([...onlinePlayer].filter(([id, obj]) => obj.room === room))
})

app.get('/top/:id', (req, res) => {
	const room = req.params.id

	res.json(top[room])
})

app.patch('/top-update/:socket/:points/:room', (req, res) => {
	const updateSocket = onlinePlayer.get(socket)
	onlinePlayer.set(socket, { ...updateSocket, points: points })

	res.json()
})

io.on('connection', socket => {
	socket.on('ROOM:UPDATE_POINTS', data => {
		const { room, points } = data

		const updateSocket = onlinePlayer.get(socket.id)

		onlinePlayer.set(socket.id, { ...updateSocket, points: points })

		console.log(onlinePlayer)
		socket.to(room).emit(
			'JOIN',
			[...onlinePlayer].filter(([id, obj]) => obj.room === room)
		)

		socket.emit(
			'JOIN',
			[...onlinePlayer].filter(([id, obj]) => obj.room === room)
		)
	})

	socket.on('ROOM:JOIN', ({ room, name }) => {
		if (!name) name = randomName()

		socket.join(room)

		onlinePlayer.set(socket.id, { name, id: socket.id, room, points: 0 })
		console.log(name)
		socket.to(room).emit(
			'JOIN',
			[...onlinePlayer].filter(([id, obj]) => obj.room === room)
		)

		socket.emit('ROOM:ME', { isAuth: true, _id: socket.id })
	})

	socket.on('ROOM:GET', room => {
		RoomModel.findOne({ room: room }, (err, data) => {
			if (err) {
				console.log(err)
			} else {
				socket.emit('ROOM:CONNECTION-ROOM', data)
			}
		})
	})

	socket.on('ROOM:START', room => {
		socket.emit('ROOM:CONNECTION', true)
		socket.to(room).emit('ROOM:CONNECTION', true)
	})
	socket.on('ROOM:STOP', room => {
		socket.emit('ROOM:CONNECTION', false)
		socket.to(room).emit('ROOM:CONNECTION', false)
	})

	socket.on('disconnect', () => {
		const { room } = { ...onlinePlayer.get(socket.id) }

		onlinePlayer.delete(socket.id)
		socket.to(room).emit(
			'JOIN',
			[...onlinePlayer].filter(([id, obj]) => obj.room === room)
		)

		socket.to(room).emit('ROOM:TOP', top[room])
	})
})

httpServer.listen(3333, err => {
	if (err) {
		throw Error(err)
	}
	console.log('Сервер запущен!')
})
