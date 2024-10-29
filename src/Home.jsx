// src/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h2>Welcome to the Food Discovery App!</h2>
      <Link to="/search" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>
              Search
            </Link>
    </div>
  );
}

export default Home;
