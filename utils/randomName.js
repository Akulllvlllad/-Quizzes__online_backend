



const data = [
	'Зюзя',
	'Новожила',
	'Паркун',
	'Борзун',
	'Монки',
	'Чёрный Плащ',
	'Перкосрак',
	'Брахматр',
]


const randomName = () => {
	const rand = Math.floor(Math.random() * data.length)


	return data[rand]
}



exports.randomName = randomName