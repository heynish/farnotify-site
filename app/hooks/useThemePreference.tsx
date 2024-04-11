import { useEffect, useState } from "react";
import { getThemePreference, setLocalStorage } from "../pages/utils"; // Assuming these are your utility functions

export const useThemePreference = () => {
  const [theme, setTheme] = useState("light"); // Default to 'light'

  useEffect(() => {
    const isDarkMode = getThemePreference(); // true for dark mode, false for light mode
    setTheme(isDarkMode ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setLocalStorage("theme", newTheme);
    setTheme(newTheme);
  };

  return { theme, toggleTheme };
};
