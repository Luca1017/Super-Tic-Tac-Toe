class SmallBoard {
  // TODO: move in another js file
  constructor() {
    this.board = [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ];
    this.isActive = true;
    this.winner = null;
  }

  drawBoard(xOrigin, yOrigin) {
    translate(xOrigin, yOrigin);
    if (this.winner == "x") {
      stroke(224, 70, 70);
      strokeWeight(3);
    } else if (this.winner == "o") {
      stroke(67, 187, 217);
      strokeWeight(3);
    } else if (this.isActive) {
      stroke(84, 212, 70);
      strokeWeight(3);
    } else {
      stroke(0);
      strokeWeight(1);
    }

    // draw lines
    for (let i = 1; i < 3; i++) {
      line(0, (i * HEIGHT) / 9, WIDTH / 3, (i * HEIGHT) / 9);
    }
    for (let i = 1; i < 3; i++) {
      line((i * WIDTH) / 9, 0, (i * WIDTH) / 9, HEIGHT / 3);
    }

    // draw tiles
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] == "x")
          drawCross((i * WIDTH) / 9, (j * HEIGHT) / 9, WIDTH / 9, 3);
        else if (this.board[i][j] == "o")
          drawCircle((i * WIDTH) / 9, (j * HEIGHT) / 9, WIDTH / 9, 3);
      }
    }

    translate(-xOrigin, -yOrigin);
  }

  checkWin() {
    // check rows
    for (let i = 0; i < 3; i++) {
      if (
        this.board[0][i] == this.board[1][i] &&
        this.board[1][i] == this.board[2][i] &&
        this.board[0][i] != " "
      )
        this.winner = this.board[0][i];
    }

    // check cols
    for (let i = 0; i < 3; i++) {
      if (
        this.board[i][0] == this.board[i][1] &&
        this.board[i][1] == this.board[i][2] &&
        this.board[i][0] != " "
      )
        this.winner = this.board[i][0];
    }

    // check diagonals
    if (
      this.board[0][0] == this.board[1][1] &&
      this.board[1][1] == this.board[2][2] &&
      this.board[1][1] != " "
    )
      this.winner = this.board[1][1];
    if (
      this.board[0][2] == this.board[1][1] &&
      this.board[1][1] == this.board[2][0] &&
      this.board[1][1] != " "
    )
      this.winner = this.board[1][1];

    if (this.winner == null) {
      // if no winner was found check for draw
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (this.board[i][j] == " ") return;
        }
      }
      this.winner = " "; // draw
    }
  }
}

class BigBoard {
  constructor() {
    this.board = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        row.push(new SmallBoard());
      }
      this.board.push(row);
    }

    this.winner = null;
  }

  drawBoard() {
    // draw small boards
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.board[i][j].drawBoard(i * (WIDTH / 3), j * (HEIGHT / 3));
      }
    }

    // draw big tiles
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j].winner == "x") {
          drawCross(i * (WIDTH / 3), j * (HEIGHT / 3), WIDTH / 3, 15);
        } else if (this.board[i][j].winner == "o") {
          drawCircle(i * (WIDTH / 3), j * (HEIGHT / 3), WIDTH / 3, 15);
        }
      }
    }

    // draw big board
    strokeWeight(3);
    stroke(0);
    for (let i = 1; i < 3; i++) {
      line(0, (i * HEIGHT) / 3, WIDTH, (i * HEIGHT) / 3);
    }
    for (let i = 1; i < 3; i++) {
      line((i * WIDTH) / 3, 0, (i * WIDTH) / 3, HEIGHT);
    }

    if (this.winner != null) {
      if (this.winner == "x") fill(224, 70, 70);
      else fill(67, 187, 217);

      textSize(minorWidth / 4)
      textAlign(CENTER, CENTER)
      text(this.winner.toUpperCase() + " WON", WIDTH / 2, HEIGHT / 2);
    }
  }

  checkWin() {
    // check rows
    for (let i = 0; i < 3; i++) {
      if (
        this.board[0][i].winner == this.board[1][i].winner &&
        this.board[1][i].winner == this.board[2][i].winner &&
        this.board[0][i].winner != null
      )
        this.winner = this.board[0][i].winner;
    }

    // check cols
    for (let i = 0; i < 3; i++) {
      if (
        this.board[i][0].winner == this.board[i][1].winner &&
        this.board[i][1].winner == this.board[i][2].winner &&
        this.board[i][0].winner != null
      )
        this.winner = this.board[i][0].winner;
    }

    // check diagonals
    if (
      this.board[0][0].winner == this.board[1][1].winner &&
      this.board[1][1].winner == this.board[2][2].winner &&
      this.board[1][1].winner != null
    )
      this.winner = this.board[1][1];
    if (
      this.board[0][2].winner == this.board[1][1].winner &&
      this.board[1][1].winner == this.board[2][0].winner &&
      this.board[1][1].winner != null
    )
      this.winner = this.board[1][1].winner;
    
    if (this.winner == null) {
      // if no winner was found check for draw
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (this.board[i][j].winner == null) return;
        }
      }
      this.winner = " "; // draw TODO: add no draw for win differences
    }
  }
}

