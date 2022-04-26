import { useEffect, useState } from "react";

/**
 * Generic theme toggle button.
 */
const DarkModeButton = (): JSX.Element => {
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      setTheme(currentTheme);
    }
  }, []);

  const updateTheme = (): void => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  return (
    <button
      className="text-2xl sm:text-3xl text-yellow-400 dark:text-yellow-300 focus:outline-none"
      onClick={updateTheme}
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
};

export default DarkModeButton;
