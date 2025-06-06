const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
import axios from 'axios';

export const uploadImages = async (images: File[]) => {
  if ((images ?? []).length === 0) {
    return [];
  }
  const formData = new FormData();
  (images ?? []).forEach((image: File) => {
    formData.append('images', image);
  }
  );
  console.log('Uploading to Cloudinary:', formData);
  const uploadResponse = await axios.post(`${API_URL}/upload/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return uploadResponse.data.imageUrls;
}