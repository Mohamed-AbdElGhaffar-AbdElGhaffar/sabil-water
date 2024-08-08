import React from 'react';
import Select from 'react-select';
import favicon from '../../Assets/favicon.png';
import egypt from '../../Assets/egypt.png';
import USA from '../../Assets/united-states-of-america.png';
import lebanon from '../../Assets/lebanon.png';

export default function Navbar({ handleToggle, isDarkMode, currency, setCurrency }) {
  const options = [
    { value: 'USD', label: <><img src={USA} className="flag" alt="USA" /> USD</> },
    { value: 'LBP', label: <><img src={lebanon} className="flag" alt="Lebanon" /> LBP</> },
    { value: 'EGP', label: <><img src={egypt} className="flag" alt="Egypt" /> EGP</> },
  ];

  return (
    <nav className={`color pt-3 fixed-top ${isDarkMode ? 'bg-dark' : ''}`}>
      <div className="container">
        <div className="d-flex justify-content-between">
          <h2 className={`h5 mb-3 px-2 d-flex align-items-center gap-2 overflow-hidden ${isDarkMode ? 'text-white' : ''}`}>
            <img src={favicon} className="logo" alt="logo" />
            <div className="title d-flex flex-column">
              <span className="fw-bold">Sabil</span>
              <small>Natural Mineral Water</small>
            </div>
          </h2>
          <div className="d-flex align-items-start mt-2">
            <div className="me-4 pb-3" style={{ width: 150 }}>
              <Select 
                value={options.find(option => option.value === currency)}
                onChange={(option) => setCurrency(option.value)}
                options={options}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            <div className={`icons overflow-hidden position-relative ${isDarkMode ? 'text-white' : ''}`} onClick={handleToggle}>
              <div className={`moon ${isDarkMode ? 'translate1' : ''}`}>
                <i className="fa-solid fa-moon position-absolute"></i>
              </div>
              <div className={`sun ${isDarkMode ? 'translate2' : ''}`}>
                <i className="fa-solid fa-sun position-absolute"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
