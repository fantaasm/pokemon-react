import DarkModeButton from "./DarkModeButton";
import { useRecoilState } from "recoil";
import { searchInputField } from "../atoms/searchInput";

/**
 * Navigation bar component
 */
const NavBar = (): JSX.Element => {
  const [searchInput, setSearchInput] = useRecoilState(searchInputField);

  const handleInputFieldChange = (event: any) => {
    setSearchInput(event.target.value.trim());
  };

  return (
    <nav className={"w-full bg-blue-200 dark:bg-dark-el-1 mb-12"}>
      <div className={"flex justify-between p-4"}>
        <div className={"flex gap-4 items-center"}>
          <h1 className={"hidden sm:block font-bold text-4xl"}>Poke Mongo</h1>
          <input
            className={"p-2 rounded-md bg-white-100 text-dark"}
            type={"text"}
            placeholder={"Search"}
            onChange={handleInputFieldChange}
          />
        </div>
        <div>
          {/*<span>my favorites</span>*/}
          <DarkModeButton />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
