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
    // fetchMovies(currentPage, searchQuery);
    const moviesList = {
      "movies": [
          {
              "movie_id": 145552,
              "title": "002 Operation Moon (1965)",
              "genre": "Franco Franchi,Ciccio Ingrassia,Mónica Randall,Linda Sini",
              "release_year": 2015,
              "director": "Lucio Fulci",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": null
          },
          {
              "movie_id": 133005,
              "title": "008: Operation Exterminate (1966)",
              "genre": "Alberto Lupo,Ingrid Schoeller",
              "release_year": 2015,
              "director": "Umberto Lenzi",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": null
          },
          {
              "movie_id": 140828,
              "title": "009-1: The End of the Beginning (2013)",
              "genre": "Mayuko Iwasa,Minehiro Kinomoto,Nao Nagasawa,Mao Ichimichi,Aya Sugimoto",
              "release_year": 2015,
              "director": "Koichi Sakamoto",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": 2
          },
          {
              "movie_id": 101708,
              "title": "009 Re: Cyborg (2012)",
              "genre": "Hisao Egawa, Toshiko Fujita, Hiroshi Kamiya",
              "release_year": 2013,
              "director": "Kenji Kamiyama",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": 2
          },
          {
              "movie_id": 218781,
              "title": "0.0MHz (2019)",
              "genre": "Jung Eun-ji,Lee Sung-yeol,Choi Yoon-young,Shin Ju-hwan",
              "release_year": 2020,
              "director": "Yu Seon-dong",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": null
          },
          {
              "movie_id": 167748,
              "title": "00 Schneider - Im Wendekreis der Eidechse (2013)",
              "genre": "Helge Schneider,Rocko Schamoni,Sergej Gleithmann,Peter Thoms,Pete York",
              "release_year": 2017,
              "director": "Helge Schneider",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": null
          },
          {
              "movie_id": 157110,
              "title": "00 Schneider - Jagd auf Nihil Baxter (1994)",
              "genre": "Helge Schneider,Helmut Körschgen,Andreas Kunze,Otto Van den Berg,Guenther Kordas",
              "release_year": 2016,
              "director": "Helge Schneider",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": null
          },
          {
              "movie_id": 101462,
              "title": "03:34 Earthquake in Chile (03:34 Terremoto en Chile) (2011)",
              "genre": "Marcelo Alonso, Andrea Freund, Fernando Gómez Rovira",
              "release_year": 2013,
              "director": "Juan Pablo Ternicier",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": null
          },
          {
              "movie_id": 192097,
              "title": "0.5mm (2014)",
              "genre": "Sakura Ando,Junkichi Orimoto,Toshio Sakata,Masahiko Tsugawa,Akira Emoto",
              "release_year": 2018,
              "director": "Momoko Ando",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": 3
          },
          {
              "movie_id": 204224,
              "title": "07/27/1978 (2017)",
              "genre": "John Blyth Barrymore",
              "release_year": 2019,
              "director": "Zachary Johnson",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": null
          }
      ],
      "total": 84660
  }
   setMovies(moviesList.movies);
  }, [currentPage, searchQuery]);

  useEffect(() => {
    // fetchRecommendations();

    const moviesList = {
      "movies": [
          {
              "movie_id": 145552,
              "title": "002 Operation Moon (1965)",
              "genre": "Franco Franchi,Ciccio Ingrassia,Mónica Randall,Linda Sini",
              "release_year": 2015,
              "director": "Lucio Fulci",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": null
          },
          {
              "movie_id": 133005,
              "title": "008: Operation Exterminate (1966)",
              "genre": "Alberto Lupo,Ingrid Schoeller",
              "release_year": 2015,
              "director": "Umberto Lenzi",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": null
          },
          {
              "movie_id": 140828,
              "title": "009-1: The End of the Beginning (2013)",
              "genre": "Mayuko Iwasa,Minehiro Kinomoto,Nao Nagasawa,Mao Ichimichi,Aya Sugimoto",
              "release_year": 2015,
              "director": "Koichi Sakamoto",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": 2
          },
          {
              "movie_id": 101708,
              "title": "009 Re: Cyborg (2012)",
              "genre": "Hisao Egawa, Toshiko Fujita, Hiroshi Kamiya",
              "release_year": 2013,
              "director": "Kenji Kamiyama",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": 2
          },
          {
              "movie_id": 218781,
              "title": "0.0MHz (2019)",
              "genre": "Jung Eun-ji,Lee Sung-yeol,Choi Yoon-young,Shin Ju-hwan",
              "release_year": 2020,
              "director": "Yu Seon-dong",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": null
          },
          {
              "movie_id": 167748,
              "title": "00 Schneider - Im Wendekreis der Eidechse (2013)",
              "genre": "Helge Schneider,Rocko Schamoni,Sergej Gleithmann,Peter Thoms,Pete York",
              "release_year": 2017,
              "director": "Helge Schneider",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": null
          },
          {
              "movie_id": 157110,
              "title": "00 Schneider - Jagd auf Nihil Baxter (1994)",
              "genre": "Helge Schneider,Helmut Körschgen,Andreas Kunze,Otto Van den Berg,Guenther Kordas",
              "release_year": 2016,
              "director": "Helge Schneider",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": null
          },
          {
              "movie_id": 101462,
              "title": "03:34 Earthquake in Chile (03:34 Terremoto en Chile) (2011)",
              "genre": "Marcelo Alonso, Andrea Freund, Fernando Gómez Rovira",
              "release_year": 2013,
              "director": "Juan Pablo Ternicier",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": null
          },
          {
              "movie_id": 192097,
              "title": "0.5mm (2014)",
              "genre": "Sakura Ando,Junkichi Orimoto,Toshio Sakata,Masahiko Tsugawa,Akira Emoto",
              "release_year": 2018,
              "director": "Momoko Ando",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": 3
          },
          {
              "movie_id": 204224,
              "title": "07/27/1978 (2017)",
              "genre": "John Blyth Barrymore",
              "release_year": 2019,
              "director": "Zachary Johnson",
              "duration_min": null,
              "poster": null,
              "created_at": "2024-11-08T22:33:33.911034Z",
              "updated_at": null,
              "rating": null
          }
      ],
      "total": 84660
  }

    setRecommendations(moviesList.movies);
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
