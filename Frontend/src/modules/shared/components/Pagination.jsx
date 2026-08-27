const ORANGE = '#F3C9A7';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8 select-none">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-500 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        Anterior
      </button>

      <div className="flex gap-2">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm shadow-sm transition-all
              ${
          page === currentPage
            ? 'text-white shadow-md transform scale-105'
            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }
            `}
            style={page === currentPage ? { backgroundColor: ORANGE, borderColor: ORANGE } : {}}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-500 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        Siguiente
      </button>
    </div>
  );
}

export default Pagination;