import Button from "@/ui/Button.jsx";
import { Xsvg, Osvg } from "@/ui/SVG.jsx";
import IconOutlineO from "@/assets/images/icon-o-outline.svg";
import IconOutlineX from "@/assets/images/icon-x-outline.svg";

export default function GameBoard({
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
              className={`size-16 text-player-one ${winningTiles.includes(index) && winnerMark === "X" && "text-slate-800"}`}
            />
          )}
          {tiles[index] === "O" && (
            <Osvg
              className={`size-16 text-player-two ${winningTiles.includes(index) && winnerMark === "O" && "text-slate-800"}`}
            />
          )}
        </Button>
      ))}
    </div>
  );
}
