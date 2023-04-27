// Define the game divs
const ticTacToe = document.getElementById("tic-tac-toe");
const connect4 = document.getElementById("connect-4");
const checkers = document.getElementById("checkers");
const chess = document.getElementById("chess");
const sudoku = document.getElementById("sudoku");
const eightQueens = document.getElementById("eight-queens");

// Add event listeners to each game div
ticTacToe.addEventListener("click", () => {
  window.location.href = "tic-tac-toe.html";
});

connect4.addEventListener("click", () => {
  window.location.href = "connect-4.html";
});

checkers.addEventListener("click", () => {
  window.location.href = "checkers.html";
});

chess.addEventListener("click", () => {
  window.location.href = "chess.html";
});

sudoku.addEventListener("click", () => {
  window.location.href = "sudoku.html";
});

eightQueens.addEventListener("click", () => {
  window.location.href = "eight-queens.html";
});
