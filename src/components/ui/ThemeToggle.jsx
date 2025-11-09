import { Moon, Sun } from "lucide-react";
import React from "react";
import { useTheme } from "../context/ThemeContext.jsx";

const ThemeToggle = ({ className = "", variant = "default" }) => {
  const { toggleTheme, isDarkMode } = useTheme();

  const baseClassName =
    "flex items-center gap-2 rounded-full border border-default bg-surface text-xs font-medium shadow-sm transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-c-color)] md:text-sm";

  const sizeClassName =
    variant === "compact" ? "px-2 py-1" : "px-3 py-1.5";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      className={`${baseClassName} ${sizeClassName}${
        className ? ` ${className}` : ""
      }`}
    >
      <span className="flex h-4 w-4 items-center justify-center">
        {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
      </span>
      <span className="hidden md:inline">
        {isDarkMode ? "Light" : "Dark"} mode
      </span>
    </button>
  );
};

export default ThemeToggle;

