import config from '../../config.js'

///////////////////////////////////// VARIABLES ///////////////////////////////////////

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

class Player {
    constructor(name, side) {
        this.name = name;
        this.side = side;
        let docElem;
        if (this.side === 'left') {
            docElem = document.getElementById('leftName');
        } else {
            docElem = document.getElementById('rightName');
        }
        this.displayName = this.name.length < 10 ? this.name : this.name.slice(0, 9) + "...";
        docElem.textContent = this.displayName;
    }
    score = 0;
    posY = canvas.height / 2 - paddleHeight / 2;
    inputUp = false;
    inputDown = false;
}

let leftPlayer = null;
let rightPlayer = null;

let gameIsRunning = false;
let animationId;
const maxScore = 3;

const paddleWidth = 20
const paddleHeight = 100;
const paddleSpeed = 10;

class Ball {
    constructor() {}
    radius = 10;
    posX = canvas.width / 2;
    posY = canvas.height / 2;
    speedX = 5;
    speedY = 5;
}
let gameBall = new Ball();

const controls = {
    leftUp: 'w',
    leftDown: 's',
    rightUp: 'ArrowUp',
    rightDown: 'ArrowDown',
}

const matchStatus = {
    play: 'playing',
    pause: 'paused',
    finish: 'finished',
    cancel: 'cancelled',
}

const formPlayer = document.getElementById('formPlayer1');

const cardPlayer = document.getElementById('cardPlayer1');


const leftDisplayScore = document.getElementById('leftScore');
const rightDisplayScore = document.getElementById('rightScore');

const playButton = document.getElementById('playButton');
document.getElementById('buttons').style.visibility = 'hidden';

let matchId = null;

const modalEndScore = bootstrap.Modal.getOrCreateInstance(document.getElementById('endModal'));

const navbarButton = document.querySelector('.navbar-brand');


//////////////////////////////// LISTENERS & FUNCTIONS AT START ////////////////////////

draw();

formPlayer.addEventListener('submit', handleFormSubmit);
playButton.addEventListener('click', handlePlayButton);
window.addEventListener('hashchange', handleLeaving);
navbarButton.addEventListener('click', handleNavBar);
window.addEventListener('beforeunload', handleRefresh);

///////////////////////////////////// ASYNC //////////////////////////////////////////

