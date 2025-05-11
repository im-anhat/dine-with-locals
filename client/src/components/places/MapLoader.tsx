import React, { useEffect, useState } from 'react';

interface MapLoaderProps {
  children: React.ReactNode;
}

/**
 * This snippet is a TypeScript declaration that extends the global
 * Window interface to include a custom property called initMap.
 */
declare global {
  interface Window {
    initMap: () => void;
  }
}

const MapLoader: React.FC<MapLoaderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (!window.google) {
      // Function to initialize when Google Maps script loads
      window.initMap = () => {
        setIsLoaded(true);
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;

      // Append script to HTML document
      document.head.appendChild(script);

      // a cleanup function typically used in React's useEffect hook.
      return () => {
        // clean up
        window.initMap = () => {};
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } else {
      // Google Maps script is already loaded
      setIsLoaded(true);
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-full">
        Loading Maps...
      </div>
    );
  }

  return <>{children}</>;
};

export default MapLoader;
