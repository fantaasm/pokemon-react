import { PokemonDetails, PokemonIcon } from "../types";

const apiBase = "https://pokeapi.co/api/v2";

/**
 * Fetches pokemons from PokeAPI, by default returns all pokemons
 *
 * @param {number} offset - Offset of the first pokemon to be returned
 * @param {number} limit - Number of pokemon to be returned
 *
 * @returns {Promise<PokemonBasic[]>} - Promise of an array of pokemons
 */
export const fetchPokemons = async (offset: number = 0, limit: number = -1) => {
  const urlParams = new URLSearchParams({ offset, limit } as unknown as string[][] | string);
  const response = await fetch(`${apiBase}/pokemon?${urlParams}`);

  if (response.ok) {
    const basePokemons = await response.json();

    return basePokemons.results.map((pokemon: any) => {
      const id = pokemon.url.match(/\/(\d+)\/$/)[1];
      const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
      return { id, name, url: pokemon.url };
    });
  }

  alert("Something went wrong=" + response.status);
  return null;
};

/**
 * Fetches details of a pokemon from PokeAPI
 *
 * @param url - Url of the pokemon
 * @returns {Promise<PokemonDetails>} - Promise of a pokemon details
 * @throws {Error} - If url is invalid
 */
export const fetchPokemonDetails = async (url: string): Promise<PokemonDetails | null> => {
  if (!url) throw new Error("fetchPokemonDetails - url is required");

  const detailsResponse = await fetch(url);
  if (!detailsResponse.ok) return null;

  const { height, weight, types, stats, species } = await detailsResponse.json();

  const speciesResponse = await fetch(species.url);
  if (!speciesResponse.ok) return null;
  const speciesData = await speciesResponse.json();

  return {
    height,
    weight,
    types,
    stats,
    species,
    evolvesFrom: speciesData.evolves_from_species?.name,
    flavorText: speciesData.flavor_text_entries.find((f: any) => f.language.name === "en").flavor_text,
    generation: speciesData.generation.name,
    color: speciesData.color.name,
    genus: speciesData.genera.find((g: any) => g.language.name === "en").genus,
  };
};

/**
 * Array of pokemon icons
 */
export const pokemonIcons: PokemonIcon[] = [
  { name: "normal", icon: process.env.PUBLIC_URL + "/Normal_Type_Icon.svg" },
  { name: "fire", icon: process.env.PUBLIC_URL + "/Fire_Type_Icon.svg" },
  { name: "water", icon: process.env.PUBLIC_URL + "/Water_Type_Icon.svg" },
  {
    name: "electric",
    icon: process.env.PUBLIC_URL + "/Electric_Type_Icon.svg",
  },
  { name: "grass", icon: process.env.PUBLIC_URL + "/Grass_Type_Icon.svg" },
  { name: "ice", icon: process.env.PUBLIC_URL + "/Ice_Type_Icon.svg" },
  {
    name: "fighting",
    icon: process.env.PUBLIC_URL + "/Fighting_Type_Icon.svg",
  },
  { name: "poison", icon: process.env.PUBLIC_URL + "/Poison_Type_Icon.svg" },
  { name: "ground", icon: process.env.PUBLIC_URL + "/Ground_Type_Icon.svg" },
  { name: "flying", icon: process.env.PUBLIC_URL + "/Flying_Type_Icon.svg" },
  { name: "psychic", icon: process.env.PUBLIC_URL + "/Psychic_Type_Icon.svg" },
  { name: "bug", icon: process.env.PUBLIC_URL + "/Bug_Type_Icon.svg" },
  { name: "rock", icon: process.env.PUBLIC_URL + "/Rock_Type_Icon.svg" },
  { name: "ghost", icon: process.env.PUBLIC_URL + "/Ghost_Type_Icon.svg" },
  { name: "dragon", icon: process.env.PUBLIC_URL + "/Dragon_Type_Icon.svg" },
  { name: "dark", icon: process.env.PUBLIC_URL + "/Dark_Type_Icon.svg" },
  { name: "steel", icon: process.env.PUBLIC_URL + "/Steel_Type_Icon.svg" },
  { name: "fairy", icon: process.env.PUBLIC_URL + "/Fairy_Type_Icon.svg" },
];
