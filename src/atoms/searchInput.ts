import { atom } from "recoil";

export const searchInputField = atom<string>({
  key: "searchInput",
  default: "",
});
