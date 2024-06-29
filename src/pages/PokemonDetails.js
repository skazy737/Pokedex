import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css';

const PokemonDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(response => {
        const types = response.data.types.map(typeInfo => typeInfo.type.name).join(', ');
        setPokemon({
          name: response.data.name,
          image: response.data.sprites.other['official-artwork'].front_default,
          height: response.data.height,
          weight: response.data.weight,
          types: types,
        });
      });
  }, [name]);

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  const handleBackClick = () => {
    navigate('/'); 
  };

  return (
    <div className="pokemon-detail-container">
      <div className="pokemon-detail-card">
        <h2 className="pokemon-name">{pokemon.name}</h2>
        <img src={pokemon.image} alt={pokemon.name} className="pokemon-detail-image" />
        <p>Height: {pokemon.height}</p>
        <p>Weight: {pokemon.weight}</p>
        <p>Type: {pokemon.types}</p>
        <button className="back-button" onClick={handleBackClick}>Voltar</button>
      </div>
    </div>
  );
};

export default PokemonDetail;
