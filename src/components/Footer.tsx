import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.footer
      className="bg-background border-t border-border/50 py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            className="text-center md:text-left"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center justify-center md:justify-start space-x-3 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.img
                src="/assets/mini-groups-logo.png"
                alt="Mini Groups Logo"
                className="w-8 h-8 object-contain"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              />
              <span className="text-xl font-bold text-foreground">
                Mini Groups
              </span>
            </motion.div>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto md:mx-0">
              Creating amazing gaming experiences for millions of players
              worldwide.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="text-left" variants={itemVariants}>
            <h3 className="text-foreground font-semibold mb-4">Quick Links</h3>
            <nav className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/games", label: "Our Games" },
                { to: "#about", label: "About Us" },
                { to: "#acquisitions", label: "Game Acquisitions" },
              ].map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.to.startsWith("#") ? (
                    <motion.a
                      href={link.to}
                      className="text-muted-foreground hover:text-gaming-blue transition-colors text-sm block relative group"
                      whileHover={{ x: 5 }}
                    >
                      <span className="relative">
                        {link.label}
                        <motion.span
                          className="absolute bottom-0 left-0 w-0 h-0.5 bg-gaming-blue group-hover:w-full transition-all"
                          initial={{ width: 0 }}
                          whileHover={{ width: "100%" }}
                        />
                      </span>
                    </motion.a>
                  ) : (
                    <Link to={link.to}>
                      <motion.span
                        className="text-muted-foreground hover:text-gaming-blue transition-colors text-sm block relative group"
                        whileHover={{ x: 5 }}
                      >
                        <span className="relative">
                          {link.label}
                          <motion.span
                            className="absolute bottom-0 left-0 w-0 h-0.5 bg-gaming-blue group-hover:w-full transition-all"
                            initial={{ width: 0 }}
                            whileHover={{ width: "100%" }}
                          />
                        </span>
                      </motion.span>
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};
export default Footer;
