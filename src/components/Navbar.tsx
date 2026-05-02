import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Experience", href: "/experience" },
    { name: "Work", href: "/work" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[60] origin-left"
        style={{ scaleX }}
      />
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-500",
          isScrolled 
            ? "bg-white/70 backdrop-blur-xl border-b border-black/5 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.03)]" 
            : "bg-transparent py-6"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center text-primary">
          <Link 
            to="/" 
            className="text-xl md:text-2xl font-display font-black tracking-tighter uppercase focus:outline-none flex items-center gap-2 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div 
              whileHover={{ rotate: 90 }}
              className="w-8 h-8 md:w-9 md:h-9 bg-primary rounded-xl flex items-center justify-center text-white text-xs md:text-sm shadow-lg group-hover:bg-accent transition-colors"
            >
              HG
            </motion.div>
            <span className="group-hover:text-accent transition-colors">G. Hari Kiran</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-2 bg-black/[0.03] backdrop-blur-sm p-1 rounded-full border border-black/5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[2px] transition-all px-4 py-2 rounded-full relative group",
                    location.pathname === link.href 
                      ? "text-white" 
                      : "text-primary/60 hover:text-primary"
                  )}
                >
                  <span className="relative z-10">{link.name}</span>
                  {location.pathname === link.href && (
                    <motion.div 
                      layoutId="nav-bg"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                </Link>
              ))}
            </div>
            <Link
              to="/contact"
              className="px-6 py-3 bg-accent text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:-translate-y-1 transition-all shadow-lg active:scale-95"
            >
              Get in Touch
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-2xl bg-black/5 border border-black/5 text-primary active:scale-90 transition-transform"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
                className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[-1]"
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute top-full left-4 right-4 mt-2 bg-white rounded-[32px] shadow-2xl border border-black/5 overflow-hidden md:hidden z-50 p-6 sm:p-10"
              >
                <div className="flex flex-col gap-5">
                  <span className="text-[9px] font-black uppercase tracking-[3px] text-accent opacity-50 mb-1 italic">Explore Section</span>
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "text-4xl font-display font-black uppercase tracking-tighter transition-all block py-1",
                          location.pathname === link.href ? "text-accent scale-105 origin-left" : "text-primary hover:text-accent"
                        )}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                    className="mt-6"
                  >
                    <Link
                      to="/contact"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full bg-accent text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,107,0,0.3)] active:scale-95 transition-all group"
                    >
                      Work With Me <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </div>

                <div className="absolute top-10 right-10 opacity-[0.02] pointer-events-none uppercase font-black text-8xl tracking-tighter leading-none select-none">
                  HARI<br/>MARKETING
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
