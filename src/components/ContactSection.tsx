import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send } from "lucide-react";
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gameLink: "",
    message: "",
    ageConfirm: false
  });
  const {
    toast
  } = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ageConfirm) {
      toast({
        title: "Age Confirmation Required",
        description: "Please confirm that you are over 13 years old.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Message Sent!",
      description: "We'll get back to you soon."
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      gameLink: "",
      message: "",
      ageConfirm: false
    });
  };
  return <section id="contact" className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <Mail className="w-16 h-16 text-gaming-blue mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-foreground mb-4">Talk to Mini Groups</h2>
            <p className="text-xl text-muted-foreground">
              Ready to discuss your game? Send us your details and we'll get back to you.
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <Input id="email" type="email" value={formData.email} onChange={e => setFormData({
                  ...formData,
                  email: e.target.value
                })} required placeholder="your@email.com" />
                </div>
              </div>

              

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message *
                </label>
                <Textarea id="message" value={formData.message} onChange={e => setFormData({
                ...formData,
                message: e.target.value
              })} required placeholder="Tell us about your game and metrics..." rows={5} />
              </div>

              

              <Button type="submit" variant="gaming" size="lg" className="w-full">
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </Button>

              
            </form>
          </Card>
        </div>
      </div>
    </section>;
};
export default ContactSection;