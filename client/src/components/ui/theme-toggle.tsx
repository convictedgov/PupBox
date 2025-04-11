import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true);

  // Set initial theme based on localStorage or system preference
  useEffect(() => {
    // Always dark mode for now, but toggle functionality is included
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    // Since we're keeping it dark-only for now, just show a toast message
    alert('Dark mode is enabled by default');
    
    // This would be the actual toggle code if we implemented it fully
    /*
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    */
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="text-gray-300 hover:text-white"
    >
      {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}
