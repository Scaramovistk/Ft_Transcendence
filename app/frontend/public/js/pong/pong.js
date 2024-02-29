  var WIDTH = 1400,
      HEIGHT = 800,
      VIEW_ANGLE = 105,
      ASPECT = WIDTH / HEIGHT,
      NEAR = 0.1,
      FAR = 10000,
      FIELD_WIDTH = 150,
      FIELD_LENGTH = 250,
      BALL_RADIUS = 4.5,
      PADDLE_WIDTH = 32,
      PADDLE_HEIGHT = 5,
      PADDLE_SPEED = 150,
      PLAYER_AMOUNT = 2,

      scoreBoard = document.getElementById('scoreBoard'),

      container, renderer, camera, mainLight,
      scene, ball, paddle1, paddle2, field, running,
      paddle1speed, paddle2speed, wall1, wall2, players, clock, delta,
      score = {
        player1: 0,
        player2: 0
      };


  function startBallMovement() {
    var direction = Math.random() > 0.5 ? -20 : 20;
    ball.$velocity = {
      y: direction,
      x: direction * 8
    };
    ball.$stopped = false;
  }

  function processCpuPaddle() {
    var ballPos = ball.position,
        cpuPos = paddle1.position;

    if(cpuPos.y > ballPos.y) {
      paddle1speed = -PADDLE_SPEED;
    }else if(cpuPos.y < ballPos.y) {
      paddle1speed = PADDLE_SPEED;;
    }
    else {
      paddlespeed1 = 0;
    }
  }

  function processBallMovement() {
    if(!ball.$velocity) {
      startBallMovement();
    }

    if(ball.$stopped) {
      return;
    }

    updateBallPosition();

    if(isSideCollision()) {
      ball.$velocity.y *= -1;
    }

    if(isPaddle1Collision()) {
      ball.$velocity.y += paddle1speed / 3;
      hitBallBack(paddle1);
    }

    if(isPaddle2Collision()) {
      ball.$velocity.y += paddle2speed / 3;
      hitBallBack(paddle2);
    }

    if(isPastPaddle2()) {
      scoreBy('player1');
    }

    if(isPastPaddle1()) {
      scoreBy('player2');
    }
  }

  function isPastPaddle1() {
    return ball.position.x < paddle2.position.x - 50;
  }

  function isPastPaddle2() {
    return ball.position.x > paddle1.position.x + 50;
  }

  function updateBallPosition() {
    var ballPos = ball.position;

    ballPos.y += ball.$velocity.y * delta;
    ballPos.x += ball.$velocity.x * delta;

  }

  function isSideCollision() {
    var ballY = ball.position.y,
        halfFieldWidth = FIELD_WIDTH / 2;
    if (ballY - BALL_RADIUS < -halfFieldWidth && ball.$velocity.y < 0) {
      return (1);
    }
    else if (ballY + BALL_RADIUS > halfFieldWidth && ball.$velocity.y > 0) {
      return (1);
    }
    else {
      return (0);
    }
  }

  function hitBallBack(paddle) {
    ball.$velocity.x *= -1.05;
  }

  function isPaddle2Collision() {
    return ball.position.x - BALL_RADIUS <= paddle2.position.x + PADDLE_HEIGHT / 2 &&
        ball.position.x - BALL_RADIUS >= paddle2.position.x - PADDLE_HEIGHT / 2 &&
        isBallAlignedWithPaddle(paddle2) && ball.$velocity.x < 0;
  }

  function isPaddle1Collision() {
    return ball.position.x + BALL_RADIUS >= paddle1.position.x - PADDLE_HEIGHT / 2 &&
        ball.position.x + BALL_RADIUS <= paddle1.position.x + PADDLE_HEIGHT / 2 &&
        isBallAlignedWithPaddle(paddle1) && ball.$velocity.x > 0;
  }

  function isBallAlignedWithPaddle(paddle) {
    var halfPaddleWidth = PADDLE_WIDTH / 2,
        paddleY = paddle.position.y,
        ballY = ball.position.y;
    return ballY > paddleY - halfPaddleWidth &&
        ballY < paddleY + halfPaddleWidth;
  }

  function scoreBy(playerName) {
      addPoint(playerName);
      updateScoreBoard();
      stopBall();
      setTimeout(reset, 1500);
  }

  function updateScoreBoard() {
      scoreBoard.innerHTML = 'Player 1: ' + score.player1 + ' player 2: ' +
        score.player2;
  }

  function stopBall(){
    ball.$stopped = true;
  }

  function addPoint(playerName){
    score[playerName]++;
    console.log(score);
  }

  function startRender(){
    running = true;
    render();
  }

  function stopRender() {
    running = false;
  }

  function render() {
    if(running) {
      requestAnimationFrame(render);
      delta = clock.getDelta();
      paddle1.position.y += paddle1speed * delta;
      if (paddle1.position.y > FIELD_WIDTH / 2 - PADDLE_WIDTH / 2)
        paddle1.position.y = FIELD_WIDTH / 2 - PADDLE_WIDTH / 2;
      if (paddle1.position.y < - FIELD_WIDTH / 2 + PADDLE_WIDTH / 2)
        paddle1.position.y = -FIELD_WIDTH / 2 + PADDLE_WIDTH / 2;
      paddle2.position.y += paddle2speed * delta;
      if (paddle2.position.y > FIELD_WIDTH / 2 - PADDLE_WIDTH / 2)
        paddle2.position.y = FIELD_WIDTH / 2 - PADDLE_WIDTH / 2;
      if (paddle2.position.y < - FIELD_WIDTH / 2 + PADDLE_WIDTH / 2)
        paddle2.position.y = -FIELD_WIDTH / 2 + PADDLE_WIDTH / 2;
      if (players == 1)
      {
    	  processCpuPaddle();
      }
    	processBallMovement();

    	renderer.render(scene, camera);
    }
  }

  function reset() {
    ball.position.set(0,0,0);
    ball.$velocity = null;
  }

  function init() {
    container = document.getElementById('container');

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x0041c2, 1);
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.set(0, -40, 90);

    scene = new THREE.Scene();
    scene.add(camera);
    players = PLAYER_AMOUNT;
    clock = new THREE.Clock();

    var fieldGeometry = new THREE.CubeGeometry(FIELD_LENGTH, FIELD_WIDTH, 5, 1, 1, 1),
        fieldMaterial = new THREE.MeshLambertMaterial({ color: 0x3F3F3F });
    field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.position.set(0, 0, 0);
    var wallGeometry = new THREE.CubeGeometry(FIELD_LENGTH, 1, 40, 1, 1, 1),
    fieldMaterial = new THREE.MeshLambertMaterial({ color: 0xCDCDCD });
    wall1  = new THREE.Mesh(wallGeometry, fieldMaterial);
    wall1.position.set(0, FIELD_WIDTH / 2, 0);
    wall2  = new THREE.Mesh(wallGeometry, fieldMaterial);
    wall2.position.set(0, -FIELD_WIDTH / 2 - 0.5, 0);

    scene.add(field);
    scene.add(wall1);
    scene.add(wall2);
    paddle1 = addPaddle();
    paddle1.position.x = FIELD_LENGTH / 2;
	  paddle1.position.z = 0;
    paddle1speed = 0;
    paddle2 = addPaddle();
    paddle2.position.x = -FIELD_LENGTH / 2;
	  paddle2.position.z = 0;
    paddle2speed = 0;

    var ballGeometry = new THREE.SphereGeometry(BALL_RADIUS, 16, 16),
        ballMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    scene.add(ball);

    camera.lookAt(ball.position);

    mainLight = new THREE.HemisphereLight(0xFFFFFF, 0x003300);
    scene.add(mainLight);

    camera.lookAt(ball.position);
    document.addEventListener("keydown", pressKey);
    document.addEventListener("keyup", releaseKey);

    updateScoreBoard();
    startRender();

    // renderer.domElement.style.cursor = 'none';
  }

  function addPaddle() {
    var paddleGeometry = new THREE.CubeGeometry(PADDLE_HEIGHT, PADDLE_WIDTH, 20, 1, 1, 1),
        paddleMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 }),
        paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    scene.add(paddle);
    return paddle;
  }

  function pressKey(e) {
    //i key
    var keyCode = e.which;
    if (keyCode == 73) {
      paddle1speed = PADDLE_SPEED;
    }
    // k key
    else if (keyCode == 75) {
      paddle1speed = -PADDLE_SPEED;
    }

    // w key
    if (keyCode == 87) {
      paddle2speed = PADDLE_SPEED;
    }
    // s key
    else if (keyCode == 83) {
      paddle2speed = -PADDLE_SPEED;
    }
  }

  function releaseKey(e) {
    if (e.which == 73 || e.which == 75) {
      paddle1speed = 0;
    }
    if (e.which == 87 || e.which == 83) {
      paddle2speed = 0;
    }
  }

  init();