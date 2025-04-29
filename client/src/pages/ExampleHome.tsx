import React from 'react';
import { Button } from "@/components/ui/button"
import { ListingCard } from '@/components/ListingCard';

const Home: React.FC = () => {
  console.log('Home component rendering');
  return (
    <div style={{ background: 'white', color: 'black', padding: '20px' }}>
      <h1 className=''>Welcome to Dine with Locals</h1>
      <Button variant='default'>Button</Button>
      <ListingCard />
    </div>
  );
};

export default Home;
