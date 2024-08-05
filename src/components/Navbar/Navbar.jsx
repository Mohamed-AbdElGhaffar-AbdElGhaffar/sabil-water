import React from 'react';
import favicon from '../../Assets/favicon.png';

export default function Navbar({ handleToggle, isDarkMode }) {
  return (
    <nav className={`color py-3 overflow-hidden fixed-top ${isDarkMode ? 'bg-dark text-white' : ''}`}>
      <div className="container">
        <div className="d-flex justify-content-between">
          <h2 className="h5 mb-0 px-2 d-flex align-items-center gap-2 overflow-hidden">
            <img src={favicon} className="logo" alt="logo" />
            <div className="title d-flex flex-column">
              <span className="fw-bold">Sabil</span>
              <small>Natural Mineral Water</small>
            </div>
          </h2>
          <div className="icons me-4 position-relative" onClick={handleToggle}>
            <div className={`moon ${isDarkMode ? 'translate1' : ''}`}>
              <i className="fa-solid fa-moon position-absolute"></i>
            </div>
            <div className={`sun ${isDarkMode ? 'translate2' : ''}`}>
              <i className="fa-solid fa-sun position-absolute"></i>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
