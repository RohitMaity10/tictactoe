let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;

let scores = {
  X: 0,
  O: 0,
  ties: 0,
};

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// DOM elements
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart-btn");
const resetScoreBtn = document.getElementById("reset-score-btn");
const scoreXEl = document.getElementById("score-x");
const scoreOEl = document.getElementById("score-o");
const scoreTiesEl = document.getElementById("score-ties");
const cardX = document.getElementById("card-x");
const cardO = document.getElementById("card-o");

function handleCellClick(e) {
  const cell = e.target;
  const index = parseInt(cell.getAttribute("data-index"));

  if (boardState[index] !== "" || !isGameActive) {
    return;
  }

  // Update board
  boardState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("taken", currentPlayer.toLowerCase());

  checkResult();
}

function checkResult() {
  let roundWon = false;
  let winningCombo = [];

  for (let combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      roundWon = true;
      winningCombo = combo;
      break;
    }
  }

  if (roundWon) {
    statusText.innerHTML = `🎉 <span class="highlight">Player ${currentPlayer} Wins!</span>`;
    winningCombo.forEach(idx => cells[idx].classList.add("winning"));
    scores[currentPlayer]++;
    updateScoreboard();
    isGameActive = false;
    return;
  }

  // Check for Tie
  if (!boardState.includes("")) {
    statusText.textContent = "It's a draw!";
    scores.ties++;
    updateScoreboard();
    isGameActive = false;
    return;
  }

  // Switch player turn
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTurnDisplay();
}

function updateTurnDisplay() {
  statusText.innerHTML = `Turn: <span class="highlight">Player ${currentPlayer}</span>`;
  if (currentPlayer === "X") {
    cardX.classList.add("active");
    cardO.classList.remove("active");
  } else {
    cardO.classList.add("active");
    cardX.classList.remove("active");
  }
}

function updateScoreboard() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreTiesEl.textContent = scores.ties;
}

function restartGame() {
  boardState = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  isGameActive = true;
  cells.forEach(cell => {
    cell.textContent = "";
    cell.className = "cell";
  });
  updateTurnDisplay();
}

function resetScores() {
  scores = { X: 0, O: 0, ties: 0 };
  updateScoreboard();
  restartGame();
}

// Event Listeners
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
restartBtn.addEventListener("click", restartGame);
resetScoreBtn.addEventListener("click", resetScores);