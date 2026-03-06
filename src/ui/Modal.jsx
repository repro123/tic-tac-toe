import { useRef, useEffect } from "react";
import { Xsvg, Osvg } from "@/ui/SVG.jsx";
import Button from "@/ui/Button.jsx";

function Modal({
  type,
  onClose,
  onReset,
  onNextRound,
  winnerMark,
  handleSetScreen,
  handleSetModalType,
  playerOneMark,
  setCurrentTurn,
  gameMode,
  onResetScores,
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
    onNextRound();
    dialogRef.current.close();
  }

  function handleQuit() {
    onReset();
    onResetScores();
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

      {type === "win" && gameMode === "player" && (
        <>
          <p className="text-preset-5-bold md:text-preset-4">
            player {playerOneMark === winnerMark ? "1" : "2"} wins
          </p>
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

      {type === "win" && gameMode === "cpu" && (
        <>
          <p className="text-preset-5-bold md:text-preset-4">
            {playerOneMark === winnerMark ? "you win!" : "oh no, you lost..."}
          </p>
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

export default Modal;
