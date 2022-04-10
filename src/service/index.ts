import { Type } from "../types";

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
  const urlParams = new URLSearchParams({ offset, limit } as unknown as
    | string[][]
    | string);
  const response = await fetch(`${apiBase}/pokemon?${urlParams}`);

  if (response.ok) {
    const basePokemons = await response.json();

    return basePokemons.results.map((pokemon: any) => {
      const id = pokemon.url.match(/\/(\d+)\/$/)[1]; // Extract id from url for back cover sprite
      const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1); // Capitalize first letter of name
      return { id, name, url: pokemon.url };
    });
  }

  console.log("fetchPokemons - Something went wrong=" + response.status);
  return null;
};

type PokemonDetails = {
  height: number;
  weight: number;
  types: Type[];
  stats: any;
  species: {
    url: string;
  };
  evolvesFrom?: string;
  flavorText: string;
  generation: string;
  color: string;
  genus: string;
};

/**
 * Fetches details of a pokemon from PokeAPI
 *
 * @param url - Url of the pokemon
 * @returns {Promise<PokemonDetails>} - Promise of a pokemon details
 * @throws {Error} - If url is invalid
 */
export const fetchPokemonDetails = async (
  url: string
): Promise<PokemonDetails> => {
  if (!url) throw new Error("fetchPokemonDetails - url is required");

  // 1. Fetch the big details and destruct the data
  const detailsResponse = await fetch(url); // 8.5kb br, 214kb uncompressed
  if (!detailsResponse.ok) return null;

  const { height, weight, types, stats, species } =
    await detailsResponse.json();

  // 2. Use the data from big details to fetch the small details(species)
  const speciesResponse = await fetch(species.url);
  if (!speciesResponse.ok) return null;
  const speciesData = await speciesResponse.json();

  // 3. Return the merged data
  return {
    height,
    weight,
    types,
    stats,
    species,
    evolvesFrom: speciesData.evolves_from_species?.name,
    flavorText: speciesData.flavor_text_entries.find(
      (f) => f.language.name === "en"
    ).flavor_text,
    generation: speciesData.generation.name,
    color: speciesData.color.name,
    genus: speciesData.genera.find((g) => g.language.name === "en").genus,
  };
};

export const pokemonIcons = {
  normal: {
    icon: process.env.PUBLIC_URL + "/Normal_Type_Icon.svg",
    color: "#78C850",
  },
  fighting: {
    icon: process.env.PUBLIC_URL + "/Fighting_Type_Icon.svg",
    color: "#C22E28",
  },
  flying: {
    icon: process.env.PUBLIC_URL + "/Flying_Type_Icon.svg",
    color: "#A98FF3",
  },
  poison: {
    icon: process.env.PUBLIC_URL + "/Poison_Type_Icon.svg",
    color: "#A33EA1",
  },
  ground: {
    icon: process.env.PUBLIC_URL + "/Ground_Type_Icon.svg",
    color: "#E2BF65",
  },
  rock: {
    icon: process.env.PUBLIC_URL + "/Rock_Type_Icon.svg",
    color: "#B6A136",
  },
  bug: {
    icon: process.env.PUBLIC_URL + "/Bug_Type_Icon.svg",
    color: "#7CB936",
  },
  ghost: {
    icon: process.env.PUBLIC_URL + "/Ghost_Type_Icon.svg",
    color: "#705898",
  },
  steel: {
    icon: process.env.PUBLIC_URL + "/Steel_Type_Icon.svg",
    color: "#B7B7CE",
  },
  fire: {
    icon: process.env.PUBLIC_URL + "/Fire_Type_Icon.svg",
    color: "#F08030",
  },
  water: {
    icon: process.env.PUBLIC_URL + "/Water_Type_Icon.svg",
    color: "#6890F0",
  },
  grass: {
    icon: process.env.PUBLIC_URL + "/Grass_Type_Icon.svg",
    color: "#78C850",
  },
  electric: {
    icon: process.env.PUBLIC_URL + "/Electric_Type_Icon.svg",
    color: "#F8D030",
  },
  psychic: {
    icon: process.env.PUBLIC_URL + "/Psychic_Type_Icon.svg",
    color: "#F85888",
  },
  ice: {
    icon: process.env.PUBLIC_URL + "/Ice_Type_Icon.svg",
    color: "#98D8D8",
  },
  dragon: {
    icon: process.env.PUBLIC_URL + "/Dragon_Type_Icon.svg",
    color: "#6F35FC",
  },
  dark: {
    icon: process.env.PUBLIC_URL + "/Dark_Type_Icon.svg",
    color: "#705848",
  },
  fairy: {
    icon: process.env.PUBLIC_URL + "/Fairy_Type_Icon.svg",
  },
};
