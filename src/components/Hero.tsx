import { motion } from "motion/react";
import { Play, ArrowDownRight, ArrowRight } from "lucide-react";

import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="h-full flex flex-col justify-center py-10 md:py-0">
      <div className="relative z-10 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[2px] text-accent mb-4 block">A Digital Marketer & Growth Strategist</span>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black leading-[1] md:leading-[0.9] tracking-tighter mb-6 uppercase"
          >
            Passionate about<br className="hidden sm:block" /> building brands
          </motion.h1>

          <p className="text-sm md:text-base font-medium text-muted max-w-md mx-auto md:mx-0 mb-8 leading-relaxed opacity-80">
            Helping modern brands scale with data-driven SEO, viral content strategies, and precision-targeted paid media campaigns.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <Link
              to="/work"
              className="w-full sm:w-auto btn-accent px-8 py-4 rounded-full bg-accent text-white font-bold inline-flex items-center justify-center gap-2 group transition-all shadow-xl shadow-accent/20"
            >
              View My Work <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <a
              href="mailto:harikirangumma2003@gmail.com"
              className="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all flex items-center justify-center"
            >
              Contact Me
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
