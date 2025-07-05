// @ts-nocheck

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const uploadFiles = async (
  files: File[],
  fieldName: string = 'images',
): Promise<string[]> => {
  if (!files.length) return [];

  const formData = new FormData();

  files.forEach((file) => {
    formData.append(fieldName, file);
  });

  console.log(`Uploading ${files.length} files...`);

  try {
    const response = await axios.post(`${API_URL}/upload/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Files uploaded successfully:', response.data.imageUrls);
    return response.data.imageUrls;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};
