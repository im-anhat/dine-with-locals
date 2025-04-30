import React from 'react';

const Home: React.FC = () => {
  console.log('Home component rendering');
  return (
    <div style={{ background: 'white', color: 'black', padding: '20px' }}>
      <h1 className=''>Welcome to Dine with Locals</h1>
    </div>
  );
};

export default Home;
