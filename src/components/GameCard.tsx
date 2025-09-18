import { Game } from "@/types/Game";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Users, Star, Calendar } from "lucide-react";

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const formatPlayerCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  return (
    <Card className="gaming-card group overflow-hidden h-full flex flex-col">
      <div className="relative overflow-hidden">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Overlays */}
        <div className="absolute top-3 left-3 flex gap-2">
          {game.featured && (
            <Badge variant="secondary" className="bg-gaming-blue text-white font-semibold">
              Featured
            </Badge>
          )}
          {game.isPopular && (
            <Badge variant="secondary" className="bg-gaming-purple text-white font-semibold">
              Popular
            </Badge>
          )}
        </div>
        
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            {game.category}
          </Badge>
        </div>

        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="sm" variant="gaming" className="shadow-lg">
            <Play className="w-4 h-4 mr-1" />
            Play Now
          </Button>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-gaming-blue transition-colors">
            {game.title}
          </CardTitle>
          <div className="flex items-center gap-1 text-gaming-blue flex-shrink-0">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-semibold">{game.rating}</span>
          </div>
        </div>
        <CardDescription className="line-clamp-2 text-muted-foreground">
          {game.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 mt-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{formatPlayerCount(game.playersOnline)} online</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(game.createdAt)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {game.tags.slice(0, 3).map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs bg-muted hover:bg-gaming-blue/20 hover:text-gaming-blue transition-colors cursor-pointer"
            >
              {tag}
            </Badge>
          ))}
          {game.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-muted">
              +{game.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          by <span className="font-medium text-foreground">{game.developer}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;