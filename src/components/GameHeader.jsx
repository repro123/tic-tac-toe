import RestartIcon from "@/assets/images/icon-restart.svg";
import Logo from "@/ui/Logo.jsx";
import { Xsvg, Osvg } from "@/ui/SVG.jsx";
import Button from "@/ui/Button.jsx";

function GameHeader({ handleSetModalType, currentTurn }) {
  return (
    <header className="flex items-center justify-between">
      <Logo />
      <PlayerTurnIndicator currentTurn={currentTurn} />
      <Restart handleSetModalType={handleSetModalType} />
    </header>
  );
}

function PlayerTurnIndicator({ currentTurn }) {
  return (
    <div className="text-slate-300 uppercase bg-slate-800 rounded-2xl p-4 text-preset-5-bold md:text-preset-4 flex items-center gap-2">
      {currentTurn === "X" && <Xsvg className="size-6" />}
      {currentTurn === "O" && <Osvg className="size-6" />} turn
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

export default GameHeader;
