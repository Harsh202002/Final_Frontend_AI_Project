import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import robotData from '../../Component 10.json';
 
const IntelligentHiringHero = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 392);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 392);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div style={{...containerStyle, width: isMobile ? '300px' : '362px', height: isMobile ? '300px' : '363px' }}>
      {/* 1. ANIMATED BACKGROUND LAYER (Matching the JSON Gradient) */}
      <motion.div
        animate={{
          background: [
            'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
            'linear-gradient(135deg, #7e22ce 0%, #9333ea 100%)',
            'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "mirror",
        }}
        style={bgLayer}
      />
 
      {/* 2. TEXT CONTENT */}
      <div style={contentWrapper}>
        <h1 style={titleStyle}>
          Intelligent Hiring,<br /> Human Decisions.
        </h1>
        <p style={subtitleStyle}>
          AI assists recruiters with insights—<br />
          you stay in control.
        </p>
 
        {/* EXACT BUTTON DESIGN */}
        <motion.button
          whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.35)' }}
          whileTap={{ scale: 0.95 }}
          style={buttonStyle}
        >
          View Hiring Results
        </motion.button>
      </div>
 
      {/* 3. LOTTIE ANIMATION LAYER (The Robot & Stars) */}
      <div style={lottieLayer}>
        <Lottie
          animationData={robotData}
          loop={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
 
      {/* 4. RECRUITER IMAGE (Static Layer) */}
      {/* <div style={recruiterLayer}>
        <img
          src="/recruiter-man.png"
          alt="Recruiter"
          style={recruiterImg}
        />
      </div> */}
    </div>
  );
};
 
// --- STYLES ---
 
const containerStyle = {
  width: "362px",
  height: "363px",
  borderRadius: 24,
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'sans-serif',
};
 
const bgLayer = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
};
 
const contentWrapper = {
  position: 'relative',
  zIndex: 10, // Sits above the background but below/behind the robot if needed
  padding: '30px',
};
 
const titleStyle = {
  color: 'white',
  fontSize: '28px',
  fontWeight: 'bold',
  lineHeight: '1.1',
  margin: '0 0 10px 0',
};
 
const subtitleStyle = {
  color: 'white',
  fontSize: '14px',
  opacity: 0.9,
  marginBottom: '20px',
};
 
const buttonStyle = {
  background: 'rgba(255, 255, 255, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  padding: '10px 20px',
  borderRadius: '50px',
  color: 'white',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  backdropFilter: 'blur(5px)',
};
 
const lottieLayer = {
  position: 'absolute',
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
  zIndex: 5, // Robot and Stars from JSON
  pointerEvents: 'none', // Allows clicking the button through the transparent parts of the Lottie
};
 
const recruiterLayer = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  zIndex: 6, // Sits in front of the Lottie robot
};
 
const recruiterImg = {
  height: '220px',
  display: 'block',
};
 
export default IntelligentHiringHero;