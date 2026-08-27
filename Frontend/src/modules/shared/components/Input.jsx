function Input({ label, error = '', ...restProps }) {
  return (
    <div className="flex flex-col h-20">
      <label className="font-medium text-[#5A3E2B]">{label}:</label>

      <input
        {...restProps}
        className={`
          px-3 py-2 rounded-lg border
          focus:outline-none 
          focus:border-[#E8A26A]
          ${error ? 'border-red-400' : 'border-[#D9A37F]/50'}
        `}
      />

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
