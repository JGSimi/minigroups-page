import { Game } from "@/types/Game";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Eye, Star, Calendar, ExternalLink } from "lucide-react";
import { memo } from "react";

interface GameDetailsModalProps {
  game: Game | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GameDetailsModal = memo(({ game, open, onOpenChange }: GameDetailsModalProps) => {
  if (!game) return null;

  const formatNumber = (count: number) => {
    if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`;
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{game.title}</DialogTitle>
          <DialogDescription>
            by {game.developer}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Game Image */}
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={game.thumbnail}
              alt={game.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <Users className="w-6 h-6 mb-2 text-primary" />
              <span className="text-sm text-muted-foreground">Playing</span>
              <span className="text-lg font-bold">{formatNumber(game.playersOnline)}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <Eye className="w-6 h-6 mb-2 text-primary" />
              <span className="text-sm text-muted-foreground">Visits</span>
              <span className="text-lg font-bold">{formatNumber(game.visits)}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <Star className="w-6 h-6 mb-2 text-primary" />
              <span className="text-sm text-muted-foreground">Rating</span>
              <span className="text-lg font-bold">{game.rating.toFixed(1)}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <Calendar className="w-6 h-6 mb-2 text-primary" />
              <span className="text-sm text-muted-foreground">Created</span>
              <span className="text-sm font-semibold">{new Date(game.createdAt).getFullYear()}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-muted-foreground leading-relaxed">{game.description}</p>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {game.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <span className="text-sm text-muted-foreground">Category:</span>
              <span className="ml-2 font-semibold">{game.category}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Last Updated:</span>
              <span className="ml-2 font-semibold">{formatDate(game.lastUpdated)}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge className="ml-2" variant={game.isPopular ? "default" : "outline"}>
                {game.isPopular ? "Popular" : "Active"}
              </Badge>
            </div>
            {game.featured && (
              <div>
                <span className="text-sm text-muted-foreground">Featured:</span>
                <Badge className="ml-2" variant="default">
                  Yes
                </Badge>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {game.url && (
            <div className="flex gap-3">
              <Button asChild className="flex-1" size="lg">
                <a href={game.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Play Now
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

GameDetailsModal.displayName = "GameDetailsModal";

export default GameDetailsModal;
