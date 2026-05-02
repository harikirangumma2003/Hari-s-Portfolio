import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export const Newsletter = () => {
  const kitContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear any existing content and inject the Kit script
    if (kitContainerRef.current) {
      kitContainerRef.current.innerHTML = '';
      const script = document.createElement('script');
      script.src = "https://hari-kiran-marketing.kit.com/bc83847c5e/index.js";
      script.async = true;
      script.setAttribute('data-uid', 'bc83847c5e');
      kitContainerRef.current.appendChild(script);
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      id="newsletter-section"
      className="w-full mt-32 p-8 md:p-16 rounded-[40px] bg-primary text-white overflow-hidden relative"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
        <div className="max-w-xl text-center lg:text-left">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-black uppercase tracking-[4px] text-accent mb-4 block"
          >
            Stay Ahead of the Curve
          </motion.span>
          <h3 className="text-3xl md:text-5xl font-display font-black uppercase leading-[0.9] mb-6">
            Get Marketing Strategy <br className="hidden md:block" /> and <span className="text-accent italic">Consultation</span>.
          </h3>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
            High-signal insights to scale your brand.
          </p>
        </div>

        <div className="w-full max-w-md">
          <div 
            ref={kitContainerRef} 
            className="min-h-[100px] kit-form-container"
          >
            <div className="animate-pulse text-white/20 text-xs font-bold tracking-widest uppercase flex justify-center py-8">
              Loading form...
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
