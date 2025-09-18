const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/50 py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">M</span>
          </div>
          <span className="text-lg font-bold text-foreground">Mini Groups</span>
        </div>
        <p className="text-muted-foreground text-sm">
          © 2024 Mini Groups. Creating amazing gaming experiences.
        </p>
      </div>
    </footer>
  );
};
export default Footer;