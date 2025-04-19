import React from 'react';
import ProcessBar from './ProcessBar';

function AuthenticateInput() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  return (
    <div>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
    </div>
  );
}

export default AuthenticateInput;
