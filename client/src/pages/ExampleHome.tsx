import React from 'react';
import Button from '../components/ExampleButton';

const Home: React.FC = () => {
  console.log('Home component rendering');
  return (
    <div style={{ background: 'white', color: 'black', padding: '20px' }}>
      <h1>Welcome to Dine with Locals</h1>
      <Button label="Get Started" onClick={() => alert('Starting...')} />
    </div>
  );
};

export default Home;
