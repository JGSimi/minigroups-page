import axios from 'axios';
import {
  Game,
  RobloxUniverseResponse,
  RobloxGameData,
  RobloxVotesData,
  RobloxThumbnailData
} from '../types/index.js';
import { cacheService } from './cache.service.js';
import { GAMES_CONFIG, DEVELOPER_NAME, POPULAR_THRESHOLD } from '../config/games.js';

class RobloxService {
  private readonly baseUrl = 'https://games.roblox.com/v1';
  private readonly thumbnailUrl = 'https://thumbnails.roblox.com/v1';
  private readonly apisUrl = 'https://apis.roblox.com';

  async getUniverseId(placeId: string): Promise<number> {
    const cacheKey = `universe:${placeId}`;
    const cached = cacheService.get<number>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      console.log(`[Roblox] Buscando Universe ID para Place ID: ${placeId}`);
      const response = await axios.get<RobloxUniverseResponse>(
        `${this.apisUrl}/universes/v1/places/${placeId}/universe`,
        { timeout: 10000 }
      );

      const universeId = response.data.universeId;
      cacheService.set(cacheKey, universeId, 60);

      return universeId;
    } catch (error) {
      console.error(`[Roblox] Erro ao buscar Universe ID para ${placeId}:`, error);
      throw new Error(`Falha ao buscar Universe ID para Place ID ${placeId}`);
    }
  }

  async getGameDetails(universeId: number): Promise<RobloxGameData> {
    const cacheKey = `game:${universeId}`;
    const cached = cacheService.get<RobloxGameData>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      console.log(`[Roblox] Buscando detalhes do jogo para Universe ID: ${universeId}`);
      const response = await axios.get(
        `${this.baseUrl}/games?universeIds=${universeId}`,
        { timeout: 10000 }
      );

      const gameData = response.data.data[0];

      if (!gameData) {
        throw new Error(`Jogo não encontrado para Universe ID ${universeId}`);
      }

      cacheService.set(cacheKey, gameData, 5);
      return gameData;
    } catch (error) {
      console.error(`[Roblox] Erro ao buscar detalhes do jogo ${universeId}:`, error);
      throw new Error(`Falha ao buscar detalhes do jogo ${universeId}`);
    }
  }

  async getGameVotes(universeId: number): Promise<RobloxVotesData> {
    const cacheKey = `votes:${universeId}`;
    const cached = cacheService.get<RobloxVotesData>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      console.log(`[Roblox] Buscando votos para Universe ID: ${universeId}`);
      const response = await axios.get(
        `${this.baseUrl}/games/votes?universeIds=${universeId}`,
        { timeout: 10000 }
      );

      const votesData = response.data.data[0];

      if (!votesData) {
        throw new Error(`Votos não encontrados para Universe ID ${universeId}`);
      }

      cacheService.set(cacheKey, votesData, 5);
      return votesData;
    } catch (error) {
      console.error(`[Roblox] Erro ao buscar votos do jogo ${universeId}:`, error);
      return { id: universeId, upVotes: 0, downVotes: 0 };
    }
  }

  async getGameThumbnail(universeId: number): Promise<string> {
    const cacheKey = `thumbnail:${universeId}`;
    const cached = cacheService.get<string>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      console.log(`[Roblox] Buscando thumbnail para Universe ID: ${universeId}`);
      const response = await axios.get(
        `${this.thumbnailUrl}/games/icons?universeIds=${universeId}&size=512x512&format=Png`,
        { timeout: 10000 }
      );

      const thumbnailData: RobloxThumbnailData = response.data.data[0];

      if (!thumbnailData || thumbnailData.state !== 'Completed') {
        throw new Error(`Thumbnail não disponível para Universe ID ${universeId}`);
      }

      const imageUrl = thumbnailData.imageUrl;
      cacheService.set(cacheKey, imageUrl, 60);

      return imageUrl;
    } catch (error) {
      console.error(`[Roblox] Erro ao buscar thumbnail do jogo ${universeId}:`, error);
      return 'https://via.placeholder.com/512x512?text=No+Image';
    }
  }

  calculateRating(upVotes: number, downVotes: number): number {
    const total = upVotes + downVotes;
    if (total === 0) return 0;

    const ratio = upVotes / total;
    return parseFloat((ratio * 5).toFixed(1));
  }

  async getGame(placeId: string): Promise<Game> {
    const cacheKey = `full_game:${placeId}`;
    const cached = cacheService.get<Game>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      console.log(`[Roblox] Processando jogo completo para Place ID: ${placeId}`);

      const config = GAMES_CONFIG[placeId];
      if (!config) {
        throw new Error(`Configuração não encontrada para Place ID ${placeId}`);
      }

      const universeId = await this.getUniverseId(placeId);

      const [gameDetails, votes, thumbnail] = await Promise.all([
        this.getGameDetails(universeId),
        this.getGameVotes(universeId),
        this.getGameThumbnail(universeId)
      ]);

      const rating = this.calculateRating(votes.upVotes, votes.downVotes);
      const isPopular = gameDetails.playing >= POPULAR_THRESHOLD;

      const game: Game = {
        id: placeId,
        title: gameDetails.name,
        description: gameDetails.description || 'Descrição não disponível',
        thumbnail,
        category: config.category,
        playersOnline: gameDetails.playing,
        visits: gameDetails.visits,
        rating,
        isPopular,
        createdAt: gameDetails.created,
        lastUpdated: gameDetails.updated,
        tags: config.tags,
        developer: DEVELOPER_NAME,
        featured: true,
        url: `https://www.roblox.com/games/${placeId}`
      };

      cacheService.set(cacheKey, game, 5);
      console.log(`[Roblox] Jogo processado com sucesso: ${game.title}`);

      return game;
    } catch (error) {
      console.error(`[Roblox] Erro ao processar jogo ${placeId}:`, error);
      throw error;
    }
  }

  async getAllGames(placeIds: string[]): Promise<Game[]> {
    const cacheKey = 'all_games';
    const cached = cacheService.get<Game[]>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      console.log(`[Roblox] Buscando todos os jogos: ${placeIds.length} jogos`);

      const gamesPromises = placeIds.map(placeId =>
        this.getGame(placeId).catch(error => {
          console.error(`[Roblox] Erro ao buscar jogo ${placeId}, usando fallback:`, error);
          return this.getFallbackGame(placeId);
        })
      );

      const games = await Promise.all(gamesPromises);
      const validGames = games.filter(game => game !== null) as Game[];

      cacheService.set(cacheKey, validGames, 5);
      console.log(`[Roblox] Total de jogos carregados: ${validGames.length}`);

      return validGames;
    } catch (error) {
      console.error('[Roblox] Erro ao buscar todos os jogos:', error);
      throw error;
    }
  }

  getFallbackGame(placeId: string): Game | null {
    const config = GAMES_CONFIG[placeId];
    if (!config) return null;

    const fallbackData: Record<string, Partial<Game>> = {
      '113494949872227': {
        title: 'Mini City RP',
        description: '💼 Trabalhe de Gari, Fazendeiro, Entregador, Médico, entre outros empregos. Você também pode ser Policial, e colocar ordem na cidade, ou seguir a vida do crime, e criar sua própria gangue para dominar a cidade.',
        thumbnail: 'https://tr.rbxcdn.com/180DAY-31e03c5b3b13bc4b4bf82029914393d7/768/432/Image/Webp/noFilter',
        playersOnline: 450000,
        visits: 3200000000,
        rating: 4.8,
        createdAt: '2025-05-11T00:00:00Z',
        lastUpdated: new Date().toISOString()
      },
      '128160564290614': {
        title: 'Make A BrainRot',
        description: 'Crie seu Brainrot e explore um mundo caótico e divertido com seus amigos!',
        thumbnail: 'https://tr.rbxcdn.com/180DAY-e57ef39efc0654add0260badc5a415c0/768/432/Image/Webp/noFilter',
        playersOnline: 380000,
        visits: 2800000000,
        rating: 4.7,
        createdAt: '2024-08-10T00:00:00Z',
        lastUpdated: new Date().toISOString()
      },
      '124863958602381': {
        title: 'Mini Shooters',
        description: 'Enter our intense and fast first-person shooter, where skill, style and chaos reign!',
        thumbnail: 'https://tr.rbxcdn.com/180DAY-fd26469cf96029dcc251c6c7e50072ed/768/432/Image/Webp/noFilter',
        playersOnline: 320000,
        visits: 2500000000,
        rating: 4.6,
        createdAt: '2024-11-15T00:00:00Z',
        lastUpdated: new Date().toISOString()
      }
    };

    const fallback = fallbackData[placeId];
    if (!fallback) return null;

    return {
      id: placeId,
      title: fallback.title!,
      description: fallback.description!,
      thumbnail: fallback.thumbnail!,
      category: config.category,
      playersOnline: fallback.playersOnline!,
      visits: fallback.visits!,
      rating: fallback.rating!,
      isPopular: fallback.playersOnline! >= POPULAR_THRESHOLD,
      createdAt: fallback.createdAt!,
      lastUpdated: fallback.lastUpdated!,
      tags: config.tags,
      developer: DEVELOPER_NAME,
      featured: true,
      url: `https://www.roblox.com/games/${placeId}`
    };
  }
}

export const robloxService = new RobloxService();
