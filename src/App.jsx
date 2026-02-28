import { Xsvg, Osvg } from "@/ui/SVG.jsx";
import Button from "@/ui/Button.jsx";
import Logo from "@/ui/Logo.jsx";
import { useState } from "react";

function App() {
  const [screenToShow, setScreenToShow] = useState("welcome");
  const [selectedMark, setSelectedMark] = useState("X");
  const [gameMode, setGameMode] = useState("");

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

  return (
    <>
      {screenToShow === "welcome" && (
        <WelcomeScreen
          selectedMark={selectedMark}
          onSelectMark={handleSelectMark}
          onSetGameMode={handleGameMode}
        />
      )}

      {screenToShow === "game" && <GameScreen />}
    </>
  );
}

function GameScreen() {
  return <div>Game screen</div>;
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
        className="w-full bg-player-two inset-shadow-player-two px-3 py-6 hover:bg-player-two-opaque"
        onClick={() => onSetGameMode("cpu")}
      >
        new game (vs cpu)
      </Button>
      <Button
        className="w-full bg-player-one inset-shadow-player-one px-3 py-6 hover:bg-player-one-opaque"
        onClick={() => onSetGameMode("player")}
      >
        new game (vs player)
      </Button>
    </div>
  );
}

export default App;