// socket variables
const socket = io("https://super-tic-tac-toe.onrender.com");
let clientId = "";
let enemyClientId = "";

// game variables
const minorWidth = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
const WIDTH = minorWidth;
const HEIGHT = minorWidth;
const board = new BigBoard();
let playerTurn, player, enemyPlayer;
let gameStarted = false;

// html variables
let turnPlayerText = document.getElementById("turn_player"); // TODO: let or  const

// socket events
socket.on("clientId", id => {
  clientId = id;
  document.getElementById("client_id").innerHTML = `Client ID: ${clientId}`;
});

socket.on("start", id => {
  gameStarted = true;
  enemyClientId = id;
  document.getElementById("game_status").innerHTML = `Game status: started`;
  document.getElementById("enemy_id").innerHTML = `Playing against: ${id}`;

  // decide first player
  let players = [clientId, enemyClientId];
  players.sort();

  if (players[0] == clientId) {
    playerTurn = true;
    player = "x";
    enemyPlayer = "o"
  } else {
    playerTurn = false;
    player = "o";
    enemyPlayer = "x"
  }

  document.getElementById("player_symbol").innerHTML = `You are playing as: ${player}`;
  turnPlayerText.innerHTML =  `Turn Player: ${playerTurn ? player : enemyPlayer}`;
});

socket.on("enemyMove", moveData => {
  // make move
  board.board[moveData.bigBoard.x][moveData.bigBoard.y].board[moveData.smallBoard.x][moveData.smallBoard.y] = enemyPlayer;

  // check wins
  board.board[moveData.bigBoard.x][moveData.bigBoard.y].checkWin();
  board.checkWin();

  // update turn
  playerTurn = true;
  turnPlayerText.innerHTML = `Turn Player: ${player}`;
  setNewActiveBoard(moveData.smallBoard.x, moveData.smallBoard.y)
});

socket.on("closedGame", () => {
  gameStarted = false;
})

// listen for enemy client id input
const submitButton = document.getElementById("submit_enemy_client_id");
submitButton.addEventListener("click", () => {
  enemyClientId = document.getElementById('enemy_client_id').value;
  socket.emit("startParty", enemyClientId);
});

// setup
function setup() {
  let cnv = createCanvas(WIDTH, HEIGHT);
  cnv.position(window.innerWidth / 2 - minorWidth / 2);
}


// draw
function draw() {
  if (!gameStarted) return;
  clear();
  board.drawBoard();
}

// mouse input
function mouseReleased() {
  if (!gameStarted) return;

  const smallBoardSize = WIDTH / 3;
  const smallTileSize = smallBoardSize / 3;

  // get small board clicked
  const bigBoardX = int(mouseX / smallBoardSize);
  const bigBoardY = int(mouseY / smallBoardSize);

  // get small tile clicked
  const smallBoardX = int(
    (mouseX - bigBoardX * smallBoardSize) / smallTileSize
  );
  const smallBoardY = int(
    (mouseY - bigBoardY * smallBoardSize) / smallTileSize
  );

  // check if player turn
  if(!playerTurn) return;

  // check if small board is active
  const smallBoardClicked = board.board[bigBoardX][bigBoardY];
  if (!smallBoardClicked.isActive) return;

  // check if tile is empty
  if (smallBoardClicked.board[smallBoardX][smallBoardY] != " ") return;
  
  // send data
  const moveData = {
    "bigBoard": {
      "x": bigBoardX,
      "y": bigBoardY,
    },
    "smallBoard": {
      "x": smallBoardX,
      "y": smallBoardY,
    }
  };
  socket.emit("move", moveData);

  // apply logic
  smallBoardClicked.board[smallBoardX][smallBoardY] = player;
  smallBoardClicked.checkWin();
  board.checkWin();
  playerTurn = false;
  turnPlayerText.innerHTML =  `Turn Player: ${enemyPlayer}`;

  // set new active board
  setNewActiveBoard(smallBoardX, smallBoardY);
}

function drawCross(xOrigin, yOrigin, size, weight) {
  const offset = size / 7;
  strokeWeight(weight);
  stroke(224, 70, 70); // RED

  translate(xOrigin, yOrigin);
  line(offset, offset, size - offset, size - offset);
  line(offset, size - offset, size - offset, offset);
  translate(-xOrigin, -yOrigin);
}

function drawCircle(xOrigin, yOrigin, size, weight) {
  const offset = size / 7;
  strokeWeight(weight);
  stroke(67, 187, 217); // BLUE
  fill(0, 0);

  translate(xOrigin, yOrigin);
  circle(size / 2, size / 2, size - offset * 2);
  translate(-xOrigin, -yOrigin);
}

function setNewActiveBoard(nextBigBoardX, nextBigBoardY) {
  if (board.winner != null) {
    // if game ended set all small boards to inactive
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board.board[i][j].isActive = false;
      }
    }
  } else if (board.board[nextBigBoardX][nextBigBoardY].winner != null) {
    // if target small board is complete the player can play on any non complete small board
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board.board[i][j].isActive = board.board[i][j].winner == null;
      }
    }
  } else {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const isNewActiveBoard = i == nextBigBoardX && j == nextBigBoardY;
        board.board[i][j].isActive = isNewActiveBoard;
      }
    }
  }
}