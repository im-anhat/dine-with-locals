const API_BASE_URL = 'https://api.example.com';

export const loginService = async (phone: string, password: string) => {
  // ...existing code: implement API call for login...
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password }),
  });
  return response.json();
};
