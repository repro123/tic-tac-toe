function Button({ children, className = "", ...props }) {
  return (
    <button
      type="buton"
      className={`rounded-2xl cursor-pointer uppercase ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
