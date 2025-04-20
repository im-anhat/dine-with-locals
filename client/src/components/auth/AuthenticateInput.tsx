import React, { useState } from 'react';
import ProcessBar from './ProcessBar';
import { useUserContext } from '../../hooks/useUserContext';

function AuthenticateInput() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const { user, setUser } = useUserContext();

  const validateInput = () => {
    //Will implement more robust username and password checking in the future.
    if (!user && !password && !checkPassword && password === checkPassword) {
      return true;
    }
    return false;
  };
  const setInfo = () => {
    if (validateInput()) {
      const newUser = { ...user, userName: username, password: password };
      setUser(newUser);
    }
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <input
        type="password"
        placeholder="Re-enter password"
        value={checkPassword}
        onChange={(e) => {
          setCheckPassword(e.target.value);
        }}
      />
      <button
        onClick={() => {
          setInfo();
        }}
      >
        save
      </button>
    </div>
  );
}

export default AuthenticateInput;
