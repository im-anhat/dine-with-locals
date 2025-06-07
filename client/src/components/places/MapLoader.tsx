import React, { ReactNode } from 'react';
import { useLoadScript, Libraries } from '@react-google-maps/api';

// Define the libraries to load with the Maps JavaScript API
const libraries: Libraries = ['places'];

interface MapLoaderProps {
  children: ReactNode;
}

const MapLoader: React.FC<MapLoaderProps> = ({ children }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-brand-coral-500 mb-2">
            Error Loading Maps
          </h2>
          <p className="text-brand-coral-400">
            There was an error loading Google Maps. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-teal-500 mx-auto mb-4"></div>
          <p className="text-brand-stone-500">Loading Maps...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MapLoader;
