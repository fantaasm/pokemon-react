import { useEffect, useState } from "react";
import { PokemonBasic } from "../types";
import { useRecoilState } from "recoil";
import { searchInputField } from "../atoms/searchInput";
import { fetchPokemons } from "../service";

type InitialValues = {
  stepSize: number;
  limit: number;
};

const defaultStepSize = 21; // Increments of 3 for grid size

/**
 * Hook to fetch and process pokemons from API
 *
 * @param initialValues - initial values for the pagination
 *
 * @returns getPokemons - function to fetch pokemons on active page or from search results
 * @returns getNextPage - function to fetch next page of pokemons
 */
export const usePokemons = ({
  stepSize = defaultStepSize,
  limit = defaultStepSize,
}: InitialValues) => {
  const [page, setPage] = useState(1); // there is pagination built in api but... too late now
  const [localPokemons, setLocalPokemons] = useState<PokemonBasic[]>([]);

  // filtering pokemons by name globally
  const [globalPokemons, setGlobalPokemons] = useState<PokemonBasic[]>([]);
  const [searchInput, setSearchInput] = useRecoilState(searchInputField);

  console.log("AAAAAAAA")
  useEffect(() => {
    getNextPage(); // get first page on load
  }, []);

  useEffect(() => {
    if (globalPokemons.length > 0 || searchInput.length === 0) return;
    getAllPokemons(); // pull the big list only when user wants to search something
  }, [searchInput]);

  /**
   * Fetches ALL pokemons from API
   *
   * @description - It pulls all 1.1k pokemons so be careful with this
   */
  const getAllPokemons = async () => {
    const response = await fetchPokemons();
    if (response) {
      setGlobalPokemons(response);
    }
  };

  /**
   * Fetches next page of pokemons from API
   */
  const getNextPage = async () => {
    const response = await fetchPokemons(page * stepSize, limit);
    if (response) {
      setLocalPokemons([...localPokemons, ...response]);
      setPage(page + 1);
    }
  };

  /**
   * Gets current list of pokemons
   *
   * @returns - list of pokemons
   */
  const getPokemons = () => {
    if (globalPokemons.length > 0 && searchInput.length > 1) {
      return globalPokemons
        .filter((pokemon) =>
          pokemon.name.toLowerCase().includes(searchInput.toLowerCase())
        )
        .slice(0, stepSize);
    }
    return localPokemons;
  };

  return {
    getPokemons,
    getNextPage,
  };
};
