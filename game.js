const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const paddleWidth = 10, paddleHeight = 100;
const ballRadius = 10;

let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
let leftScore = 0, rightScore = 0;

// Ball position & velocity
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 5, ballSpeedY = 3;

// Paddle movement
let upPressed = false, downPressed = false;

document.addEventListener('keydown', function(e) {
    if (e.key === "ArrowUp") upPressed = true;
    if (e.key === "ArrowDown") downPressed = true;
});
document.addEventListener('keyup', function(e) {
    if (e.key === "ArrowUp") upPressed = false;
    if (e.key === "ArrowDown") downPressed = false;
});

function drawPaddle(x, y) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "32px Arial";
    ctx.fillText(leftScore, canvas.width / 4, 40);
    ctx.fillText(rightScore, 3 * canvas.width / 4, 40);
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = (Math.random() > 0.5 ? 5 : -5);
    ballSpeedY = (Math.random() > 0.5 ? 3 : -3);
}

function update() {
    // Move paddles
    if (upPressed && rightPaddleY > 0) rightPaddleY -= 7;
    if (downPressed && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += 7;

    // Simple AI for left paddle
    if (leftPaddleY + paddleHeight / 2 < ballY) leftPaddleY += 5;
    else if (leftPaddleY + paddleHeight / 2 > ballY) leftPaddleY -= 5;
    leftPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, leftPaddleY));

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Collision with top/bottom
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) ballSpeedY = -ballSpeedY;

    // Collision with paddles
    if (
        ballX - ballRadius < paddleWidth &&
        ballY > leftPaddleY &&
        ballY < leftPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
        ballX = paddleWidth + ballRadius; // Prevent sticking
    }
    if (
        ballX + ballRadius > canvas.width - paddleWidth &&
        ballY > rightPaddleY &&
        ballY < rightPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
        ballX = canvas.width - paddleWidth - ballRadius; // Prevent sticking
    }

    // Score
    if (ballX - ballRadius < 0) {
        rightScore++;
        resetBall();
    }
    if (ballX + ballRadius > canvas.width) {
        leftScore++;
        resetBall();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(0, leftPaddleY); // Left
    drawPaddle(canvas.width - paddleWidth, rightPaddleY); // Right
    drawBall(ballX, ballY);
    drawScore();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
