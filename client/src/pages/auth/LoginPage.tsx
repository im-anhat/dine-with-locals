import React, { useState, useEffect } from 'react';
import { useLogin } from '../../hooks/auth/useLogin';
import { UserLogin } from '../../../../shared/types/User';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import LoginCard from '@/components/auth/LoginCard';
import LoginLandingPage from '@/components/auth/LoginLandingPage';
import '../../styles/main.css';
function LoginPage() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const { handleLogin } = useLogin();

  /**
   * Update AuthContext and send username, password to backend
   * @param e
   */
  const submitLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const userLogin: UserLogin = {
      userName: userName,
      password: password,
    };
    await handleLogin(userLogin);
  };
  /**
   * Navigate to dashboard after isAuthenticated is updated in AuthContext
   * */
  useEffect(() => {
    console.log('Get to the useEffect inside Login Page');
    if (isAuthenticated) {
      console.log('Navigate to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <div className="grid grid-cols-2 w-full bg-brand-coral-100 h-full">
        {/* Login landing component */}
        <LoginLandingPage />
        {/* Login Card for User's input */}
        <div className="grid grid-cols-4 gap-2">
          <div className="col-start-2 row-start-2 z-10">
            <LoginCard
              userName={userName}
              setUserName={setUserName}
              password={password}
              setPassword={setPassword}
              isAuthenticated={isAuthenticated}
              submitLogin={submitLogin}
            ></LoginCard>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
