import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Loader2 } from "lucide-react";
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gameLink: "",
    message: "",
    ageConfirm: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // URL da API - ajuste para sua URL de produção
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ageConfirm) {
      toast({
        title: "Confirmação de Idade Necessária",
        description: "Por favor, confirme que você tem mais de 13 anos.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao enviar mensagem');
      }

      toast({
        title: "Mensagem Enviada!",
        description: "Obrigado pelo contato. Retornaremos em breve."
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        gameLink: "",
        message: "",
        ageConfirm: false
      });
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);

      toast({
        title: "Erro ao Enviar",
        description: error instanceof Error ? error.message : "Ocorreu um erro. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Nome *
                  </label>
                  <Input id="name" type="text" value={formData.name} onChange={e => setFormData({
                    ...formData,
                    name: e.target.value
                  })} required placeholder="Seu nome completo" />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <Input id="email" type="email" value={formData.email} onChange={e => setFormData({
                    ...formData,
                    email: e.target.value
                  })} required placeholder="seu@email.com" />
                </div>
              </div>

              <div>
                <label htmlFor="gameLink" className="block text-sm font-medium text-foreground mb-2">
                  Link do Jogo no Roblox (opcional)
                </label>
                <Input id="gameLink" type="url" value={formData.gameLink} onChange={e => setFormData({
                  ...formData,
                  gameLink: e.target.value
                })} placeholder="https://www.roblox.com/games/..." />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Mensagem *
                </label>
                <Textarea id="message" value={formData.message} onChange={e => setFormData({
                  ...formData,
                  message: e.target.value
                })} required placeholder="Conte-nos sobre seu jogo e métricas..." rows={5} />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="ageConfirm" 
                  checked={formData.ageConfirm} 
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    ageConfirm: checked as boolean
                  })} 
                />
                <label htmlFor="ageConfirm" className="text-sm text-foreground">
                  Confirmo que tenho mais de 13 anos de idade *
                </label>
              </div>

              <Button type="submit" variant="gaming" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Mensagem
                  </>
                )}
              </Button>

              
            </form>
          </Card>
        </div>
      </div>
    </section>;
};
export default ContactSection;