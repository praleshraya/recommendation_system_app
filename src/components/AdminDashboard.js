import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const API_BASE_URL = process.env.REACT_APP_BASE_API_URL;

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({ title: '', genre: '', release_year: '', director: '', duration_min: '', poster: '' });
  const [editMovie, setEditMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 5;

  useEffect(() => {
    fetchMovies();
  }, [currentPage]);

  const fetchMovies = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${API_BASE_URL}/movies?skip=${(currentPage - 1) * moviesPerPage}&limit=${moviesPerPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMovies(data);
      } else {
        console.error('Failed to fetch movies');
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleInputChange = (e, type = 'new') => {
    const { name, value } = e.target;
    if (type === 'new') {
      setNewMovie({ ...newMovie, [name]: value });
    } else {
      setEditMovie({ ...editMovie, [name]: value });
    }
  };

  const handleAddMovie = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/movies/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMovie),
      });

      if (response.ok) {
        fetchMovies();
        setNewMovie({ title: '', genre: '', release_year: '', director: '', duration_min: '', poster: '' });
      } else {
        console.error('Failed to add movie');
      }
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  const handleUpdateMovie = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/movies/${editMovie.movie_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editMovie),
      });

      if (response.ok) {
        fetchMovies();
        setEditMovie(null);
      } else {
        console.error('Failed to update movie');
      }
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };

  const handleDeleteMovie = async (movie_id) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/movies/${movie_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchMovies();
      } else {
        console.error('Failed to delete movie');
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Add New Movie Button */}
      <div className="add-movie-button">
        <button onClick={() => setEditMovie(null)}>Add New Movie</button>
      </div>

      {/* Add/Edit Movie Form */}
      {editMovie ? (
        <div className="movie-form">
          <h2>Edit Movie</h2>
          <input type="text" name="title" placeholder="Title" value={editMovie.title} onChange={(e) => handleInputChange(e, 'edit')} />
          <input type="text" name="genre" placeholder="Genre" value={editMovie.genre} onChange={(e) => handleInputChange(e, 'edit')} />
          <input type="number" name="release_year" placeholder="Release Year" value={editMovie.release_year} onChange={(e) => handleInputChange(e, 'edit')} />
          <input type="text" name="director" placeholder="Director" value={editMovie.director} onChange={(e) => handleInputChange(e, 'edit')} />
          <input type="number" name="duration_min" placeholder="Duration (min)" value={editMovie.duration_min} onChange={(e) => handleInputChange(e, 'edit')} />
          <input type="text" name="poster" placeholder="Poster URL" value={editMovie.poster} onChange={(e) => handleInputChange(e, 'edit')} />
          <button onClick={handleUpdateMovie}>Update Movie</button>
          <button onClick={() => setEditMovie(null)}>Cancel</button>
        </div>
      ) : (
        <div className="movie-form">
          <h2>Add New Movie</h2>
          <input type="text" name="title" placeholder="Title" value={newMovie.title} onChange={handleInputChange} />
          <input type="text" name="genre" placeholder="Genre" value={newMovie.genre} onChange={handleInputChange} />
          <input type="number" name="release_year" placeholder="Release Year" value={newMovie.release_year} onChange={handleInputChange} />
          <input type="text" name="director" placeholder="Director" value={newMovie.director} onChange={handleInputChange} />
          <input type="number" name="duration_min" placeholder="Duration (min)" value={newMovie.duration_min} onChange={handleInputChange} />
          <input type="text" name="poster" placeholder="Poster URL" value={newMovie.poster} onChange={handleInputChange} />
          <button onClick={handleAddMovie}>Add Movie</button>
        </div>
      )}

      {/* Movies List */}
      <div className="movies-list">
        <h2>Current Movies</h2>
        <div className="movies-table">
          {movies.map((movie) => (
            <div key={movie.movie_id} className="movie-row">
              <div className="movie-details">
                <p><strong>Title:</strong> {movie.title}</p>
                <p><strong>Genre:</strong> {movie.genre}</p>
                <p><strong>Year:</strong> {movie.release_year}</p>
              </div>
              <div className="movie-actions">
                <button onClick={() => setEditMovie(movie)}>Edit</button>
                <button onClick={() => handleDeleteMovie(movie.movie_id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          moviesPerPage={moviesPerPage}
          totalMovies={movies.length} // This should be the total count from API
          paginate={paginate}
        />
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ moviesPerPage, totalMovies, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalMovies / moviesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination">
      <ul>
        {pageNumbers.map((number) => (
          <li key={number}>
            <button onClick={() => paginate(number)}>{number}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminDashboard;
