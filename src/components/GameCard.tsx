import { Game } from "@/types/Game";
import { Users } from "lucide-react";

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const formatNumber = (count: number) => {
    if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`;
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square overflow-hidden rounded-xl">
        <img
          src={game.thumbnail}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
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
    </div>
  );
};

export default GameCard;
