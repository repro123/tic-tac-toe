import { Xsvg, Osvg } from "@/ui/SVG.jsx";
import IconOutlineO from "@/assets/images/icon-o-outline.svg";
import IconOutlineX from "@/assets/images/icon-x-outline.svg";

import Button from "@/ui/Button.jsx";
import Logo from "@/ui/Logo.jsx";
import ResultsPanels from "@/ui/ResultPanels.jsx";
import RestartIcon from "@/assets/images/icon-restart.svg";
import { useRef, useState, useEffect } from "react";

function App() {
  const [screenToShow, setScreenToShow] = useState("welcome");
  const [selectedMark, setSelectedMark] = useState("X");
  const [gameMode, setGameMode] = useState("");
  const [tiles, setTiles] = useState(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState("X");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [modalType, setModalType] = useState(null);

  const playerOneMark = selectedMark;
  const playerTwoMark = selectedMark === "X" ? "O" : "X";

  function resetGame() {
    setTiles(Array(9).fill(null));
    setCurrentTurn("X");
  }

  function handleMouseEnter(index) {
    if (tiles[index] === null) {
      setHoveredIndex(index);
      console.log(index);
    }
  }

  function handleMouseLeave() {
    setHoveredIndex(null);
  }

  function handleTileClick(index) {
    const newTiles = [...tiles];
    if (newTiles[index] === null) {
      newTiles[index] = currentTurn;
      setTiles(newTiles);
      setCurrentTurn((e) => (e === "X" ? "O" : "X"));
      setHoveredIndex(null);
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
          />

          {modalType !== null && (
            <Modal
              type={modalType}
              onClose={handleCloseModal}
              onReset={resetGame}
            />
          )}
        </>
      )}
    </>
  );
}

function Modal({ type, onClose, onReset }) {
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
}) {
  return (
    <>
      <GameHeader handleSetModalType={handleSetModalType} />
      <GameBoard
        handleTileClick={handleTileClick}
        tiles={tiles}
        hoveredIndex={hoveredIndex}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        currentTurn={currentTurn}
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

function GameHeader({ handleSetModalType }) {
  return (
    <header className="flex items-center justify-between">
      <Logo />
      <PlayerTurnIndicator />
      <Restart handleSetModalType={handleSetModalType} />
    </header>
  );
}

function PlayerTurnIndicator() {
  return (
    <div className="text-slate-300 uppercase bg-slate-800 rounded-2xl p-4 text-preset-5-bold md:text-preset-4 flex items-center gap-2">
      <Xsvg className="size-6" /> turn
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
}) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <Button
          key={index}
          className={`border bg-slate-800 aspect-square flex items-center justify-center ${tiles[index] ? "cursor-not-allowed" : "cursor-pointer"}`}
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
          {tiles[index] === "X" && <Xsvg className="size-16 text-player-one" />}
          {tiles[index] === "O" && <Osvg className="size-16 text-player-two" />}
        </Button>
      ))}
    </div>
  );
}

function Restart({ handleSetModalType }) {
  return (
    <Button
      aria-label="Restart game"
      className="bg-slate-300 cursor-pointer hover:bg-slate-100 p-4"
      onClick={() => handleSetModalType("restart")}
    >
      <img src={RestartIcon} alt="" />
    </Button>
  );
}

function WelcomeScreen({ selectedMark, onSelectMark, onSetGameMode }) {
  return (
    <>
      <WelcomeHeader />
      <WelcomeScreenMenu
        selectedMark={selectedMark}
        onSelectMark={onSelectMark}
      />
      <WelcomeScreeenButtons onSetGameMode={onSetGameMode} />
    </>
  );
}

function WelcomeHeader() {
  return (
    <header className="flex items-center justify-center">
      <Logo />
    </header>
  );
}

function WelcomeScreenMenu({ selectedMark, onSelectMark }) {
  return (
    <fieldset className="bg-slate-800 text-center flex flex-col gap-4 p-4 rounded-2xl mt-6 text-slate-300 uppercase">
      <legend className="sr-only ">Pick player 1's mark</legend>
      <p className="text-preset-4 ">Pick player 1's mark</p>

      <form className="bg-slate-900 rounded-[10px] p-4 w-full">
        <div className="relative flex">
          <div
            className={`absolute inset-0 w-1/2 bg-slate-300 rounded-lg transition-transform duration-300 ${selectedMark === "O" ? "translate-x-full" : ""}`}
          />

          {["X", "O"].map((mark) => (
            <label
              key={mark}
              className="relative z-10 flex-1 grid place-items-center cursor-pointer py-2 hover:bg-slate-100/10 rounded-lg"
            >
              <span className="sr-only">{mark}</span>
              {mark === "X" ? (
                <Xsvg
                  className={
                    selectedMark === "X"
                      ? "text-slate-900 size-12"
                      : "text-slate-300 size-12"
                  }
                />
              ) : (
                <Osvg
                  className={
                    selectedMark === "O"
                      ? "text-slate-900 size-12"
                      : "text-slate-300 size-12"
                  }
                />
              )}
              <input
                type="radio"
                name="Player1Mark"
                value={mark}
                onChange={onSelectMark}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      </form>

      <p className="text-preset-5-bold">Remember: X goes first</p>
    </fieldset>
  );
}

function WelcomeScreeenButtons({ onSetGameMode }) {
  return (
    <div className="grid gap-4 mt-6 border text-preset-4 md:text-preset-3 text-slate-900 ">
      <Button
        className="w-full bg-player-two inset-shadow-player-two px-3 py-6 hover:bg-player-two-opaque cursor-pointer"
        onClick={() => onSetGameMode("cpu")}
      >
        new game (vs cpu)
      </Button>
      <Button
        className="w-full bg-player-one inset-shadow-player-one px-3 py-6 hover:bg-player-one-opaque cursor-pointer"
        onClick={() => onSetGameMode("player")}
      >
        new game (vs player)
      </Button>
    </div>
  );
}

export default App;
