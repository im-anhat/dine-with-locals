import React, { useState } from 'react';
import { useLogin } from '../../hooks/auth/useLogin';

function LoginPage() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin } = useLogin();
  const submitLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await useLogin();
  };
  return (
    <div>
      <h1>Login Page</h1>
      <p>Welcome to the login page!</p>
      <input
        name="userName"
        placeholder="User Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        name="password"
        placeholder="Password"
        value={userName}
        onChange={(e) => {
          e.target.value;
        }}
      />
      <button onClick={submitLogin}>Log in</button>
    </div>
  );
}

export default LoginPage;
