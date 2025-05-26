import React, { useState, useEffect } from 'react';
import { useLogin } from '../../hooks/auth/useLogin';
import { UserLogin } from '../../../../shared/types/User';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import LoginCard from '@/components/auth/LoginCard';
import { WiStars } from 'react-icons/wi';
import { Separator } from '@/components/ui/separator';
import '../../styles/main.css';
function LoginPage() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const { handleLogin } = useLogin();

  const submitLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('enter this submit function');
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
      <div className="grid grid-cols-2 w-full">
        <div className="bg-brand-coral-400 rounded-r-xl bg-gradient-to-l from-rose-500 to-[#fc6767] text-white p-6">
          <div className="flex flex-col justify-center h-full space-y-6">
            <img
              src="../../../logo.svg"
              className="h-14 absolute top-10 left-10"
            />
            <div className="text-6xl font-bold instrument-serif flex items-center gap-2">
              Beyond tours{' '}
              <span className="text-sm font-thin instrument-serif">
                --------------------------------------
              </span>
              <span className="text-5xl">
                <WiStars />
              </span>
            </div>

            <h2 className="text-3xl font-semibold flex items-center gap-2 flex-wrap">
              Discover local gems through
              <span id="container">
                <div id="flip">
                  <div>
                    <div className="instrument-serif italic text-3xl">
                      Traveling
                    </div>
                  </div>
                  <div>
                    <div className="instrument-serif italic text-3xl">
                      Cuisine
                    </div>
                  </div>
                  <div>
                    <div className="instrument-serif italic text-3xl">
                      Event
                    </div>
                  </div>
                </div>
              </span>
            </h2>
          </div>
        </div>

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
