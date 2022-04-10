import Layout from "./components/Layout";
import React, {useEffect} from "react";
import {usePokemons} from "./hooks/usePokemons";
import {Spinner} from "./components/Spinner";
import {PokemonBasic} from "./types";
import PokemonCard from "./components/PokemonCard";
import {useRecoilState} from "recoil";
import {favoritePokemonList} from "./atoms/favoritePokemonList";


// const DynamicCard = React.lazy(() => import("./components/PokemonCard"));

const stepSize = 21;

const App = (): JSX.Element => {
  const {getPokemons, getNextPage} = usePokemons({stepSize, limit: 21});
  const [favoritePokemons, setFavoritePokemons] = useRecoilState(favoritePokemonList);

  useEffect(() => {
    const localStoragePokemons = localStorage.getItem("favorites");
    if (localStoragePokemons) {
      setFavoritePokemons(JSON.parse(localStoragePokemons));
    }
  }, []);


  const pokemonList = getPokemons();

  if (pokemonList.length === 0) {
    return <Spinner />;
  }

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center">
        <div
          className={
            "container grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-items-center gap-12"
          }
        >
          {pokemonList.map((pokemon: PokemonBasic) => (
            <PokemonCard key={pokemon.id}
                         pokemon={pokemon} />
          ))}
        </div>

        {pokemonList.length >= stepSize && (
          <button
            className={
              "p-3 rounded-xl mt-12 mb-6 text-white-100 bg-sky-600 dark:bg-purple-800"
            }
            onClick={getNextPage}
          >
            Load more
          </button>
        )}
      </main>
    </Layout>
  );
};

export default App;
