function ResultsPanels({ children, className = "", ...props }) {
  return (
    <div
      className={`flex flex-col items-center uppercase p-2 rounded-2xl gap-1 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default ResultsPanels;
