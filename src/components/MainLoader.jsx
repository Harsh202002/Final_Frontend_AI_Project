import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import Logo from '../../src/img/Logo.png';
 
const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
 
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setFadeOut(true);
          setTimeout(() => onLoadingComplete(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
 
    return () => clearInterval(timer);
  }, [onLoadingComplete]);
 
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : ""
      }`}
    >
      <div className="flex flex-col items-center space-y-8">
        {/* Logo/Icon */}
        <div className="relative">
          {/* <div className="flex items-center justify-center w-20 h-20 bg-blue-900 rounded-2xl shadow-lg animate-pulse"> */}
            <img src={Logo} alt="Recruter AI Logo" className="w-30 h-30 rounded-3xl  text-white" />
          {/* </div> */}
          <div className="absolute -inset-2 rounded-3xl border-2 border-blue-600/20 animate-spin"></div>
          <div className="absolute -inset-4 rounded-3xl border border-blue-600/10 animate-spin [animation-direction:reverse] [animation-duration:3s]"></div>
        </div>
 
        {/* Brand Name */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Recruter AI
          </h1>
          {/* <p className="text-sm text-gray-500">
            Government Services
          </p> */}
          <div className="w-16 h-0.5 bg-blue-900 mx-auto rounded-full"></div>
        </div>
 
        {/* Progress Bar */}
        <div className="w-80 space-y-3">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-900 to-blue-600 rounded-full transition-all duration-300 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">Loading system...</span>
            <span className="text-blue-900 font-semibold">{progress}%</span>
          </div>
        </div>
 
        {/* Loading Dots */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
        </div>
 
        {/* Government Badge */}
        {/* <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
          <span className="text-xs text-gray-600 font-medium">Government of India Initiative</span>
        </div> */}
      </div>
    </div>
  );
};
 
export default LoadingScreen;