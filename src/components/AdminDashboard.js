import React, { useState, useEffect, useContext } from 'react';
import './AdminDashboard.css';

import Header from './Header';
import Pagination from './Pagination';
import { AuthContext } from './AuthContext';


const AdminDashboard = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;

  // New state variables for total movies and loading/error states
  const [totalMovies, setTotalMovies] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    release_year: '',
    director: '',
    duration_min: '',
    poster: ''
  });

  const API_URL = process.env.REACT_APP_BASE_API_URL;

  const fetchMovies = async (pageNumber = 1, query = '') => {
    setLoading(true);
    setError(null);
  
    try {
      const skip = (pageNumber - 1) * moviesPerPage;
      const url = new URL(`${API_URL}/movies`);

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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
 
  // Fetch movies when the component mounts or when currentPage changes
  useEffect(() => {
    fetchMovies(currentPage, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery]);


  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add a new movie
  const handleAddMovie = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/movies/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchMovies();
        setIsAdding(false);
        setFormData({ title: '', genre: '', release_year: '', director: '', duration_min: '', poster: '' });
      } else {
        console.error('Error adding movie');
      }
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  // Edit an existing movie
  const handleEditMovie = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/movies/${selectedMovie.movie_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchMovies();
        setIsEditing(false);
        setSelectedMovie(null);
        setFormData({ title: '', genre: '', release_year: '', director: '', duration_min: '', poster: '' });
      } else {
        console.error('Error updating movie');
      }
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };

  // Delete a movie
  const handleDeleteMovie = async (movieId) => {
    try {
      const response = await fetch(`${API_URL}/admin/movies/${movieId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (response.ok) {
        fetchMovies();
      } else {
        console.error('Error deleting movie');
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Header handleSearch={handleSearch} handleLogout={logout} user = {currentUser}/>
      <div className="admin-dashboard"></div>
      <button onClick={() => setIsAdding(true)}>Add New Movie</button>
      {isAdding && (
        <div className="movie-form">
          <h2>Add Movie</h2>
          <form>
            <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
            <input type="text" name="genre" placeholder="Genre" value={formData.genre} onChange={handleChange} />
            <input type="number" name="release_year" placeholder="Release Year" value={formData.release_year} onChange={handleChange} />
            <input type="text" name="director" placeholder="Director" value={formData.director} onChange={handleChange} />
            <input type="number" name="duration_min" placeholder="Duration (min)" value={formData.duration_min} onChange={handleChange} />
            <input type="text" name="poster" placeholder="Poster URL" value={formData.poster} onChange={handleChange} />
            <button type="button" onClick={handleAddMovie}>Add Movie</button>
            <button type="button" onClick={() => setIsAdding(false)}>Cancel</button>
          </form>
        </div>
      )}

      {isEditing && (
        <div className="movie-form">
          <h2>Edit Movie</h2>
          <form>
            <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
            <input type="text" name="genre" placeholder="Genre" value={formData.genre} onChange={handleChange} />
            <input type="number" name="release_year" placeholder="Release Year" value={formData.release_year} onChange={handleChange} />
            <input type="text" name="director" placeholder="Director" value={formData.director} onChange={handleChange} />
            <input type="number" name="duration_min" placeholder="Duration (min)" value={formData.duration_min} onChange={handleChange} />
            <input type="text" name="poster" placeholder="Poster URL" value={formData.poster} onChange={handleChange} />
            <button type="button" onClick={handleEditMovie}>Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        </div>
      )}

      <div className="movie-list">
        <h2>All Movies</h2>
        <ul>
          {movies.map((movie) => (
            <li key={movie.movie_id}>
              <span>{movie.title} ({movie.release_year})</span>
              <button onClick={() => {
                setIsEditing(true);
                setSelectedMovie(movie);
                setFormData(movie);
              }}>Edit</button>
              <button onClick={() => handleDeleteMovie(movie.movie_id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <Pagination
            moviesPerPage={moviesPerPage}
            totalMovies={totalMovies}
            currentPage={currentPage}
            paginate={paginate}
        />
    </div>
  );
};


export default AdminDashboard;
