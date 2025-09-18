import { useState, useMemo } from "react";
import { Game, GameFilters, SortOption } from "@/types/Game";
import { mockGames } from "@/data/mockGames";

export const useGames = () => {
  const [filters, setFilters] = useState<GameFilters>({
    sortBy: 'popular'
  });

  // Filter and sort games
  const filteredAndSortedGames = useMemo(() => {
    let filteredGames = [...mockGames];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredGames = filteredGames.filter((game) =>
        game.title.toLowerCase().includes(searchLower) ||
        game.description.toLowerCase().includes(searchLower) ||
        game.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        game.developer.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.category) {
      filteredGames = filteredGames.filter((game) => game.category === filters.category);
    }

    // Apply popular filter
    if (filters.onlyPopular) {
      filteredGames = filteredGames.filter((game) => game.isPopular);
    }

    // Apply featured filter
    if (filters.onlyFeatured) {
      filteredGames = filteredGames.filter((game) => game.featured);
    }

    // Apply sorting
    filteredGames.sort((a, b) => {
      switch (filters.sortBy) {
        case 'popular':
          // Sort by players online (descending)
          return b.playersOnline - a.playersOnline;
        
        case 'newest':
          // Sort by creation date (newest first)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        
        case 'alphabetical':
          // Sort by title (A-Z)
          return a.title.localeCompare(b.title);
        
        case 'rating':
          // Sort by rating (highest first)
          return b.rating - a.rating;
        
        case 'players':
          // Sort by active players (highest first)
          return b.playersOnline - a.playersOnline;
        
        default:
          return 0;
      }
    });

    return filteredGames;
  }, [filters]);

  // Get featured games (for homepage)
  const featuredGames = useMemo(() => {
    return mockGames
      .filter(game => game.featured)
      .sort((a, b) => b.playersOnline - a.playersOnline)
      .slice(0, 6);
  }, []);

  // Get popular games (for homepage)
  const popularGames = useMemo(() => {
    return mockGames
      .filter(game => game.isPopular)
      .sort((a, b) => b.playersOnline - a.playersOnline)
      .slice(0, 3);
  }, []);

  const updateFilters = (newFilters: GameFilters) => {
    setFilters(newFilters);
  };

  return {
    // Data
    games: filteredAndSortedGames,
    allGames: mockGames,
    featuredGames,
    popularGames,
    
    // Filters
    filters,
    updateFilters,
    
    // Statistics
    totalGames: mockGames.length,
    filteredGamesCount: filteredAndSortedGames.length,
    
    // States (for future API integration)
    isLoading: false,
    error: null,
  };
};