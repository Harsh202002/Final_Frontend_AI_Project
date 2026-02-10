import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {

  const getPageWindow = () => {
    const windowStart = Math.floor((currentPage - 1) / 5) * 5 + 1;
    const windowEnd = Math.min(windowStart + 4, totalPages);

    const pages = [];
    for (let i = windowStart; i <= windowEnd; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageWindow();
  const windowStart = pageNumbers[0];
  const windowEnd = pageNumbers[pageNumbers.length - 1];

  const handlePrevFive = () => {
    const newStart = Math.max(1, windowStart - 5);
    onPageChange(newStart);
  };

  const handleNextFive = () => {
    const newStart = windowEnd + 1;
    if (newStart <= totalPages) {
      onPageChange(newStart);
    }
  };

  const handlePrevOne = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextOne = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center mt-6 space-x-1 mb-2">
      <button
        onClick={handlePrevFive}
        disabled={windowStart === 1}
        className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
      >
        &lt;&lt;
      </button>

      <button
        onClick={handlePrevOne}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &lt;
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-full transition-colors ${currentPage === page
              ? "bg-purple-600 text-white"
              : "hover:bg-gray-100"
            }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={handleNextOne}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &gt;
      </button>

      <button
        onClick={handleNextFive}
        disabled={windowEnd >= totalPages}
        className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
      >
        &gt;&gt;
      </button>
    </div>
  );
}

export default Pagination;