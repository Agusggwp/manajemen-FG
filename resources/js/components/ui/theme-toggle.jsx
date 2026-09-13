import React from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle({ variant = "dropdown" }) {
  const { theme, isDark, setTheme, toggleTheme } = useTheme();

  if (variant === "button") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="h-9 w-9 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
      >
        {isDark ? (
          <Sun className="h-4 w-4 transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <Moon className="h-4 w-4 transition-transform duration-300 rotate-0 scale-100" />
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Ganti Tema"
        >
          {isDark ? (
            <Moon className="h-4 w-4 text-emerald-400" />
          ) : (
            <Sun className="h-4 w-4 text-amber-500" />
          )}
          <span className="sr-only">Pilih Tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`flex items-center gap-2 cursor-pointer text-xs ${
            theme === "light" ? "font-bold text-emerald-600 dark:text-emerald-400" : ""
          }`}
        >
          <Sun className="h-4 w-4 text-amber-500" />
          <span>Terang</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-2 cursor-pointer text-xs ${
            theme === "dark" ? "font-bold text-emerald-600 dark:text-emerald-400" : ""
          }`}
        >
          <Moon className="h-4 w-4 text-blue-400" />
          <span>Gelap</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`flex items-center gap-2 cursor-pointer text-xs ${
            theme === "system" ? "font-bold text-emerald-600 dark:text-emerald-400" : ""
          }`}
        >
          <Laptop className="h-4 w-4 text-slate-500" />
          <span>Sistem</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeToggle;
