import { memo, useState } from "react";
import { PokemonBasic, PokemonDetails, Type } from "../types";
import {
  GiCrossedSwords,
  GiShield,
  GiShieldOpposition,
  GiSwordWound,
  GiWalkingBoot,
  GiWaterDrop,
} from "react-icons/gi";
import { Spinner } from "./Spinner";
import { AiFillCloseCircle, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useRecoilState } from "recoil";
import { favoritePokemonList } from "../atoms/favoritePokemonList";
import { fetchPokemonDetails, pokemonIcons } from "../service";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  pokemon: PokemonBasic;
}

const spriteBaseUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/";
const spriteOfficialBaseUrl =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

/**
 * Pokemon card component
 * @param id - Pokemon id
 * @param name - Pokemon name
 * @param url - Pokemon url
 *
 */
const PokemonCard = ({ pokemon: { id, name, url } }: Props): JSX.Element => {
  const [details, setDetails] = useState<PokemonDetails>();
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [favoritePokemons, setFavoritePokemons] = useRecoilState(favoritePokemonList);

  if (!url) throw new Error("slug is required");

  async function fetchDetails(): Promise<void> {
    if (details) return;
    setLoading(true);

    const response = await fetchPokemonDetails(url);

    if (response) {
      setDetails(response);
      setLoading(false);
    } else {
      setTimeout(fetchDetails, 1000);
    }
  }

  const isFavorite = favoritePokemons.includes(id);

  const addRemoveFavorites = () => {
    const favorites: number[] = JSON.parse(localStorage.getItem("favorites")!) || [];
    if (favorites.includes(id)) {
      const newFavorites = favorites.filter((f) => f !== id);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    } else {
      localStorage.setItem("favorites", JSON.stringify([...favorites, id]));
    }

    setFavoritePokemons((currVal) => {
      if (currVal.includes(id)) {
        return currVal.filter((f) => f !== id);
      } else {
        return [...currVal, id];
      }
    });
  };

  const getPokemonIcon = (types: Type[]): JSX.Element | null => {
    if (!types || types.length === 0) return null;

    const typeName = types[0].type.name;
    const typeIcon = pokemonIcons.find((icon) => icon.name === typeName);

    return <img className={"w-24 h-24"} title={typeName} src={typeIcon?.icon} alt={typeName} />;
  };

  const renderBackSide = () => {
    return (
      <div className={"h-full bg-yellow-400 dark:bg-gray-800 text-center"}>
        <img className={"w-[328px] h-[328px]"} src={spriteBaseUrl + id + ".png"} alt={"pokemon"} />
        <h2 className={"mt-6 text-3xl"}>{name}</h2>
        {isFavorite && <AiFillHeart className={"text-red-500 mx-auto mt-4"} size={48} />}
      </div>
    );
  };

  const renderFrontSide = () => {
    return (
      <>
        {(loading || !details) && (
          <div className={"absolute top-0 left-0 w-full h-full z-40 backdrop-blur-sm"}>
            <Spinner />
          </div>
        )}

        <div className={`container flex flex-col p-2 bg-red-200 dark:bg-gray-800 h-full relative`}>
          <div className={"absolute top-0 right-0 -mr-6 -mt-6"}>
            <AiFillCloseCircle
              className={"text-red-500 cursor-pointer"}
              size={40}
              onClick={() => setShowDetails(false)}
            />
          </div>

          <div className={"flex justify-around border-b border-yellow-500"}>
            <span className={"font-bold"}>Evolves from {details?.evolvesFrom || "unknown"}</span>
            <span>{details?.generation || "unknown"}</span>
          </div>
          <div className={"flex justify-between p-2"}>
            <div className={"flex justify-center items-center gap-1"}>
              <h2 className={"font-black text-lg"}>{name} </h2>
              {isFavorite ? (
                <AiFillHeart className={"text-red-500 cursor-pointer"} size={32} onClick={addRemoveFavorites} />
              ) : (
                <AiOutlineHeart className={"text-red-500 cursor-pointer"} size={32} onClick={addRemoveFavorites} />
              )}
            </div>
            <div className={"flex gap-2"}>
              <h3 className={"font-bold text-lg text-[#790202] dark:text-[#fea4a4]"}>
                {details?.stats[0].base_stat} HP
              </h3>
              <div className={"w-[32px] h-[32px] rounded-full  flex justify-center items-center"}>
                {details && (getPokemonIcon(details?.types) || <GiWaterDrop size={24} title={"Placeholder"} />)}
              </div>
            </div>
          </div>
          <div
            style={{ backgroundImage: `url("/low-poly-gradient.svg")` }}
            className={"w-full h-[200px] px-4 border-4 border-amber-400 dark:border-purple-800 relative"}
          >
            <img
              title={name}
              loading={"eager"}
              className={"mx-auto"}
              height={"200px"}
              width={200}
              src={spriteOfficialBaseUrl + id + ".png"}
              alt={"pokemon"}
            />
          </div>
          <p
            className={
              "mt-1 text-center font-extrabold p-1 bg-yellow-400 dark:bg-purple-800 whitespace-nowrap overflow-hidden"
            }
          >
            {details?.genus} Length {(details?.height || 0) * 10}cm , Weight {(details?.weight || 0) / 10}kg
          </p>
          <div
            className={
              "grid grid-cols-5 justify-items-center gap-4 py-4 text-center border-t border-b border-black dark:border-purple-800 mt-4"
            }
          >
            <div>
              <GiSwordWound size={32} className={"text-[#800000] dark:text-[#fea4a4]"} title={"Attack"} />
              <span className={"text-lg"}>{details?.stats[1].base_stat || "0"}</span>
            </div>
            <div>
              <GiCrossedSwords size={32} className={"text-[#800000] dark:text-[#fea4a4]"} title={"Special Attack"} />
              <span className={"text-lg"}>{details?.stats[3].base_stat || "0"}</span>
            </div>
            <div>
              <GiShield size={32} className={"text-[#0808c9] dark:text-[#0be0d2]"} title={"Defense"} />
              <span className={"text-lg"}>{details?.stats[2].base_stat || "0"}</span>
            </div>
            <div>
              <GiShieldOpposition
                size={32}
                className={"text-[#0808c9] dark:text-[#0be0d2]"}
                title={"Special Defense"}
              />
              <span className={"text-lg"}>{details?.stats[4].base_stat || "0"}</span>
            </div>
            <div>
              <GiWalkingBoot size={32} className={"text-white-100"} title={"Speed"} />
              <span className={"text-lg"}>{details?.stats[5].base_stat || "0"}</span>
            </div>
          </div>
          <p className={"p-1 mt-1 border border-slate-500 max-h-[42px] overflow-y-auto"}>{details?.flavorText}</p>
        </div>
      </>
    );
  };

  const handleCardClicked = () => {
    if (showDetails) return;
    setShowDetails(!showDetails);
    fetchDetails();
  };

  return (
    <div
      className={`container w-[360px] h-[500px] bg-yellow-300 dark:bg-dark-el-1 p-4 rounded-2xl relative text-xs ${
        !showDetails && "cursor-pointer hover:scale-105 hover:-translate-y-5"
      } transition-all duration-300 ease-out relative`}
      onClick={handleCardClicked}
    >
      {!showDetails ? renderBackSide() : renderFrontSide()}
    </div>
  );
};

export default memo(PokemonCard, () => true);
