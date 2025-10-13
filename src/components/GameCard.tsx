import { Game } from "@/types/Game";
import { Users, ExternalLink, Info, Heart } from "lucide-react";
import { memo, useCallback } from "react";

interface GameCardProps {
  game: Game;
  onDetailsClick?: (game: Game) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (gameId: string) => void;
}

const GameCard = memo(({ game, onDetailsClick, isFavorite = false, onToggleFavorite }: GameCardProps) => {
  const formatNumber = useCallback((count: number) => {
    if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`;
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
  }, []);

  const handleDetailsClick = (e: React.MouseEvent) => {
    if (onDetailsClick) {
      e.preventDefault();
      e.stopPropagation();
      onDetailsClick(game);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(game.id);
    }
  };

  const CardContent = () => (
    <>
      <div className="aspect-square overflow-hidden rounded-xl relative group">
        <img
          src={game.thumbnail}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* Favorite button - always visible */}
        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-all z-10"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-white"
              }`}
            />
          </button>
        )}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          {game.url && (
            <div className="p-2 bg-primary rounded-full">
              <ExternalLink className="w-6 h-6 text-primary-foreground" />
            </div>
          )}
          {onDetailsClick && (
            <button
              onClick={handleDetailsClick}
              className="p-2 bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
              aria-label="View game details"
            >
              <Info className="w-6 h-6 text-secondary-foreground" />
            </button>
          )}
        </div>
      </div>

      <h3 className="text-base font-semibold text-foreground line-clamp-1">{game.title}</h3>

      <div className="text-xs text-muted-foreground flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="font-medium text-foreground">Visits:</span>
          <span>{formatNumber(game.visits)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          <span className="font-medium text-foreground">Playing:</span>
          <span>{formatNumber(game.playersOnline)}</span>
        </div>
      </div>
    </>
  );

  if (game.url) {
    return (
      <a
        href={game.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col gap-3 transition-transform duration-300 hover:scale-105 cursor-pointer"
      >
        <CardContent />
      </a>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <CardContent />
    </div>
  );
});

GameCard.displayName = "GameCard";

export default GameCard;