async function newPlayer(form) {
    try {
		let invalidText;
        let card;
        invalidText = document.getElementById('invalid-form1');
        card = cardPlayer;
        const formData = new FormData(form);
        console.log(formData);
        const response = await fetch(config.BACKEND_URL + '/match/new-player/', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            },
        });

		if (response.ok)
		{
			let invalidText;
			let card;
			invalidText = document.getElementById('invalid-form1');
			card = cardPlayer;
			const formData = new FormData(form);
			formData.set('username', 'HAL 9000');
			console.log(formData);
			const response = await fetch(config.BACKEND_URL + '/match/new-player/', {
				method: 'POST',
				body: formData,
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
				},
			});
		}

        const data = await response.json();
        console.log(data);
        form.reset();
        if (data['success'] === true) {
            leftPlayer = new Player(data['username'], "left")
            rightPlayer = new Player("HAL 9000", "right")
            form.removeEventListener('submit', handleFormSubmit);
            card.style.visibility = 'hidden';
            invalidText.textContent = '';
            if (leftPlayer !== null && rightPlayer !== null) {
                document.getElementById('buttons').style.visibility = 'visible';
                showScoreBoard();
            }
        } else {
            if (data.hasOwnProperty('non_field_errors')) {
                invalidText.textContent = data['non_field_errors'];
            } else if (data['message']) {
                invalidText.textContent = data['message'];
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function newMatch(leftName, rightName) {
    try {
        const message = {
            'left_player_name': leftName,
            'right_player_name': rightName,
            'type': 'local',
            'max_score': maxScore,
			'tournament_id': -1,
        };
        console.log(message);
        const response = await fetch(config.BACKEND_URL + '/match/new-match/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
        const data = await response.json();
        console.log(data);
        matchId = data['match_id']
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateMatchStatus(newStatus, leftScore, rightScore) {
    try {
        const message =
            {
                'id': matchId,
                'new_status': newStatus,
                'left_score': leftScore,
                'right_score': rightScore,
            };
        console.log(message);
        const response = await fetch(config.BACKEND_URL + '/match/update-match/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
            keepalive: true,
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
            console.error('Error:', error);
    }
}

async function updatePlayerStatus(player) {
    try {
        const message =
            {
				'type': 'toggle_status',
				'left_player_name': player === null ? null : player.name,
				'right_player_name': 'HAL 9000',
				'max_score': maxScore,
				'tournament_id': -1,
            };
        console.log(message);
        const response = await fetch(config.BACKEND_URL + '/match/update-players/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            },
            body: JSON.stringify(message),
            keepalive: true,
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

///////////////////////////////////// GAME ////////////////////////////////////////////

function gameLoop() {
    if (!gameIsRunning)
        return;
    update();
    draw();
    animationId = requestAnimationFrame(gameLoop);
}

function update() {
    updatePaddle(leftPlayer);
	Hal9000();
    updatePaddle(rightPlayer);
    updateBall();
    checkCollisions();
    checkOutOfBound();
    checkWinner();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw top line
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 20;
    ctx.stroke();
    ctx.closePath();

    // draw bottom line
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 20; 
    ctx.stroke();
    ctx.closePath();

    // draw middle line
    ctx.beginPath();
    ctx.setLineDash([10, 5]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.closePath();

    // draw paddles
    ctx.fillStyle = '#FFF';
    if (rightPlayer === null && leftPlayer === null) {
        ctx.fillRect(0, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight);
        ctx.fillRect(canvas.width - paddleWidth, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight);
    } else {
        ctx.fillRect(0, leftPlayer.posY, paddleWidth, paddleHeight);
        ctx.fillRect(canvas.width - paddleWidth, rightPlayer.posY, paddleWidth, paddleHeight);
    }
    
    // draw ball
    ctx.beginPath();
    ctx.arc(gameBall.posX, gameBall.posY, gameBall.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF';
    ctx.fill();
    ctx.closePath();
}

function updatePaddle(player) {
    if (player.inputUp && player.posY > 0) {
        player.posY -= paddleSpeed;
    } else if (player.inputDown && player.posY + paddleHeight < canvas.height) {
        player.posY += paddleSpeed;
    }
}

function showScoreBoard() {
    leftDisplayScore.textContent = leftPlayer.score;
    rightDisplayScore.textContent = rightPlayer.score;
    leftDisplayScore.style.visibility = 'visible';
    rightDisplayScore.style.visibility = 'visible';
}

function hideScoreBoard() {
    leftDisplayScore.style.visibility = 'hidden';
    rightDisplayScore.style.visibility = 'hidden';
}

function updateScoreBoard() {
    leftDisplayScore.textContent = leftPlayer.score;
    rightDisplayScore.textContent = rightPlayer.score;
}

function resetNames() {
    document.getElementById('leftName').textContent = '';
    document.getElementById('rightName').textContent = '';
}


function updateBall() {
    gameBall.posX += gameBall.speedX;
    gameBall.posY += gameBall.speedY;
}

function resetBall() {
    gameBall.posX = canvas.width / 2;
    gameBall.posY = canvas.height / 2;
    gameBall.speedX = -gameBall.speedX;
    gameBall.speedY = Math.random() * 10 - 5;
}

function checkCollisions() {
    // Check collision with top or bottom
    if (gameBall.posY - gameBall.radius - 10 < 0 || gameBall.posY + gameBall.radius > canvas.height - 10) {
        gameBall.speedY = -gameBall.speedY;
    }
    // Check collision with left paddle
    if (gameBall.posX - gameBall.radius < paddleWidth &&
        gameBall.posY + gameBall.radius > leftPlayer.posY &&
        gameBall.posY - gameBall.radius < leftPlayer.posY + paddleHeight) {
        gameBall.speedX = -gameBall.speedX;
    }
    // Check collision with right paddle
    if (gameBall.posX + gameBall.radius > canvas.width - paddleWidth &&
        gameBall.posY + gameBall.radius > rightPlayer.posY &&
        gameBall.posY - gameBall.radius < rightPlayer.posY + paddleHeight) {
        gameBall.speedX = -gameBall.speedX;
    }
}

function checkOutOfBound() {
    if (gameBall.posX - paddleWidth < 0) {
        rightPlayer.score++;
        updateScoreBoard();
        resetBall();
    } else if (gameBall.posX + paddleWidth > canvas.width) {
        leftPlayer.score++;
        resetBall();
        updateScoreBoard();
    }
}

function checkWinner() {
    if (leftPlayer.score === maxScore) {
        playerWins(leftPlayer);
    } else if (rightPlayer.score === maxScore) {
        playerWins(rightPlayer);
    }
}

function playerWins(player) {
    gameIsRunning = false;
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    document.getElementById('buttons').style.visibility = 'hidden';
    playButton.removeEventListener('click', handlePlayButton);
    updateMatchStatus(matchStatus.finish, leftPlayer.score, rightPlayer.score);
    matchId = null;
    document.getElementById('endModalMessage').textContent = player.name + ' won! Rematch?';
    modalEndScore.show();
    let newGameButton = document.getElementById('newGameButton');
    newGameButton.addEventListener('click', backToStart);
    let rematchButton = document.getElementById('rematchButton');
    rematchButton.addEventListener('click', reMatch);
}

let lastRefreshTime = 0;
const refreshInterval = 1000;
let predictedPosY = 0;
let ballSpeed = 0;

function Hal9000() {
	const currentTime = new Date().getTime();

	if (currentTime - lastRefreshTime > refreshInterval)
	{
		const horizontalDistance = canvas.width - gameBall.posX;
		const timeToReach = horizontalDistance / Math.abs(gameBall.speedX);
		predictedPosY = gameBall.posY + gameBall.speedY * timeToReach;
		ballSpeed = gameBall.speedY;
		lastRefreshTime = currentTime;
	}

	rightPlayer.inputDown = false;
	rightPlayer.inputUp = false;

	const verticalCenter = rightPlayer.posY + paddleHeight / 2;
	const ballRelativePosition = predictedPosY - verticalCenter;

	if (ballRelativePosition < 0)
	{
		if (ballRelativePosition < -paddleHeight * 0.5)
			rightPlayer.inputUp = true;
		else if (ballRelativePosition > paddleHeight * 0.5)
			rightPlayer.inputDown = true;
	} else
	{
		const positionDifference = Math.abs(predictedPosY - rightPlayer.posY);
		if (positionDifference > paddleHeight * 0.4) {
			if (ballSpeed > 0)
				rightPlayer.inputDown = true;
			else if (ballSpeed < 0)
				rightPlayer.inputUp = true;
		}
	}
}

/////////////////////////////////// CALLBACKS /////////////////////////////////////////////

function handleFormSubmit(event) {
    event.preventDefault();
    let form = event.target;
    let side;
    if (event.target.id === 'formPlayer')
        side = 'left';
    newPlayer(form, side);
}

function handleOnKey(event, key, isPressedOrNot) {
    event.preventDefault();
    switch (key) {
        case controls.leftUp:
            leftPlayer.inputUp = isPressedOrNot;
            break;
        case controls.leftDown:
            leftPlayer.inputDown = isPressedOrNot;
            break;
    }
}

function handleKeyDown(event) {
    return handleOnKey(event, event.key, true);
}

function handleKeyUp(event) {
    return handleOnKey(event, event.key, false);
}

function handlePlayButton(event) {
    let button = event.target;
    let buttonState = event.target.textContent;
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    if (buttonState === 'Play' && gameIsRunning === false) {
        if (matchId == null) {
            newMatch(leftPlayer.name, rightPlayer.name);
        }
        else {
            updateMatchStatus(matchStatus.play, leftPlayer.score, rightPlayer.score);
        }
        gameIsRunning = true;
        event.target.textContent = 'Pause';
        
    } else if (buttonState === 'Pause' && gameIsRunning === true) {
        gameIsRunning = false;
        event.target.textContent = 'Play';
        updateMatchStatus(matchStatus.pause, leftPlayer.score, rightPlayer.score);
    }
    gameLoop();
}

function backToStart() {
    modalEndScore.hide();
    hideScoreBoard();
    resetNames();
    leftPlayer.playing = false;
    updatePlayerStatus(leftPlayer);
    leftPlayer = null;
    rightPlayer.playing = false;
    updatePlayerStatus(rightPlayer);
    rightPlayer = null;
    draw();
    playButton.textContent = 'Play';
    playButton.addEventListener('click', handlePlayButton);
    cardPlayer.style.visibility = 'visible';
    formPlayer.addEventListener('submit', handleFormSubmit);
}

function reMatch() {
    modalEndScore.hide();
    leftPlayer = new Player(leftPlayer.name, true, "left");
    leftPlayer.playing = true;
    rightPlayer = new Player(rightPlayer.name, true, "right");
    rightPlayer.playing = true;
    updateScoreBoard();
    draw();
    playButton.textContent = 'Play';
    document.getElementById('buttons').style.visibility = 'visible';
    playButton.addEventListener('click', handlePlayButton);
}

function handleNavBar(event) {
    window.location.href = this.getAttribute('href');
    navbarButton.removeEventListener('click', handleNavBar);
}

function handleRefresh(event) {
    event.preventDefault();
    gameIsRunning = false;
    if (matchId !== null) {
        updateMatchStatus(matchStatus.cancel, leftPlayer.score, rightPlayer.score);
        matchId = null;
    }
    if (leftPlayer !== null && leftPlayer.playing === true) {
        leftPlayer.playing = false;
        updatePlayerStatus(leftPlayer);
        leftPlayer = null;
    }
    if (rightPlayer !== null && rightPlayer.playing === true) {
        rightPlayer.playing = false;
        updatePlayerStatus(rightPlayer);
        rightPlayer = null;
    }
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    window.removeEventListener('beforeunload', handleRefresh);
}

function handleLeaving(event) {
    gameIsRunning = false;
    if (matchId !== null) {
        updateMatchStatus(matchStatus.cancel, leftPlayer.score, rightPlayer.score);
        matchId = null;
    }
    if (leftPlayer !== null && leftPlayer.playing === true) {
        leftPlayer.playing = false;
        updatePlayerStatus(leftPlayer);
        leftPlayer = null;
    }
    if (rightPlayer !== null && rightPlayer.playing === true) {
        rightPlayer.playing = false;
        updatePlayerStatus(rightPlayer);
        rightPlayer = null;
    }
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    window.removeEventListener('hashchange', handleLeaving);
}