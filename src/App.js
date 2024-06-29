import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PokemonList from './pages/PokemonList';
import PokemonDetails from './pages/PokemonDetails';
import './App.css';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/pokemons" /> : <Login onLogin={handleLogin} />} />
        <Route path="/pokemons" element={isLoggedIn ? <PokemonList /> : <Navigate to="/" />} />
        <Route path="/pokemon/:name" element={isLoggedIn ? <PokemonDetails /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
