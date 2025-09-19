import { Card } from "@/components/ui/card";
import { Trophy, Users, Zap } from "lucide-react";

const AboutSection = () => {
  return (
<section id="about" className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h3 className="text-3xl font-bold text-foreground mb-6">About Us</h3>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our games have been played billions of times, attracting hundreds of millions 
                of monthly active users across our portfolio. We've had the privilege of working 
                on some of the top ROBLOX games, gaining invaluable insights along the way.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 text-center border-gaming-blue/20">
                  <Trophy className="w-8 h-8 text-gaming-blue mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">Top Games</p>
                </Card>
                <Card className="p-4 text-center border-gaming-blue/20">
                  <Users className="w-8 h-8 text-gaming-blue mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">Global Reach</p>
                </Card>
                <Card className="p-4 text-center border-gaming-blue/20">
                  <Zap className="w-8 h-8 text-gaming-blue mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">Innovation</p>
                </Card>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="w-80 h-80 bg-gaming-blue/10 rounded-3xl flex items-center justify-center border-2 border-gaming-blue/20">
              <div className="text-center">
                <img 
                  src="/assets/mini-groups-logo.png" 
                  alt="Mini Groups Logo" 
                  className="w-32 h-32 object-contain mx-auto mb-4"
                />
                <p className="text-xl font-bold text-foreground">Mini Groups</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;