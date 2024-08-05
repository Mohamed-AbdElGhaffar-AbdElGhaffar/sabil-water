import React from 'react';
import logo from '../../Assets/logo.jpg';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark py-2 text-white">
        <div className="container d-flex flex-column flex-md-row gap-3 gap-md-0 justify-content-between align-items-center">
            <img src={logo} alt="logo" />
            <p>© 2024 Sabil Water Company, lebanon.</p>
            <div className="d-flex justify-content-center align-items-center gap-2">
                <Link to="" className="d-flex justify-content-center align-items-center"><i className="fa-brands fa-facebook-f"></i></Link>
                <Link to="" className="d-flex justify-content-center align-items-center"><i className="fa-brands fa-whatsapp"></i></Link>
                <Link to="" className="d-flex justify-content-center align-items-center"><i className="fa-brands fa-twitter"></i></Link>
            </div>
        </div>
    </footer>
  );
};

export default Footer;
