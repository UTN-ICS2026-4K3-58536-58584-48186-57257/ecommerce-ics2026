function Card({ children, className }) {
  return (
    <div
      className={`
        bg-white 
        border border-gray-200 
        p-4 
        rounded-xl 
        shadow-sm
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;
