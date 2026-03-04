import { Xsvg, Osvg } from "@/ui/SVG.jsx";
import IconOutlineO from "@/assets/images/icon-o-outline.svg";
import IconOutlineX from "@/assets/images/icon-x-outline.svg";
import GameHeader from "@/components/GameHeader.jsx";
import WelcomeScreen from "@/components/WelcomeScreen.jsx";

import Button from "@/ui/Button.jsx";

import ResultsPanels from "@/ui/ResultPanels.jsx";

import { useRef, useState, useEffect } from "react";

function App() {
  const [screenToShow, setScreenToShow] = useState("welcome");
  const [selectedMark, setSelectedMark] = useState("X");
  const [gameMode, setGameMode] = useState("");
  const [tiles, setTiles] = useState(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState("X");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winningTiles, setWinningTiles] = useState([]);
  const [winnerMark, setWinnerMark] = useState(null);

  const playerOneMark = selectedMark;
  const playerTwoMark = selectedMark === "X" ? "O" : "X";

  function resetGame() {
    setTiles(Array(9).fill(null));
    setCurrentTurn("X");
    setWinnerMark(null);
    setWinningTiles([]);
    setGameOver(false);
  }

  function handleMouseEnter(index) {
    if (gameOver) return;
    if (tiles[index] === null) {
      setHoveredIndex(index);
      console.log(index);
    }
  }

  function handleMouseLeave() {
    setHoveredIndex(null);
  }

  function handleTileClick(index) {
    if (gameOver) return;
    setHoveredIndex(null);
    const newTiles = [...tiles];
    if (newTiles[index] === null) {
      newTiles[index] = currentTurn;
      setTiles(newTiles);
      if (checkWinner(newTiles)) {
        setTimeout(() => {
          setModalType("win");
        }, 1000);
        setGameOver(true);
      } else if (newTiles.every((t) => t !== null)) {
        setModalType("draw");
        setGameOver(true);
      } else {
        setCurrentTurn((e) => (e === "X" ? "O" : "X"));
      }
    }
  }

  function handleSetScreen(screen) {
    setScreenToShow(screen);
  }

  function handleGameMode(mode) {
    setGameMode(mode);
    setScreenToShow("game");
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
          />

          {modalType !== null && (
            <Modal
              type={modalType}
              onClose={handleCloseModal}
              onReset={resetGame}
              winnerMark={winnerMark}
              handleSetScreen={handleSetScreen}
              handleSetModalType={handleSetModalType}
            />
          )}
        </>
      )}
    </>
  );
}

function Modal({
  type,
  onClose,
  onReset,
  winnerMark,
  handleSetScreen,
  handleSetModalType,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    dialog.showModal();

    function handleClose() {
      onClose();
    }

    dialog.addEventListener("close", handleClose);

    return () => {
      dialog.removeEventListener("close", handleClose);
    };
  }, [onClose]);

  function handleConfirm() {
    onReset();
    dialogRef.current.close();
  }

  function handleQuit() {
    onReset();
    dialogRef.current.close();
    handleSetScreen("welcome");
    handleSetModalType(null);
  }

  return (
    <dialog
      ref={dialogRef}
      className=" top-1/2 -translate-y-1/2 left-0 min-w-screen backdrop:bg-neutral-950/40 backdrop-blur-2xl flex flex-col gap-6 py-12 items-center justify-center bg-slate-800 text-slate-300 uppercase"
    >
      {type === "restart" && (
        <>
          <p className="text-preset-2 md:text-preset-1">restart game?</p>
          <div className="text-slate-900 flex items-center gap-2">
            <Button
              className="bg-slate-300 cursor-pointer text-preset-4 p-4 hover:bg-slate-100"
              onClick={() => dialogRef.current.close()}
            >
              No, cancel
            </Button>
            <Button
              className="bg-player-two cursor-pointer text-preset-4 p-4 hover:bg-player-two-opaque"
              onClick={handleConfirm}
            >
              Yes, restart
            </Button>
          </div>
        </>
      )}

      {type === "win" && (
        <>
          <p className="text-preset-5-bold md:text-preset-4">player xxx wins</p>
          <p
            className={`text-preset-2 md:text-preset-1 ${winnerMark === "X" ? "text-player-one" : "text-player-two"} flex gap-4 items-center`}
          >
            {winnerMark === "X" ? (
              <Xsvg className="text-player-one size-12" />
            ) : (
              <Osvg className="text-player-two size-12" />
            )}{" "}
            <span>takes the round</span>
          </p>
          <div className="text-slate-900 flex items-center gap-2">
            <Button
              className="bg-slate-300 cursor-pointer text-preset-4 p-4 hover:bg-slate-100"
              onClick={handleQuit}
            >
              quit
            </Button>
            <Button
              className="bg-player-two cursor-pointer text-preset-4 p-4 hover:bg-player-two-opaque"
              onClick={handleConfirm}
            >
              next round
            </Button>
          </div>
        </>
      )}

      {type === "draw" && (
        <>
          <p className="text-preset-2 md:text-preset-1">round tied</p>
          <div className="text-slate-900 flex items-center gap-2">
            <Button
              className="bg-slate-300 cursor-pointer text-preset-4 p-4 hover:bg-slate-100"
              onClick={handleQuit}
            >
              Quit
            </Button>
            <Button
              className="bg-player-two cursor-pointer text-preset-4 p-4 hover:bg-player-two-opaque"
              onClick={handleConfirm}
            >
              Next round
            </Button>
          </div>
        </>
      )}
    </dialog>
  );
}

