
const board = document.getElementById("board");
const squares = [];
const pieces = [];
let selectedPiece = null;

// create the board
for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        const square = document.createElement("div");
        square.classList.add("square");
        if ((i + j) % 2 === 0) {
            square.classList.add("light");
        } else {
            square.classList.add("dark");
        }
        square.dataset.row = i;
        square.dataset.col = j;
        square.addEventListener("click", selectSquare);
        board.appendChild(square);
        squares.push(square);
    }
}

// create the pieces
for (let i = 0; i < 12; i++) {
    const piece = document.createElement("div");
    piece.classList.add("piece", "red");
    piece.dataset.color = "red";
    piece.dataset.row = Math.floor(i / 4) * 2 + 1;
    piece.dataset.col = (i % 4) * 2 + (piece.dataset.row % 2 === 0 ? 0 : 1);
    piece.addEventListener("click", selectPiece);
    squares[piece.dataset.row * 8 + piece.dataset.col].appendChild(piece);
    pieces.push(piece);
}

for (let i = 0; i < 12; i++) {
    const piece = document.createElement("div");
    piece.classList.add("piece", "black");
    piece.dataset.color = "black";
    piece.dataset.row = Math.floor(i / 4) * 2 + 6;
    piece.dataset.col = (i % 4) * 2 + (piece.dataset.row % 2 === 0 ? 1 : 0);
    piece.addEventListener("click", selectPiece);
    squares[piece.dataset.row * 8 + piece.dataset.col].appendChild(piece);
    pieces.push(piece);
}

function selectPiece() {
    if (selectedPiece === this) {
        this.classList.remove("selected");
        selectedPiece = null;
        return;
    }
    if (selectedPiece !== null) {
        selectedPiece.classList.remove("selected");
    }
    this.classList.add("selected");
    selectedPiece = this;
}

function selectSquare() {
    if (selectedPiece === null) {
        return;
    }
    const row = parseInt(this.dataset.row);
    const col = parseInt(this.dataset.col);
    const pieceRow = parseInt(selectedPiece.dataset.row);
    const pieceCol = parseInt(selectedPiece.dataset.col);
    const distance = Math.abs(row - pieceRow);
    if (distance !== 1 && distance !== 2) {
        return;
    }
    if (distance === 1) {
        if (this.children.length > 0) {
            return;
        }
        if (selectedPiece.classList.contains("king") || selectedPiece.dataset.color === "red") {
            if (row < pieceRow) {
                return;
            }
        }
        if (selectedPiece.classList.contains("king") || selectedPiece.dataset.color === "black") {
            if (row > pieceRow) {
                return;
            }
        }
        const direction = pieceCol < col ? 1 : -1;
        if (col - pieceCol !== direction) {
            return;
        }
        movePiece(selectedPiece, row, col);
    } else {
        const jumpRow = pieceRow + (row - pieceRow) / 2;
        const jumpCol = pieceCol + (col - pieceCol) / 2;
        const jumpSquare = squares[jumpRow * 8 + jumpCol];
        const jumpPiece = jumpSquare.children[0];
        if (jumpPiece === undefined || jumpPiece.dataset.color === selectedPiece.dataset.color) {
            return;
        }
        const direction = pieceCol < col ? 1 : -1;
        if (col - pieceCol !== 2 * direction) {
            return;
        }
        movePiece(selectedPiece, row, col);
        removePiece(jumpPiece);
        const jumps = getJumps(selectedPiece);
        if (jumps.length > 0) {
            selectedPiece.classList.remove("selected");
            selectedPiece = jumps[0];
            selectedPiece.classList.add("selected");
        } else {
            selectedPiece.classList.remove("selected");
            selectedPiece = null;
        }
    }
    if (row === 0 && selectedPiece.dataset.color === "black") {
        selectedPiece.classList.add("king");
    }
    if (row === 7 && selectedPiece.dataset.color === "red") {
        selectedPiece.classList.add("king");
    }
    if (selectedPiece === null || getJumps(selectedPiece).length === 0) {
        const piecesToMove = document.querySelectorAll(".piece." + selectedPiece.dataset.color);
        for (let i = 0; i < piecesToMove.length; i++) {
            piecesToMove[i].classList.remove("highlight");
        }
    } else {
        const jumps = getJumps(selectedPiece);
        for (let i = 0; i < jumps.length; i++) {
            jumps[i].classList.add("highlight");
        }
    }
}

