// import thumbsupply from 'thumbsupply'
const multer = require('multer')
const fs = require('fs')


const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (!fs.existsSync('media')) {
			fs.mkdirSync('media')
		}
		cb(null, './media')
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '--' + file.originalname)
	},
})

const upload = multer({ storage })

//==========================================================


const uploadIMG = (req, res) => {
	const files = req.files
	let paths = []

	files.map((file, index) =>
		paths.push({
			_id: index,
			name: file.filename,
			path: `/${file.path}`,
			size: formatBytes(file.size),
		})
	)
	res.status(200).json({
		status: 'success',
		message: 'Файл успешно загружен',
		data: paths,
	})
}

// export const uploadVideo = async (req, res) => {
// 	try {
// 		const file = req.file

// 		const result = await thump(file.path)

// 		const paths = {
// 			_id: 0,
// 			name: file.filename,
// 			path: `/${file.path}`,
// 			size: formatBytes(file.size),
// 			result,
// 		}

// 		await res.json({
// 			status: 'success',
// 			message: 'Файл успешно загружен',
// 			data: paths,
// 		})
// 	} catch (error) {
// 		console.log(error)
// 	}
// }

// const thump = async path => {
// 	return await thumbsupply.generateThumbnail(path, {
// 		size: thumbsupply.ThumbSize.MEDIUM,
// 		timestamp: '10%',
// 		forceCreate: true,
// 		cacheDir: './images',
// 		mimetype: 'video/mp4',
// 	})
// }

const formatBytes = (bytes, decimals = 2) => {
	if (bytes === 0) return '0 Bytes'
	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}



exports.upload = upload
exports.uploadIMG = uploadIMG