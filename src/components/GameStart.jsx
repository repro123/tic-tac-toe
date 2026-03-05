import GameHeader from "@/components/GameHeader.jsx";
import GameBoard from "@/components/GameBoard.jsx";
import GameResults from "@/components/GameResults.jsx";

export default function GameStart({
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
  scores,
  playerOneMark,
  playerTwoMark,
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
      <GameResults
        gameMode={gameMode}
        scores={scores}
        playerOneMark={playerOneMark}
        playerTwoMark={playerTwoMark}
      />
    </>
  );
}
