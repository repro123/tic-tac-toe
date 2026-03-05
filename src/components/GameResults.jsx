import ResultsPanels from "@/ui/ResultPanels.jsx";
function GameResults({ scores, playerOneMark, playerTwoMark, gameMode }) {
  const panels = [
    {
      label: `${playerOneMark} (${gameMode === "cpu" ? "YOU" : "P1"})`,
      score: scores[playerOneMark],
      className: "bg-player-one",
    },
    {
      label: "TIES",
      score: scores.draw,
      className: "bg-slate-300",
    },
    {
      label: `${playerTwoMark} (${gameMode === "cpu" ? "CPU" : "P2"})`,
      score: scores[playerTwoMark],
      className: "bg-player-two",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {panels.map((panel, i) => (
        <ResultsPanels key={i} className={panel.className}>
          <span>{panel.label}</span>
          <span>{panel.score}</span>
        </ResultsPanels>
      ))}
    </div>
  );
}

export default GameResults;
