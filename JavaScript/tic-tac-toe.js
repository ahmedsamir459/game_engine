const squares = document.querySelectorAll('.square');
let currentPlayer = 'X';
let gameEnded = false;

function handleMove(square, index) {
  if (gameEnded) return;

  if (square.textContent !== '') {
    alert('This square is already taken!');
    return;
  }

  square.textContent = currentPlayer;

  if (checkForWin()) {
    gameEnded = true;
    alert(`${currentPlayer} wins!`);
    return;
  }

  if (checkForTie()) {
    gameEnded = true;
    alert('It\'s a tie!');
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkForWin() {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  return winningCombos.some(combo => {
    return combo.every(index => {
      return squares[index].textContent === currentPlayer;
    });
  });
}

function checkForTie() {
  return [...squares].every(square => {
    return square.textContent !== '';
  });
}

squares.forEach((square, index) => {
  square.addEventListener('click', () => {
    handleMove(square, index);
  });
});
