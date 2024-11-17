import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

const API_BASE_URL = process.env.REACT_APP_BASE_API_URL;

const UserDashboard = ({ handleLogout, accessToken, user }) => {
  const [movies, setMovies] = useState([]);

  const [recommendations, setRecommendations] = useState([]);
  const [isNewUser, setIsNewUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;

  // New state variables for total movies and loading/error states
  const [totalMovies, setTotalMovies] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State to track ratings for each movie
  const [ratings, setRatings] = useState({});

  // Handle rating click
  const handleRatingClick = async (movieId, ratingValue, user) => {
    try {
      // Update the rating state locally
      setRatings((prevRatings) => ({
        ...prevRatings,
        [movieId]: ratingValue,
      }));

      // Make an API call to submit the rating
      const token = localStorage.getItem('access_token');
      console.log(token);
      console.log(user);
      const response = await fetch(`${API_BASE_URL}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.user_id, // Replace with the actual user ID if available in context
          movie_id: movieId,
          rating: ratingValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      alert('Rating submitted successfully!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error submitting rating');
    }
  };
  

  const fetchMovies = async (pageNumber = 1, query = '') => {
    setLoading(true);
    setError(null);
  
    try {
      const skip = (pageNumber - 1) * moviesPerPage;
      const url = new URL(`${API_BASE_URL}/movies`);

      const params = {
        skip: skip,
        limit: moviesPerPage,
      };
      if (query) {
        params.search = query;
      }
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
  
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
  
      const data = await response.json();
      setMovies(data.movies);
      setTotalMovies(data.total);
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchRecommendedMovies = async (user) => {
    setError(null);
  
    try {
      const url = new URL(`${API_BASE_URL}/recommendations/${user.user_id}`);
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch recommended movies');
      }
  
      const data = await response.json();
      setRecommendations(data.recommendations)
      setIsNewUser(data.is_new_user)
      
    } catch (err) {
      setError('Failed to fetch recommended movies. Please try again.');
      console.error(err);
    } 
  };
  

  // Function to handle "Watch" button click
  const handleWatchClick = async (movieId) => {
    try {
      const response = await fetch(`http://localhost:8000/rate-movie`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ movie_id: movieId, rating: 5 }), // Adjust rating value as needed
      });
      
      if (!response.ok) {
        throw new Error('Failed to rate the movie.');
      }

      alert('Movie has been marked as watched!');
    } catch (error) {
      console.error(error);
      alert('Error rating the movie.');
    }
  };

  // Fetch movies when the component mounts or when currentPage changes
  useEffect(() => {
    fetchMovies(currentPage, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery]);

  useEffect(() => {

    fetchRecommendedMovies(user);

  }, [user]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="dashboard">
      <Header handleSearch={handleSearch} handleLogout={handleLogout} user = {user}/>
      <div className="body-content">
        <div className="wrapper">
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          
          <h2>{isNewUser ? 'Welcome! Top 10 Movies for You' : 'Recommended for You'}</h2>
          {/* <MovieRow movies={recommendations} /> */}
          <MovieRow movies={recommendations} ratings = {ratings} handleRatingClick={handleRatingClick} user = {user} />

          <h2>All Movies</h2>
          {/* <MovieRow movies={movies} /> */}
          <MovieRow movies={movies} ratings = {ratings} handleRatingClick={handleRatingClick} user = {user}/>
          <Pagination
            moviesPerPage={moviesPerPage}
            totalMovies={totalMovies}
            currentPage={currentPage}
            paginate={paginate}
        />
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Header component.
const Header = ({ handleSearch, handleLogout, user }) => {
  return (
    <header className="header">
      <div className="wrapper">
        <div className="logo">Movie Recommender</div>
        <div className="search-bar">
          <input type="text" placeholder="Search movies..." onChange={handleSearch} />
        </div>
        <div className="user-icon">
          <img src="/path/to/user-icon.png" alt={user ? user.user_name : "User"} />
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
        </div>
    </header>
  );
};


const MovieRow = ({ movies, ratings, handleRatingClick, user}) => {
  
  return (
    <div className="movie-row">
      {movies.map((movie) => (
        <div key={movie.movie_id} className="movie-item">
          <img
            src={movie.poster || 'https://via.placeholder.com/150'}
            alt={movie.title}
            style={{ width: '150px', height: '150px' }}
          />
          <div className="movie-info">
            <h4>{movie.title}</h4>

            {/* Star Rating Row */}
            <div className="star-rating">
              {[1.0, 2.0, 3.0, 4.0, 5.0].map((star) => (
                <span
                  key={star}
                  className={`star ${ratings[movie.movie_id] >= star ? 'filled' : ''}`}
                  onClick={() => handleRatingClick(movie.movie_id, star, user)}
                  style={{ cursor: 'pointer', color: ratings[movie.movie_id] >= star ? 'gold' : 'gray' }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


// Pagination components
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


// Footer components
const Footer = () => {
  return <footer className="footer"><div className="wrapper">© 2024 Movie Recommender</div></footer>;
};

export default UserDashboard;
