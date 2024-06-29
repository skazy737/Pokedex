import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

const ITEMS_PER_PAGE = 12;

const fetchPokemonDetails = async (pokemon) => {
  try {
    const response = await axios.get(pokemon.url);
    return {
      ...pokemon,
      types: response.data.types.map(typeInfo => typeInfo.type.name)
    };
  } catch (error) {
    console.error(`Erro ao buscar detalhes do Pokémon ${pokemon.name}: `, error);
    return { ...pokemon, types: [] };
  }
};

const PokemonList = () => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [displayedPokemons, setDisplayedPokemons] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchAllPokemons = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000');
        const sortedPokemons = response.data.results.sort((a, b) => a.name.localeCompare(b.name));
        const pokemonsWithDetails = await Promise.all(
          sortedPokemons.slice(0, ITEMS_PER_PAGE).map(fetchPokemonDetails)
        );
        setAllPokemons(sortedPokemons);
        setDisplayedPokemons(pokemonsWithDetails);
      } catch (error) {
        console.error('Erro ao buscar dados: ', error);
      }
    };

    fetchAllPokemons();
  }, []);

  useEffect(() => {
    const fetchDisplayedPokemons = async () => {
      const filteredPokemons = allPokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
      );

      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = page * ITEMS_PER_PAGE;
      const pokemonsToFetch = filteredPokemons.slice(startIndex, endIndex);
      const pokemonsWithDetails = await Promise.all(pokemonsToFetch.map(fetchPokemonDetails));
      setDisplayedPokemons(pokemonsWithDetails);
    };

    if (allPokemons.length > 0) {
      fetchDisplayedPokemons();
    }
  }, [search, page, allPokemons]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <h2 className="pokemon-list-header">LISTA DE POKÉMONS</h2>
      <input
        type="text"
        placeholder="Buscar Pokémon"
        value={search}
        onChange={handleSearchChange}
        className="pokemon-search"
      />
        <div className="pokemon-list-container">
      <div className="pokemon-list">
        {displayedPokemons.map(pokemon => (
          <div key={pokemon.name} className="pokemon-card">
            <h3>{pokemon.name}</h3>
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[pokemon.url.split('/').length - 2]}.png`} alt={pokemon.name} className="pokemon-small-image" />
            <p>Tipos: {pokemon.types.join(', ')}</p>
            <Link to={`/pokemon/${pokemon.name}`}>DETALHES</Link>
          </div>
        ))}
        </div>
      </div>
      <div className="button-container">
        <button onClick={() => setPage(page > 1 ? page - 1 : 1)}>VOLTAR</button>
        <button onClick={() => setPage(page + 1)}>PRÓXIMO</button>
      </div>
    </div>
  );
};

export default PokemonList;
