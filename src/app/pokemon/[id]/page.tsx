import React from 'react';
import Link from 'next/link';

async function getPokemonDetails(id: string) {
  const response = await fetch(`https://nestjs-pokedex-api.vercel.app/pokemons/${id}`);
  if (!response.ok) return null;
  return response.json();
}

export default async function PokemonDetails({ 
  params 
}: { 
  params: { id: string } 
}) {
  const pokemon = await getPokemonDetails(params.id);

  if (!pokemon) return <div>Pokémon non trouvé</div>;

  return (
    <div className="pokemon-details">
      <Link href="/">← Retour à la liste des Pokémon</Link>
      <br></br>
      <h1>#{pokemon.id} {pokemon.name}</h1>
      <div className="pokemon-types">
        {pokemon.types.map((type : { id: number; name: string; image: string }) => (
          <img key={type.id} src={type.image} alt={type.name} className="type-image" />
        ))}
      </div>
      <img src={pokemon.image} alt={pokemon.name} />
      <p>Génération : {pokemon.generation}</p>
      <br></br>
      <div className="pokemon-evolutions">
        <h2>Évolutions :</h2>
        {pokemon.evolutions.map((evolution : { name: string; pokedexId: number }) => (
          <p key={evolution.pokedexId}>{evolution.name}</p>
        ))}
      </div>
      <br></br>
      <ul>
        <li>Statistiques</li>
        <li>PV : {pokemon.stats.HP}</li>
        <li>Vitesse : {pokemon.stats.speed}</li>
        <li>Attaque : {pokemon.stats.attack}</li>
        <li>Défense : {pokemon.stats.defense}</li>
        <li>Attaque Spéciale : {pokemon.stats.special_attack}</li>
        <li>Défense Spéciale : {pokemon.stats.special_defense}</li>
      </ul>
    </div>
  );
}