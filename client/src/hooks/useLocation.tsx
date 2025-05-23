import axios from 'axios';

interface LocationData {}

export const useLocation = () => {
  const createLocation = async (locationData: LocationData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/location/createLocation`,
        {
          ...locationData,
        },
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.error('Error creating location:', error);
      throw Error('Error creating location');
    }
  };
  return { createLocation };
};
