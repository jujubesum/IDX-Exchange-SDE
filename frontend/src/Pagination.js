export function getPageNumbers(currentPage, totalPages){
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // pages we always want: first, last, current, and the neighbors
    const wanted = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
    const sorted = [...wanted]
        .filter((p) => p >= 1 && p <= totalPages)
        .sort((a, b) => a - b);

    const result = [];
    for (let i = 0; i < sorted.length; i++) {
        result.push(sorted[i]);
        if(i < sorted.length - 1){
            if(sorted[i + 1] - sorted[i] === 2){
                result.push(sorted[i] + 1);
            }else if(sorted[i + 1] - sorted[i] > 2){
                result.push("...");
            }
        }
    }

    return result;
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {pages.map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`}>...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}
        <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
        >
            Next
        </button>
    </nav>
  );
}