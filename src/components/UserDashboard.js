import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

const UserDashboard = ({ isNewUser, handleLogout }) => {
  const [movies, setMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;

  // Dummy movie data // Fetch all movies data using API. 
  const allMovies = [
    { id: 1, title: 'Inception', poster: 'https://via.placeholder.com/150' },
    { id: 2, title: 'Interstellar', poster: 'https://via.placeholder.com/150' },
    { id: 3, title: 'The Dark Knight', poster: 'https://via.placeholder.com/150' },
    { id: 4, title: 'Fight Club', poster: 'https://via.placeholder.com/150' },
    { id: 5, title: 'The Matrix', poster: 'https://via.placeholder.com/150' },
    { id: 6, title: 'Forrest Gump', poster: 'https://via.placeholder.com/150' },
    { id: 7, title: 'The Social Network', poster: 'https://via.placeholder.com/150' },
    { id: 8, title: 'Gladiator', poster: 'https://via.placeholder.com/150' },
    { id: 9, title: 'The Godfather', poster: 'https://via.placeholder.com/150' },
    { id: 10, title: 'Shawshank Redemption', poster: 'https://via.placeholder.com/150' },
    { id: 11, title: 'Pulp Fiction', poster: 'https://via.placeholder.com/150' },
    { id: 12, title: 'Titanic', poster: 'https://via.placeholder.com/150' },
  ];

  useEffect(() => {
    setMovies(allMovies); // Fetch all movies data using API. 

    const top10Movies = allMovies.slice(0, 10); // top 10 recommended movied for that user id using API
    const similarMovies = allMovies.slice(10, 20); // pull movies from separate REST API.
    if (isNewUser) {
      setRecommendations(top10Movies);
    } else {
      setRecommendations(similarMovies);
    }
  }, [isNewUser]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredMovies = allMovies.filter((movie) =>
      movie.title.toLowerCase().includes(query)
    );
    setMovies(filteredMovies);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  return (
    <div className="dashboard">
      <Header handleSearch={handleSearch} handleLogout={handleLogout} />
      <div className="body-content">
        <div className="wrapper">
          <h2>{isNewUser ? 'Welcome! Top 10 Movies for You' : 'Recommended for You'}</h2>
          <MovieRow movies={recommendations} />
          <h2>All Movies</h2>
          <MovieRow movies={currentMovies} />
          <Pagination
            moviesPerPage={moviesPerPage}
            totalMovies={movies.length}
            paginate={paginate}
        />
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Header component.
const Header = ({ handleSearch, handleLogout }) => {
  return (
    <header className="header">
      <div className="wrapper">
        <div className="logo">Movie Recommender</div>
        <div className="search-bar">
          <input type="text" placeholder="Search movies..." onChange={handleSearch} />
        </div>
        <div className="user-icon">
          <img src="/path/to/user-icon.png" alt="User" />
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
        </div>
    </header>
  );
};

// Movie Components
const MovieRow = ({ movies }) => {
  return (
    <div className="movie-row">
      {movies.map((movie, index) => (
        <div key={index} className="movie-item">
          <img src={movie.poster} alt={movie.title} />
          <h4>{movie.title}</h4>
        </div>
      ))}
    </div>
  );
};

// Pagination components
const Pagination = ({ moviesPerPage, totalMovies, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalMovies / moviesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a onClick={() => paginate(number)} href="!#" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};


// Footer components
const Footer = () => {
  return <footer className="footer"><div className="wrapper">© 2024 Movie Recommender</div></footer>;
};

export default UserDashboard;
