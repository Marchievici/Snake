const board = document.getElementById('gameBoard')
const gridSize = 21
let lastRenderTime = 0
let snakeSpeed = 3
let snakeBody = [{x: 11, y: 11}]
let direction = {x: 0, y: 0}
let lastDirection = {x: 0, y: 0}
let food = getRandomFoodPos()
const snakeExpansion = 1
let newSnakePart = 0
let gameLost = false
let score = 0

function main(currentTime) {
	if (gameLost) {
		let reset = createRsButton()
		reset.addEventListener("click", function() { restart() })
		return 
	}
	window.requestAnimationFrame(main)
	const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
	if (secondsSinceLastRender < 1 / snakeSpeed) return
	lastRenderTime = currentTime
	board.innerHTML = '';
	checkLost()
	update()
	draw(board)
}

window.requestAnimationFrame(main)

function update() {
	const direction = getDirection();
	for (let  i = snakeBody.length - 2; i >= 0; --i) {
		snakeBody[i + 1] = { ...snakeBody[i] }
	}
	snakeBody[0].x += direction.x;
	snakeBody[0].y += direction.y; 
	updateFood()
}

function draw(gameBoard) {
	snakeBody.forEach(part => {
		const snakeElement = document.createElement('div')
		snakeElement.style.gridRowStart = part.y
		snakeElement.style.gridColumnStart = part.x
		snakeElement.classList.add('snake')
		gameBoard.appendChild(snakeElement)
	})
	drawFood(board)
}

window.addEventListener("keydown", e => {
	hideText()
	switch(e.key) {
		case 'ArrowUp':
			if (lastDirection.y !== 0) {
				break
			}		
			direction = {x: 0, y: -1}
			break
		case 'ArrowDown':
			if (lastDirection.y !== 0) {
				break
			}			
			direction = {x: 0, y: 1}
			break
		case 'ArrowRight':
			if (lastDirection.x !== 0) {
				break
			}
			direction = {x: 1, y: 0}
			break
		case 'ArrowLeft':
			if (lastDirection.x !== 0) {
				break
			}
			direction = {x: -1, y: 0}
			break
	}
})

function getDirection() {
	lastDirection = direction
	return direction;
}

function drawFood(gameBoard) {
	const foodElem = document.createElement('div')
	foodElem.style.gridRowStart = food.y
	foodElem.style.gridColumnStart = food.x
	foodElem.classList.add('food')
	gameBoard.appendChild(foodElem)
}

function updateFood() {
	let check = isOnSnake(food)
	if (check === true) {
		addParts()
		expandSnake(snakeExpansion)
		food = getRandomFoodPos()
		updateScore()
	}
}

function expandSnake(rate) {
	newSnakePart += rate
}

function isOnSnake(position) {
	let check = false
	snakeBody.forEach(part => {
		if (part.y === position.y && part.x === position.x) {
			check = true
			return check
		}
	})
	return check
}

function addParts() {
	for (let i = 0; i < snakeExpansion; ++i) {
		snakeBody.push({ ...snakeBody[snakeBody.length - 1] })
	}
	newSnakePart = 0;
}

function getRandomFoodPos() {
	let newPosition
	while (newPosition == null || isOnSnake(newPosition)) {
		newPosition = randomPosition()
	}
	return newPosition
}

function randomPosition() {
	return {
		x: Math.floor(Math.random() * gridSize + 1),
		y: Math.floor(Math.random() * gridSize + 1)
	}
}

function checkLost() {
	gameLost = outsideGrid(getSnakeHead()) || snakeIntersection()
}

function outsideGrid(position) {
	if (position.x < 1 || position.x > gridSize ||
		position.y < 1 || position.y > gridSize) {
		return true
	}
	return false
}

function getSnakeHead() {
	return snakeBody[0];
}

function snakeIntersection() {
	for (let i = 2; i < snakeBody.length; ++i) {
		if (snakeBody[0].y === snakeBody[i].y &&
			snakeBody[0].x === snakeBody[i].x) {
			return true
		}
	}
	return false
}

function updateScore() {
	let record = document.getElementById("score")
	++score
	record.innerHTML =	"Score: " + score
	increaseSpeed(score)
}

function increaseSpeed(score) {
	if (score % 3 === 0) {
		snakeSpeed += 1;
	}
}

function createRsButton() {
	let reset = document.createElement("BUTTON")
	reset.innerHTML = "Restart"
	reset.classList.add("btn-primary")
	reset.style.height = "40px"
	document.body.appendChild(reset)
	let message = document.createElement("h3")
	document.body.appendChild(message)
	message.innerHTML = "You lost, press restart to try again! :)"
	return reset
}

function restart() {
	location.reload()
}

function hideText() {
	var p = document.getElementById("parag")
	p.style.display = "none"
	let title = document.getElementById("gameTitle")
	title.style.display = "none"
}

