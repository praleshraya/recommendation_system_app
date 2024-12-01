import React, { useState, useEffect, useContext } from 'react';

import './UserDashboard.css';

import Header from './Header';
import Footer from './Footer';
import MovieRow from './MovieRow';
import Pagination from './Pagination';
import { AuthContext } from './AuthContext';


const API_BASE_URL = process.env.REACT_APP_BASE_API_URL;

const UserDashboard = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const [movies, setMovies] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [isNewUser, setIsNewUser] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalMovies, setTotalMovies] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ratings, setRatings] = useState({});

    const moviesPerPage = 10;

    // Fetch Movies for All Users
    const fetchMovies = async (pageNumber = 1, query = '') => {
        setLoading(true);
        setError(null);

        try {
        const skip = (pageNumber - 1) * moviesPerPage;
        const url = new URL(`${API_BASE_URL}/movies`);
        const params = { skip, limit: moviesPerPage };

        if (query) params.search = query;
        Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });

        if (!response.ok) throw new Error('Failed to fetch movies');

        const data = await response.json();
        setMovies(data.movies);
        setTotalMovies(data.total);
        } catch (err) {
        setError('Failed to fetch movies. Please try again.');
        } finally {
        setLoading(false);
        }
    };

  // Fetch Personalized Recommendations
  const fetchRecommendations = async () => {
    setError(null);

    try {
      const url = `${API_BASE_URL}/recommendations/${currentUser.user_id}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });

      if (!response.ok) throw new Error('Failed to fetch recommendations');

      const data = await response.json();
      setRecommendations(data.recommendations);
      setIsNewUser(data.is_new_user);
    } catch (err) {
      console.log(err);
      setError('Failed to fetch recommendations. Please try again.');
      setRecommendations([]);
    }
  };

  // Handle Movie Rating
  const handleRatingClick = async (movieId, ratingValue) => {
    try {
      setRatings((prevRatings) => ({ ...prevRatings, [movieId]: ratingValue }));
      console.log(localStorage.getItem('access_token'));
      const response = await fetch(`${API_BASE_URL}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          user_id: currentUser.user_id,
          movie_id: movieId,
          rating: ratingValue,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit rating');

      alert('Rating submitted successfully!');
    } catch (err) {
      console.log(currentUser);
      alert('Error submitting rating.');
    }
  };

  // Search Handler
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page
  };

  // Pagination Handler
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fetch data when component mounts or pagination changes
  useEffect(() => {
    fetchMovies(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchRecommendations();
  }, [currentUser]);

  return (
    <div className="dashboard">
      <Header handleSearch={handleSearch} handleLogout={logout} user={currentUser} />
      <div className="body-content">
        <div className="wrapper">
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}

          <h2>{isNewUser ? 'Welcome! Top 10 Movies for You' : 'Recommended for You'}</h2>
          <MovieRow
            movies={recommendations}
            ratings={ratings}
            handleRatingClick={handleRatingClick}
          />

          <h2>All Movies</h2>
          <MovieRow
            movies={movies}
            ratings={ratings}
            handleRatingClick={handleRatingClick}
          />
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

export default UserDashboard;
