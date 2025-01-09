'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type Pokemon = {
  id: number;
  pokedexId: number;
  name: string;
  image: string;
  sprite: string;
  stats: {
    HP: number;
    speed: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    special_attack: number;
    special_defense: number;
  };
  generation: number;
  evolutions: Array<{
    name: string;
    pokedexId: number;
  }>;
  types: Array<{
    id: number;
    name: string;
    image: string;
  }>;
};

const PokemonList = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [types, setTypes] = useState<{ id: number; name: string; image: string }[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedLimit, setSelectedLimit] = useState('50');

  const fetchPokemons = async (limit = 50) => {
    try {
      const response = await fetch(`https://nestjs-pokedex-api.vercel.app/pokemons?limit=${limit}`);
      const data = await response.json();
      setPokemons(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons(parseInt(selectedLimit) || 50);
  }, [selectedLimit]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch('https://nestjs-pokedex-api.vercel.app/types');
        const data = await response.json();
        setTypes(data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des types de Pokémon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, []);

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesName = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType ? pokemon.types.some(type => type.name === selectedType) : true;
    return matchesName && matchesType;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <>
    <div className='filters'>
      <input
        type="text"
        placeholder="Rechercher par nom"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
     />
     <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} title='Type'>
      <option value="">Tous les types</option>
      {types.map((type) => (
        <option key={type.id} value={type.name}><img src={type.image} alt={type.name} />{type.name}</option>
      ))}
     </select>
     <select value={selectedLimit} onChange={(e) => setSelectedLimit(e.target.value)} title='Limite'>
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="50">50</option>
      <option value="100">100</option>
     </select>
     </div>
      <div className="pokemon-list">
        {filteredPokemons.map((pokemon) => (
          <Link href={`/pokemon/${pokemon.id}`} key={pokemon.id}>
            <div className="pokemon-card">
              <p>#{pokemon.id}</p>
              <p>{pokemon.name}</p>
              <img src={pokemon.image} alt={pokemon.name} />
              <div className="pokemon-types">
                {pokemon.types.map((type) => (
                  <img key={type.id} src={type.image} alt={type.name} className="type-image" />
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default PokemonList;
