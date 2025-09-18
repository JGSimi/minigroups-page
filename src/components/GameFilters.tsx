import { GameCategory, SortOption, GameFilters as GameFiltersType } from "@/types/Game";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";

interface GameFiltersProps {
  filters: GameFiltersType;
  onFiltersChange: (filters: GameFiltersType) => void;
  totalGames: number;
  filteredGames: number;
}

const categories: GameCategory[] = [
  'Action', 'Adventure', 'Simulator', 'RPG', 'Racing', 
  'Horror', 'Puzzle', 'Strategy', 'Casual', 'Multiplayer'
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'alphabetical', label: 'A-Z' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'players', label: 'Most Players' },
];

const GameFilters = ({ filters, onFiltersChange, totalGames, filteredGames }: GameFiltersProps) => {
  const handleCategoryChange = (category: GameCategory) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? undefined : category,
    });
  };

  const handleSortChange = (sortBy: SortOption) => {
    onFiltersChange({
      ...filters,
      sortBy,
    });
  };

  const handleTogglePopular = () => {
    onFiltersChange({
      ...filters,
      onlyPopular: !filters.onlyPopular,
    });
  };

  const handleToggleFeatured = () => {
    onFiltersChange({
      ...filters,
      onlyFeatured: !filters.onlyFeatured,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: filters.search,
      sortBy: 'popular',
    });
  };

  const hasActiveFilters = !!(filters.category || filters.onlyPopular || filters.onlyFeatured);

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gaming-blue" />
            <h3 className="text-lg font-semibold text-foreground">Filters</h3>
          </div>
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredGames} of {totalGames} games
        </div>
      </div>

      {/* Sort Selection */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-foreground">Sort by:</label>
        <Select value={filters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quick Filters */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Quick Filters:</label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.onlyPopular ? "gaming" : "outline"}
            size="sm"
            onClick={handleTogglePopular}
            className="transition-all duration-200"
          >
            Popular Games
          </Button>
          <Button
            variant={filters.onlyFeatured ? "gaming" : "outline"}
            size="sm"
            onClick={handleToggleFeatured}
            className="transition-all duration-200"
          >
            Featured
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Categories:</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={filters.category === category ? "default" : "secondary"}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                filters.category === category 
                  ? "bg-gaming-blue text-white shadow-gaming" 
                  : "hover:bg-gaming-blue/20 hover:text-gaming-blue"
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.category && (
            <Badge variant="outline" className="bg-gaming-blue/10 text-gaming-blue border-gaming-blue/30">
              {filters.category}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer hover:text-gaming-blue-hover" 
                onClick={() => handleCategoryChange(filters.category!)}
              />
            </Badge>
          )}
          {filters.onlyPopular && (
            <Badge variant="outline" className="bg-gaming-purple/10 text-gaming-purple border-gaming-purple/30">
              Popular
              <X 
                className="w-3 h-3 ml-1 cursor-pointer hover:text-gaming-purple-hover" 
                onClick={handleTogglePopular}
              />
            </Badge>
          )}
          {filters.onlyFeatured && (
            <Badge variant="outline" className="bg-gaming-cyan/10 text-gaming-cyan border-gaming-cyan/30">
              Featured
              <X 
                className="w-3 h-3 ml-1 cursor-pointer hover:text-gaming-cyan-hover" 
                onClick={handleToggleFeatured}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default GameFilters;