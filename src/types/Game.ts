export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: GameCategory;
  playersOnline: number;
  visits: number;
  rating: number;
  isPopular: boolean;
  createdAt: string;
  lastUpdated: string;
  tags: string[];
  developer: string;
  featured: boolean;
  url?: string;
}

export type GameCategory = 
  | 'Action'
  | 'Casual'
  | 'RP';

export type SortOption = 
  | 'popular'
  | 'newest'
  | 'alphabetical'
  | 'rating'
  | 'players';

export interface GameFilters {
  category?: GameCategory;
  search?: string;
  sortBy: SortOption;
  onlyPopular?: boolean;
  onlyFeatured?: boolean;
}