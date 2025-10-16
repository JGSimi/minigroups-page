import { Router, Request, Response } from 'express';
import { robloxService } from '../services/roblox.service.js';
import { GAME_PLACE_IDS, GAMES_CONFIG } from '../config/games.js';
import { ApiResponse, Game } from '../types/index.js';

const router = Router();

// GET /api/games - Lista todos os jogos
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('[API] GET /api/games - Buscando todos os jogos');

    const games = await robloxService.getAllGames(GAME_PLACE_IDS);

    const response: ApiResponse<Game[]> = {
      success: true,
      data: games
    };

    res.json(response);
  } catch (error) {
    console.error('[API] Erro ao buscar jogos:', error);

    const fallbackGames = GAME_PLACE_IDS
      .map(placeId => robloxService.getFallbackGame(placeId))
      .filter(game => game !== null) as Game[];

    if (fallbackGames.length > 0) {
      console.log('[API] Retornando dados de fallback');
      const response: ApiResponse<Game[]> = {
        success: true,
        data: fallbackGames
      };
      return res.json(response);
    }

    const response: ApiResponse<Game[]> = {
      success: false,
      error: 'Erro ao buscar dados dos jogos. Tente novamente mais tarde.'
    };

    res.status(500).json(response);
  }
});

// GET /api/games/:placeId - Busca jogo específico por placeId
router.get('/:placeId', async (req: Request, res: Response) => {
  try {
    const { placeId } = req.params;
    console.log(`[API] GET /api/games/${placeId} - Buscando jogo específico`);

    if (!GAMES_CONFIG[placeId]) {
      const response: ApiResponse<Game> = {
        success: false,
        error: `Jogo com Place ID ${placeId} não encontrado`
      };
      return res.status(404).json(response);
    }

    const game = await robloxService.getGame(placeId);

    const response: ApiResponse<Game> = {
      success: true,
      data: game
    };

    res.json(response);
  } catch (error) {
    console.error(`[API] Erro ao buscar jogo ${req.params.placeId}:`, error);

    const fallbackGame = robloxService.getFallbackGame(req.params.placeId);

    if (fallbackGame) {
      console.log('[API] Retornando dados de fallback para o jogo');
      const response: ApiResponse<Game> = {
        success: true,
        data: fallbackGame
      };
      return res.json(response);
    }

    const response: ApiResponse<Game> = {
      success: false,
      error: 'Erro ao buscar dados do jogo. Tente novamente mais tarde.'
    };

    res.status(500).json(response);
  }
});

router.get('/health', (req: Request, res: Response) => {
  console.log('[API] GET /api/health - Health check');

  res.json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'minigroups-api',
    version: '1.0.0'
  });
});

export default router;
