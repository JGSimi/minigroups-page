import { useState, useMemo, useEffect } from "react";
import { Game, GameFilters, SortOption } from "@/types/Game";
import { mockGames } from "@/data/mockGames";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useGames = () => {
  const [filters, setFilters] = useState<GameFilters>({
    sortBy: 'popular'
  });
  const [allGamesData, setAllGamesData] = useState<Game[]>(mockGames);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('[Frontend] Buscando jogos da API...');
        const response = await fetch(`${API_URL}/api/games`);

        if (!response.ok) {
          throw new Error('Falha ao buscar jogos da API');
        }

        const data = await response.json();

        if (data.success && data.data) {
          console.log('[Frontend] Jogos carregados com sucesso:', data.data.length);
          setAllGamesData(data.data);
        } else {
          throw new Error(data.error || 'Resposta inválida da API');
        }
      } catch (err) {
        console.error('[Frontend] Erro ao buscar jogos, usando dados mockados:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setAllGamesData(mockGames);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Filter and sort games
  const filteredAndSortedGames = useMemo(() => {
    let filteredGames = [...allGamesData];

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
  }, [filters, allGamesData]);

  // Get featured games (for homepage)
  const featuredGames = useMemo(() => {
    return allGamesData
      .filter(game => game.featured)
      .sort((a, b) => b.playersOnline - a.playersOnline)
      .slice(0, 6);
  }, [allGamesData]);

  // Get popular games (for homepage)
  const popularGames = useMemo(() => {
    return allGamesData
      .filter(game => game.isPopular)
      .sort((a, b) => b.playersOnline - a.playersOnline)
      .slice(0, 3);
  }, [allGamesData]);

  const updateFilters = (newFilters: GameFilters) => {
    setFilters(newFilters);
  };

  return {
    // Data
    games: filteredAndSortedGames,
    allGames: allGamesData,
    featuredGames,
    popularGames,

    // Filters
    filters,
    updateFilters,

    // Statistics
    totalGames: allGamesData.length,
    filteredGamesCount: filteredAndSortedGames.length,

    // States
    isLoading,
    error,
  };
};