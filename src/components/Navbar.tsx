import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", isExternal: true },
    { name: "About", href: "/about", isExternal: true },
    { name: "Experience", href: "/experience", isExternal: true },
    { name: "Work", href: "/work", isExternal: true },
    { name: "Blog", href: "/blog", isExternal: true },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500",
        isScrolled ? "bg-white/80 backdrop-blur-xl shadow-lg py-4" : "bg-transparent py-8"
      )}
    >
      <div className="container-custom flex justify-between items-center">
        <Link 
          to="/" 
          className="text-xl font-display font-black tracking-tighter uppercase focus:outline-none flex items-center gap-2 group"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">H</div>
          <span className="group-hover:text-accent transition-colors">G. Hari Kiran</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "text-[10px] font-black uppercase tracking-[2px] transition-colors relative group",
                location.pathname === link.href ? "text-accent" : "text-primary/60 hover:text-accent"
              )}
            >
              {link.name}
              {location.pathname === link.href && (
                 <motion.div 
                   layoutId="nav-dot"
                   className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full"
                 />
              )}
            </Link>
          ))}
          <a
            href="mailto:harikirangumma2003@gmail.com"
            className="bg-primary text-white text-[10px] font-black px-6 py-2.5 rounded-full hover:bg-accent transition-all hover:scale-105 active:scale-95 uppercase tracking-[2px] shadow-lg shadow-primary/10"
          >
            Contact
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-[#faf9f6] border border-primary/5 text-primary active:scale-90 transition-transform"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[-1]"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-full left-4 right-4 mt-4 bg-white rounded-[40px] shadow-2xl border border-primary/5 overflow-hidden md:hidden z-50 p-10"
            >
              <div className="flex flex-col gap-8">
                <span className="text-[10px] font-black uppercase tracking-[4px] text-accent opacity-50 mb-2 italic">Navigation</span>
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "text-4xl font-display font-black uppercase tracking-tighter transition-all block",
                        location.pathname === link.href ? "text-accent" : "text-primary hover:text-accent"
                      )}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="mt-10"
                >
                  <a
                    href="mailto:harikirangumma2003@gmail.com"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full bg-primary text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all group"
                  >
                    Let's Build Something <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              </div>

              {/* Cultural Accents in Menu */}
              <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none uppercase font-black text-8xl tracking-tighter leading-none select-none">
                Hari<br/>Gumma
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
