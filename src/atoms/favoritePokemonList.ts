import { atom } from "recoil";

export const favoritePokemonList = atom<number[]>({
  key: "favoritePokemonList",
  default: [],
});
