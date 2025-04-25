import React from 'react';
import Button from '../components/ExampleButton';

const Home: React.FC = () => {
  console.log('Home component rendering');
  return (
    <div className="bg-brand-orange-50 text-black p-5">
      <h1>Welcome to Dine with Locals</h1>
      <Button label="Get Started" onClick={() => alert('Starting...')} />
      <div className="flex items-center justify-center h-screen bg-brand-stone-700">
        <div className="p-6 bg-brand-coral-500 rounded shadow-md">
          <h1 className="bg-brand-coral-400">Welcome Back!</h1>
          <p className="mt-2 text-brand-coral-300">
            This is a test of the branded color.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
