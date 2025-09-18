import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface GameSearchProps {
  value: string;
  onSearchChange: (search: string) => void;
  placeholder?: string;
}

const GameSearch = ({ 
  value, 
  onSearchChange, 
  placeholder = "Search games..." 
}: GameSearchProps) => {
  const [localValue, setLocalValue] = useState(value);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onSearchChange]);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = () => {
    setLocalValue("");
    onSearchChange("");
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="pl-10 pr-10 h-11 bg-background border-2 border-border focus:border-gaming-blue transition-colors duration-200"
        />
        {localValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      {/* Search suggestions or recent searches could go here */}
      {localValue && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1">
          {/* Future: Add search suggestions */}
        </div>
      )}
    </div>
  );
};

export default GameSearch;