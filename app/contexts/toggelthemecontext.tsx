"use client";
import { createContext } from "react";

type ToggleTheme = () => void;

// Create a context with a noop function as default to avoid undefined checks
export const ToggleThemeContext = createContext<ToggleTheme>(() => {});
