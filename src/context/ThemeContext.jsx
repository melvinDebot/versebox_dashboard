import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PropTypes } from "prop-types";

const THEME_STORAGE_KEY = "theme-preference";

const ThemeContext = createContext(null);

const getSystemTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getInitialState = () => {
  if (typeof window === "undefined") {
    return { theme: "light", source: "system" };
  }

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return { theme: storedTheme, source: "manual" };
  }

  return { theme: getSystemTheme(), source: "system" };
};

export const ThemeProvider = ({ children }) => {
  const [state, setState] = useState(getInitialState);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const root = window.document.documentElement;
    root.classList.toggle("dark", state.theme === "dark");
    root.dataset.theme = state.theme;
    root.style.colorScheme = state.theme;
  }, [state.theme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (state.source === "manual") {
      localStorage.setItem(THEME_STORAGE_KEY, state.theme);
    } else {
      localStorage.removeItem(THEME_STORAGE_KEY);
    }
  }, [state]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event) => {
      setState((prev) => {
        if (prev.source === "manual") {
          return prev;
        }

        return { theme: event.matches ? "dark" : "light", source: "system" };
      });
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setState((prev) => ({
      theme: prev.theme === "dark" ? "light" : "dark",
      source: "manual",
    }));
  }, []);

  const followSystem = useCallback(() => {
    setState({ theme: getSystemTheme(), source: "system" });
  }, []);

  const value = useMemo(
    () => ({
      theme: state.theme,
      themeSource: state.source,
      toggleTheme,
      followSystem,
    }),
    [state, toggleTheme, followSystem],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme doit être utilisé à l'intérieur de ThemeProvider",
    );
  }

  return context;
};
