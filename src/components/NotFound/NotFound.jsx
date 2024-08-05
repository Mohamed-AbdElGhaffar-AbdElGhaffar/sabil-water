import React, { useState } from 'react';
import Lottie from 'react-lottie';
import notfoundAnimation from '../../Assets/NotFound.json'; 
import Navbar from '../Navbar/Navbar';

export default function NotFound() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggle = () => {
    setIsDarkMode(prevState => !prevState);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: notfoundAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div>
      <Navbar handleToggle={handleToggle} isDarkMode={isDarkMode} />
      <div className='w-100 d-flex justify-content-center align-items-center mt-5 '>
        <div className='notfoundAnimation d-flex justify-content-center align-items-center'>
          <Lottie options={defaultOptions} height={600} width="100%" />
        </div>
      </div>
    </div>
  );
}
