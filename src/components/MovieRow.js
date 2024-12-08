import React, {useState} from 'react';
import './MovieRow.css';

const MovieRow = ({ movies, ratings, handleRatingClick }) => {
  return (
    <div className="movie-row">
      {movies.map((movie) => (
        <div key={movie.movie_id} className="movie-item">
          <img
            src={movie.poster || 'https://m.media-amazon.com/images/M/MV5BZjMyOTFiZmItMDNmYS00NGIyLWE5ZGYtM2QwN2RlZTlhZjJkXkEyXkFqcGc@._V1_QL75_UY562_CR21,0,380,562_.jpg'}
            alt={movie.title}
            style={{ width: '150px', height: '150px' }}
          />
          <div className="movie-info">
            <h4>{movie.title}</h4>
            <StarRating movie={movie} handleRatingClick={handleRatingClick}></StarRating>
          </div>
        </div>
      ))}
    </div>
  );
};

const StarRating = ({ movie, handleRatingClick }) => {
    const [hoveredStar, setHoveredStar] = useState(null);
  
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${movie.rating >= star ? 'filled' : ''}`}
            onMouseEnter={() => setHoveredStar(star)} // Track hovered star
            onMouseLeave={() => setHoveredStar(null)} // Reset hover
            onClick={() => handleRatingClick(movie.movie_id, star)}
            style={{
              cursor: 'pointer',
              color: hoveredStar >= star || movie.rating >= star ? 'yellow' : 'gray', // Dynamic hover color
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  
export default MovieRow;
