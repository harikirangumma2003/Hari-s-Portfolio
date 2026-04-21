import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="h-full flex flex-col justify-center py-10 md:py-0"
    >
      <div className="relative z-10 text-center md:text-left">
        <motion.div variants={item} className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
          <Sparkles size={12} className="text-accent ring-accent/20 animate-pulse" />
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[2px] text-accent">A Digital Marketer & Growth Strategist</span>
        </motion.div>
        
        <motion.h1
          variants={item}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-display font-black leading-[1.1] md:leading-[0.85] tracking-tighter mb-8 uppercase"
        >
          Passionate about<br className="hidden sm:block" /> <span className="text-accent underline decoration-accent/20 decoration-8 underline-offset-4">building</span> brands
        </motion.h1>

        <motion.p 
          variants={item}
          className="text-sm md:text-base font-medium text-muted max-w-md mx-auto md:mx-0 mb-10 leading-relaxed opacity-80"
        >
          Helping modern brands scale with data-driven SEO, viral content strategies, and precision-targeted paid media campaigns.
        </motion.p>

        <motion.div 
          variants={item}
          className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
        >
          <Link
            to="/work"
            className="w-full sm:w-auto btn-accent group"
          >
            Explore Projects <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <a
            href="mailto:harikirangumma2003@gmail.com"
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-primary/20 bg-white text-primary text-[10px] uppercase font-black tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-lg hover:shadow-primary/20"
          >
            Direct Inquiry
          </a>
        </motion.div>
      </div>

      {/* Visual background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-[0.03] select-none z-0">
        <div className="font-display font-black text-[20vw] leading-none uppercase tracking-tighter text-center">
          Growth<br/>Mindset
        </div>
      </div>
    </motion.div>
  );
};

export default Hero;
