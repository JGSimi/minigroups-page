import { GameConfig } from '../types/index.js';

export const GAMES_CONFIG: Record<string, GameConfig> = {
  '113494949872227': {
    placeId: '113494949872227',
    category: 'RP',
    tags: ['roleplay', 'social', 'city', 'jobs', 'economy']
  },
  '128160564290614': {
    placeId: '128160564290614',
    category: 'Casual',
    tags: ['meme', 'casual', 'fun', 'creative', 'brainrot']
  },
  '124863958602381': {
    placeId: '124863958602381',
    category: 'Action',
    tags: ['shooter', 'fps', 'action', 'combat', 'competitive']
  }
};

export const GAME_PLACE_IDS = Object.keys(GAMES_CONFIG);

export const DEVELOPER_NAME = 'Mini Groups Studio';

export const POPULAR_THRESHOLD = 100000;
