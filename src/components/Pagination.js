import React from 'react';
import './Pagination.css';

const Pagination = ({ moviesPerPage, totalMovies, currentPage, paginate }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalMovies / moviesPerPage); i++) {
      pageNumbers.push(i);
    }
  
    const maxPageNumbersToShow = 5;
    const startPage = Math.max(currentPage - 2, 1);
    const endPage = Math.min(startPage + maxPageNumbersToShow - 1, pageNumbers.length);
  
    return (
      <nav>
        <ul className="pagination">
          {startPage > 1 && (
            <>
              <li className="page-item">
                <a onClick={() => paginate(1)} href="#!" className="page-link">
                  First
                </a>
              </li>
              <li className="page-item">...</li>
            </>
          )}
          {pageNumbers.slice(startPage - 1, endPage).map((number) => (
            <li
              key={number}
              className={`page-item ${currentPage === number ? 'active' : ''}`}
            >
              <a onClick={() => paginate(number)} href="#!" className="page-link">
                {number}
              </a>
            </li>
          ))}
          {endPage < pageNumbers.length && (
            <>
              <li className="page-item">...</li>
              <li className="page-item">
                <a onClick={() => paginate(pageNumbers.length)} href="#!" className="page-link">
                  Last
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
    );
};

export default Pagination;
