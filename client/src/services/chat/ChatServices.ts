import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchChats = async () => {
  const response = await axios.get(`${API_URL}api/chat`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export const getAllMessages = async (chatId: string) => {
  const response = await axios.get(`${API_URL}api/message/${chatId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export const sendMessage = async (chatId: string, content: string) => {
  const response = await axios.post(
    `${API_URL}api/message`,
    {
      chatId,
      content,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  return response.data;
};