function movePiece(piece, row, col) {
    const square = squares[row * 8 + col];
    square.appendChild(piece);
    piece.dataset.row = row;
    piece.dataset.col = col;
}

function removePiece(piece) {
    const index = pieces.indexOf(piece);
    pieces.splice(index, 1);
    piece.remove();
}

function getJumps(piece) {
    const row = parseInt(piece.dataset.row);
    const col = parseInt(piece.dataset.col);
    const color = piece.dataset.color;
    const jumps = [];
    if (piece.classList.contains("king") || color === "red") {
        if (col > 1 && row > 1) {
            const square = squares[(row - 1) * 8 + col - 2];
            const jumpSquare = squares[(row - 2) * 8 + col - 4];
            const jumpPiece = jumpSquare.children[0];
            if (jumpPiece !== undefined && jumpPiece.dataset.color !== color && square.children.length === 0) {
                jumps.push(piece);
            }
        }
        if (col < 6 && row > 1) {
            const square = squares[(row - 1) * 8 + col + 2];
            const jumpSquare = squares[(row - 2) * 8 + col + 4];
            const jumpPiece = jumpSquare.children[0];
            if (jumpPiece !== undefined && jumpPiece.dataset.color !== color && square.children.length === 0) {
                jumps.push(piece);
            }
        }
    }
    if (piece.classList.contains("king") || color === "black") {
        if (col > 1 && row < 6) {
            const square = squares[(row + 1) * 8 + col - 2];
            const jumpSquare = squares[(row + 2) * 8 + col - 4];
            const jumpPiece = jumpSquare.children[0];
            if (jumpPiece !== undefined && jumpPiece.dataset.color !== color && square.children.length === 0) {
                jumps.push(piece);
            }
        }
        if (col < 6 && row < 6) {
            const square = squares[(row + 1) * 8 + col + 2];
            const jumpSquare = squares[(row + 2) * 8 + col + 4];
            const jumpPiece = jumpSquare.children[0];
            if (jumpPiece !== undefined && jumpPiece.dataset.color !== color && square.children.length === 0) {
                jumps.push(piece);
            }
        }
    }
    return jumps;
}



function checkWin() {
    const redPieces = document.querySelectorAll(".piece[data-color=red]");
    const blackPieces = document.querySelectorAll(".piece[data-color=black]");
    if (redPieces.length === 0) {
        alert("Black wins!");
        initializeGame();
    } else if (blackPieces.length === 0) {
        alert("Red wins!");
        initializeGame();
    }
}

function initializeGame() {
    pieces.forEach((piece) => {
        piece.remove();
    });
    pieces = [];
    for (let i = 0; i < 12; i++) {
        const piece = createPiece("red");
        squares[i].appendChild(piece);
        pieces.push(piece);
    }
    for (let i = 20; i < 32; i++) {
        const piece = createPiece("black");
        squares[i].appendChild(piece);
        pieces.push(piece);
    }
    selectedPiece = null;
    updateTurn();
}

function updateTurn() {
    if (turn === "red") {
        turn = "black";
    } else {
        turn = "red";
    }
    turnDisplay.textContent = turn.charAt(0).toUpperCase() + turn.slice(1) + "'s Turn";
}

function createPiece(color) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.classList.add(color);
    piece.dataset.color = color;
    piece.dataset.row = -1;
    piece.dataset.col = -1;
    piece.addEventListener("click", selectPiece);
    return piece;
}

initializeGame();





