// Get elements
const gameBoard = document.getElementById("game-board");
const statusDisplay = document.getElementById("status");
const resultPopup = document.getElementById("result-popup");
const popupMessage = document.getElementById("popup-message");
const newGameButton = document.getElementById("new-game-button");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // Human is "X"
let gameActive = true;
let isPlayerTurn = true; // Lock to prevent multiple clicks

// Winning combinations
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Initialize game
function initializeGame() {
  gameBoard.innerHTML = "";
  board.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.dataset.index = index;
    cellElement.addEventListener("click", handleCellClick);
    gameBoard.appendChild(cellElement);
  });
  statusDisplay.textContent = "Your turn!";
  resultPopup.style.display = "none"; // Hide the result pop-up initially
  isPlayerTurn = true; // Allow player to start
}

// Handle cell click
function handleCellClick(event) {
  if (!isPlayerTurn || !gameActive) return; // Prevent clicks during AI turn or game end
  const cellIndex = event.target.dataset.index;

  if (board[cellIndex] !== "") return;

  board[cellIndex] = currentPlayer;
  event.target.textContent = currentPlayer; // Display X or O
  event.target.classList.add(currentPlayer); // Add class for styling

  // Add gradient effect for X and O
  event.target.style.background =
    currentPlayer === "X"
      ? "linear-gradient(135deg, #ff77a9, #ff3b64)" // Gradient for X
      : "linear-gradient(135deg, #76c7f7, #3b64ff)"; // Gradient for O

  checkResult();

  if (gameActive) {
    currentPlayer = "O"; // Switch to AI
    isPlayerTurn = false; // Lock player input
    statusDisplay.textContent = "AI's turn...";
    setTimeout(aiMove, 500); // Add delay for AI move
  }
}

// AI move logic
function aiMove() {
  let move;

  // 80% optimal move, 20% random
  if (Math.random() < 0.8) { // Adjusted from 85% to 80%
    move = findBestMove();
  } else {
    move = findRandomMove();
  }

  if (move !== null) {
    board[move] = currentPlayer;
    const aiCell = document.querySelector(`.cell[data-index='${move}']`);
    aiCell.textContent = currentPlayer; // Display O
    aiCell.classList.add(currentPlayer); // Add class for styling

    // Add gradient effect for O
    aiCell.style.background = "linear-gradient(135deg, #76c7f7, #3b64ff)";

    checkResult();
    if (gameActive) {
      currentPlayer = "X"; // Switch back to human
      statusDisplay.textContent = "Your turn!";
      isPlayerTurn = true; // Unlock player input
    }
  }
}

// AI decision-making: Optimal move
function findBestMove() {
  // 1. Check for a winning move
  for (let condition of winningConditions) {
    let [a, b, c] = condition;
    if (board[a] === "O" && board[b] === "O" && board[c] === "") return c;
    if (board[a] === "O" && board[c] === "O" && board[b] === "") return b;
    if (board[b] === "O" && board[c] === "O" && board[a] === "") return a;
  }

  // 2. Check for a blocking move
  for (let condition of winningConditions) {
    let [a, b, c] = condition;
    if (board[a] === "X" && board[b] === "X" && board[c] === "") return c;
    if (board[a] === "X" && board[c] === "X" && board[b] === "") return b;
    if (board[b] === "X" && board[c] === "X" && board[a] === "") return a;
  }

  // 3. Take the center if available
  if (board[4] === "") return 4;

  // 4. Take a random available corner
  let corners = [0, 2, 6, 8].filter((index) => board[index] === "");
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // 5. Take any random available space
  return findRandomMove();
}

// AI decision-making: Random move
function findRandomMove() {
  let availableCells = board
    .map((cell, index) => (cell === "" ? index : null))
    .filter((index) => index !== null);
  if (availableCells.length > 0) {
    return availableCells[Math.floor(Math.random() * availableCells.length)];
  }
  return null;
}

// Check game result
function checkResult() {
  let roundWon = false;

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    if (currentPlayer === "X") {
      popupMessage.textContent = "Player won!";
    } else {
      popupMessage.textContent = "AI won!";
    }
    gameActive = false;
    resultPopup.style.display = "flex"; // Show the result pop-up
    return;
  }

  if (!board.includes("")) {
    popupMessage.textContent = "It's a draw!";
    gameActive = false;
    resultPopup.style.display = "flex"; // Show the result pop-up
    return;
  }
}

// Reset game
function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  initializeGame();
}

// Event listener for new game button
newGameButton.addEventListener("click", resetGame);

// Initialize game on page load
initializeGame();

// Dynamically adjust the height to avoid black bars
function adjustHeight() {
  const gameContainer = document.getElementById("game-container");
  gameContainer.style.height = `${window.innerHeight}px`;
}

// Adjust height on load and resize
window.addEventListener("load", adjustHeight);
window.addEventListener("resize", adjustHeight);