function GameStart({
  gameMode,
  handleTileClick,
  tiles,
  handleMouseEnter,
  handleMouseLeave,
  hoveredIndex,
  currentTurn,
  handleSetModalType,
  winningTiles,
  winnerMark,
}) {
  return (
    <>
      <GameHeader
        handleSetModalType={handleSetModalType}
        currentTurn={currentTurn}
      />
      <GameBoard
        handleTileClick={handleTileClick}
        tiles={tiles}
        hoveredIndex={hoveredIndex}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        currentTurn={currentTurn}
        winningTiles={winningTiles}
        winnerMark={winnerMark}
      />
      <GameResults gameMode={gameMode} />
    </>
  );
}

function GameResults({ gameMode }) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <ResultsPanels
          key={i}
          className={
            i === 0
              ? "bg-player-one"
              : i === 1
                ? "bg-slate-300"
                : "bg-player-two"
          }
        >
          {gameMode === "cpu" && i === 0 && <span>x (you)</span>}
          {gameMode === "cpu" && i === 1 && <span>ties</span>}
          {gameMode === "cpu" && i === 2 && <span>o (cpu)</span>}
          {gameMode === "player" && i === 0 && <span>x (p1)</span>}
          {gameMode === "player" && i === 1 && <span>ties</span>}
          {gameMode === "player" && i === 2 && <span>o (p2)</span>}

          <span>0</span>
        </ResultsPanels>
      ))}
    </div>
  );
}

function GameBoard({
  handleTileClick,
  tiles,
  handleMouseEnter,
  handleMouseLeave,
  hoveredIndex,
  currentTurn,
  winningTiles,
  winnerMark,
}) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <Button
          key={index}
          className={`border  aspect-square flex items-center justify-center ${tiles[index] ? "cursor-not-allowed" : "cursor-pointer"} ${winningTiles.includes(index) && winnerMark === "X" ? "bg-player-one" : winningTiles.includes(index) && winnerMark === "O" ? "bg-player-two" : "bg-slate-800"}`}
          onClick={() => handleTileClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave()}
        >
          {hoveredIndex !== null && hoveredIndex === index && (
            <img
              src={currentTurn === "X" ? IconOutlineX : IconOutlineO}
              alt=""
            />
          )}
          {tiles[index] === "X" && (
            <Xsvg
              className={`size-16 text-player-one ${winnerMark === "X" && "text-slate-800"}`}
            />
          )}
          {tiles[index] === "O" && (
            <Osvg
              className={`size-16 text-player-two ${winnerMark === "O" && "text-slate-800"}`}
            />
          )}
        </Button>
      ))}
    </div>
  );
}

export default App;
