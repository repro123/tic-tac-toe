import GameStart from "@/components/GameStart.jsx";
import WelcomeScreen from "@/components/WelcomeScreen.jsx";
import Modal from "@/ui/Modal.jsx";
import { useState, useEffect } from "react";

const STORAGE_KEY = "tic-tac-toe-state";

function App() {
  const savedGame = localStorage.getItem("tic-tac-toe-state");
  const parsedGame = savedGame ? JSON.parse(savedGame) : null;

  const [screenToShow, setScreenToShow] = useState(() => {
    return window.location.pathname === "/game" ? "game" : "welcome";
  });
  const [selectedMark, setSelectedMark] = useState(
    parsedGame?.selectedMark ?? "X",
  );
  const [gameMode, setGameMode] = useState(parsedGame?.gameMode ?? "");
  const [tiles, setTiles] = useState(parsedGame?.tiles ?? Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState(
    parsedGame?.currentTurn ?? "X",
  );
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [gameOver, setGameOver] = useState(parsedGame?.gameOver ?? false);
  const [winningTiles, setWinningTiles] = useState(
    parsedGame?.winningTiles ?? [],
  );
  const [winnerMark, setWinnerMark] = useState(parsedGame?.winnerMark ?? null);
  const [scores, setScores] = useState(
    parsedGame?.scores ?? {
      X: 0,
      draw: 0,
      O: 0,
    },
  );
  const [startingMark, setStartingMark] = useState("X");

  useEffect(() => {
    function handlePopState() {
      const path = window.location.pathname;

      if (path === "/game") {
        setScreenToShow("game");
      } else {
        setScreenToShow("welcome");
      }
    }

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const data = {
      tiles,
      currentTurn,
      scores,
      selectedMark,
      gameMode,
      gameOver,
      winnerMark,
      winningTiles,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [
    tiles,
    currentTurn,
    scores,
    selectedMark,
    gameMode,
    gameOver,
    winnerMark,
    winningTiles,
  ]);

  const playerOneMark = selectedMark;
  const playerTwoMark = selectedMark === "X" ? "O" : "X";

  function resetGame() {
    setTiles(Array(9).fill(null));
    setCurrentTurn(startingMark);
    setWinnerMark(null);
    setWinningTiles([]);
    setGameOver(false);
    localStorage.removeItem(STORAGE_KEY);
  }

  function nextRound() {
    setStartingMark((prev) => (prev === "X" ? "O" : "X"));
    setTiles(Array(9).fill(null));
    setWinnerMark(null);
    setWinningTiles([]);
    setGameOver(false);

    setCurrentTurn((prev) => (prev === "X" ? "O" : "X"));
  }

  function resetScores() {
    setScores({
      X: 0,
      draw: 0,
      O: 0,
    });
  }

  function handleMouseEnter(index) {
    if (gameOver) return;

    if (gameMode === "cpu" && currentTurn === playerTwoMark) return;

    if (tiles[index] === null) {
      setHoveredIndex(index);
    }
  }

  function handleMouseLeave() {
    setHoveredIndex(null);
  }

  function handleTileClick(index) {
    if (gameOver) return;
    if (gameMode === "cpu" && currentTurn === playerTwoMark) return;
    setHoveredIndex(null);
    const newTiles = [...tiles];
    if (newTiles[index] === null) {
      newTiles[index] = currentTurn;
      setTiles(newTiles);

      const winner = checkWinner(newTiles);

      if (winner) {
        setTimeout(() => {
          setModalType("win");
        }, 1000);

        setScores((prev) => ({
          ...prev,
          [winner]: prev[winner] + 1,
        }));
        setGameOver(true);
      } else if (newTiles.every((t) => t !== null)) {
        setModalType("draw");

        setScores((prev) => ({ ...prev, draw: prev.draw + 1 }));
        setGameOver(true);
      } else {
        setCurrentTurn((e) => (e === "X" ? "O" : "X"));
      }
    }
  }

  function handleSetScreen(screen) {
    setScreenToShow(screen);

    const path = screen === "welcome" ? "/" : "/game";
    history.pushState({ screen }, "", path);
  }

  function handleGameMode(mode) {
    setGameMode(mode);
    setScreenToShow("game");

    history.pushState({ screen: "game" }, "", "/game");
  }

  function handleSelectMark() {
    setSelectedMark((prev) => (prev === "X" ? "O" : "X"));
  }

  function checkWinner(board) {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;

      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinningTiles(pattern);
        setWinnerMark(board[a]);

        return board[a];
      }
    }

    return null;
  }

  function handleSetModalType(type) {
    setModalType(type);
  }

  function handleCloseModal() {
    setModalType(null);
  }

  function getAvailableMoves(board) {
    return board
      .map((v, i) => (v === null ? i : null))
      .filter((v) => v !== null);
  }

  function checkWinnerStatic(board) {
    const patterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let [a, b, c] of patterns) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  // minimax AI
  function minimax(board, isMaximizing) {
    const cpuMark = playerTwoMark;
    const humanMark = playerOneMark;

    const winner = checkWinnerStatic(board);

    if (winner === cpuMark) return { score: 10 };
    if (winner === humanMark) return { score: -10 };
    if (board.every((t) => t !== null)) return { score: 0 };

    const moves = [];

    for (let index of getAvailableMoves(board)) {
      const newBoard = [...board];
      newBoard[index] = isMaximizing ? cpuMark : humanMark;

      const result = minimax(newBoard, !isMaximizing);

      moves.push({
        index,
        score: result.score,
      });
    }

    if (isMaximizing) {
      return moves.reduce((best, move) =>
        move.score > best.score ? move : best,
      );
    } else {
      return moves.reduce((best, move) =>
        move.score < best.score ? move : best,
      );
    }
  }

  // choose best move
  function getBestMove(board) {
    return minimax(board, true).index;
  }

  function handleCpuMove() {
    const bestMove = getBestMove(tiles);

    const newTiles = [...tiles];
    newTiles[bestMove] = playerTwoMark;
    setTiles(newTiles);

    const winner = checkWinner(newTiles);

    if (winner) {
      setTimeout(() => setModalType("win"), 1000);

      setScores((prev) => ({
        ...prev,
        [winner]: prev[winner] + 1,
      }));

      setGameOver(true);
    } else if (newTiles.every((t) => t !== null)) {
      setModalType("draw");
      setScores((prev) => ({ ...prev, draw: prev.draw + 1 }));
      setGameOver(true);
    } else {
      setCurrentTurn(playerOneMark);
    }
  }

  useEffect(() => {
    if (gameMode !== "cpu") return;
    if (gameOver) return;
    if (currentTurn !== playerTwoMark) return;

    const timer = setTimeout(() => {
      handleCpuMove();
    }, 500);

    return () => clearTimeout(timer);
  }, [tiles, currentTurn, gameMode, gameOver, screenToShow]);

  return (
    <>
      {screenToShow === "welcome" && (
        <WelcomeScreen
          selectedMark={selectedMark}
          onSelectMark={handleSelectMark}
          onSetGameMode={handleGameMode}
        />
      )}

      {screenToShow === "game" && (
        <>
          <GameStart
            gameMode={gameMode}
            handleTileClick={handleTileClick}
            tiles={tiles}
            hoveredIndex={hoveredIndex}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            currentTurn={currentTurn}
            handleSetModalType={handleSetModalType}
            winningTiles={winningTiles}
            winnerMark={winnerMark}
            scores={scores}
            playerOneMark={playerOneMark}
            playerTwoMark={playerTwoMark}
          />

          {modalType !== null && (
            <Modal
              type={modalType}
              onClose={handleCloseModal}
              onReset={resetGame}
              onResetScores={resetScores}
              onNextRound={nextRound}
              winnerMark={winnerMark}
              handleSetScreen={handleSetScreen}
              handleSetModalType={handleSetModalType}
              playerOneMark={playerOneMark}
              setCurrentTurn={setCurrentTurn}
              gameMode={gameMode}
            />
          )}
        </>
      )}
    </>
  );
}

export default App;
