function Button({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  ...restProps
}) {
  const styles = {
    primary: `
      bg-[#fff1e5ff]
      text-[#D88A45]
      font-medium
      rounded-lg
      px-4 py-2
      border border-[#e4b89bff]
      hover:bg-[#E3B894]
      transition-all
      shadow-sm
    `,
    secondary: `
      bg-white
      text-[#5A3E2B]
      border border-[#D9A37F]
      rounded-lg
      px-4 py-2
      hover:bg-[#F2C7A6]
      transition-all
    `,
  };

  return (
    <button
      type={type}
      {...restProps}
      className={`${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
