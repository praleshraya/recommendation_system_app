import React from 'react';
import './Header.css';

const Header = ({ handleSearch, handleLogout, user }) => {
  return (
    <header className="header">
      <div className="wrapper">
        <div className="logo">Movie Recommender</div>
        <div className="search-bar">
          <input type="text" placeholder="Search movies..." onChange={handleSearch} />
        </div>
        <div className="user-icon">
          <img
            src="/path/to/user-icon.png"
            alt={user?.user_name || 'User'}
          />
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
