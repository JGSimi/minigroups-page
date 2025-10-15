export type GameCategory = 'Action' | 'Casual' | 'RP';

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
  url: string;
}

export interface RobloxUniverseResponse {
  universeId: number;
}

export interface RobloxGameData {
  id: number;
  name: string;
  description: string;
  creator: {
    id: number;
    name: string;
    type: string;
  };
  created: string;
  updated: string;
  playing: number;
  visits: number;
}

export interface RobloxVotesData {
  id: number;
  upVotes: number;
  downVotes: number;
}

export interface RobloxThumbnailData {
  targetId: number;
  state: string;
  imageUrl: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GameConfig {
  placeId: string;
  category: GameCategory;
  tags: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  gameLink?: string;
  message: string;
  ageConfirm: boolean;
}

export interface ContactFormRequest {
  name: string;
  email: string;
  gameLink?: string;
  message: string;
  ageConfirm: boolean;
}
