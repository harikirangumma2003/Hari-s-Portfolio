import { motion } from "motion/react";
import { ArrowUpRight, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
  const socials = [
    { 
      name: "Discord", 
      link: "https://discord.com/users/1431285511363760149", 
      handle: "@hari_kiran",
      icon: (props: any) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2914a.077.077 0 01-.0066.1277 12.2986 12.2986 0 01-1.8722.8923.0766.0766 0 00-.0416.1061c.3628.6912.7663 1.3561 1.226 1.9942a.0775.0775 0 00.0842.028c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
        </svg>
      )
    },
    { 
      name: "LinkedIn", 
      link: "https://www.linkedin.com/in/hari-kiran-gumma", 
      handle: "G. Hari Kiran",
      icon: Linkedin
    },
    { 
      name: "Medium", 
      link: "https://medium.com/@harikirangumma2003", 
      handle: "@harikirangumma2003",
      icon: (props: any) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42zM24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
        </svg>
      )
    },
    { 
      name: "Twitter / X", 
      link: "https://x.com/GHariKiran29", 
      handle: "@GHariKiran29",
      icon: (props: any) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
  ];

  return (
    <section id="contact" className="py-12">
      <div className="bento-card relative overflow-hidden group/section">
        <div className="text-center mb-16 relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[4px] text-accent mb-6 block">Direct Connection</span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-7xl font-display font-black tracking-tighter uppercase leading-[0.85]"
          >
            Let's build the <br/> <span className="text-accent underline underline-offset-8 decoration-4">Next Big Thing</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {socials.map((social, i) => (
            <motion.a
              key={social.name}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col p-8 rounded-[32px] bg-[#fafafa] border border-primary/5 group transition-all hover:border-accent/40 hover:bg-white hover:shadow-xl w-full min-w-0"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <social.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#444] truncate">
                    {social.name}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300 shrink-0">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              <span 
                className={`font-display font-black uppercase tracking-tight text-primary truncate block w-full transition-colors group-hover:text-accent ${
                  social.handle.length > 15 
                    ? "text-base sm:text-lg lg:text-sm xl:text-base min-[1400px]:text-lg" 
                    : "text-lg sm:text-xl lg:text-base xl:text-lg min-[1400px]:text-xl"
                }`}
                title={social.handle}
              >
                {social.handle}
              </span>
            </motion.a>
          ))}
        </div>

        <div className="mt-20 text-center pb-8 border-b border-primary/5 relative z-10">
          <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-6">Inquiries & Partnerships</p>
          <Link
            to="/contact"
            className="text-xl sm:text-2xl md:text-5xl lg:text-6xl font-display font-black tracking-tighter hover:text-accent transition-colors block break-words leading-[1] md:leading-[0.9]"
          >
            harikirangumma2003<span className="text-accent">@</span>gmail.com
          </Link>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      </div>
    </section>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-white pt-24 md:pt-32 pb-12 overflow-hidden relative">
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-20 md:mb-24">
          {/* Brand Column */}
          <div className="md:col-span-5 relative group">
            <Link to="/" className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase mb-6 md:mb-8 block">
              Hari <span className="text-accent">.</span>
            </Link>
            <p className="text-sm md:text-lg text-white/50 leading-relaxed max-w-sm mb-10 md:mb-12 italic border-l border-accent/30 pl-6">
              Architecting scalable brand systems through high-velocity SEO, data-driven content, and human-centric growth engines.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
               {/* Digital Availability Badge */}
               <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                 <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(255,107,0,0.5)]" />
                 <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[2px] text-white/60">Open for Consultation</span>
               </div>
               
               <button 
                onClick={scrollToTop}
                className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[2px] text-white/40 hover:text-accent transition-colors group/top"
               >
                 Back to top <ArrowUpRight size={14} className="-rotate-45 group-hover/top:translate-y-[-2px] transition-transform" />
               </button>
            </div>
          </div>
          
          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-12 pt-4">
            <div className="space-y-8">
              <p className="text-[10px] font-black uppercase tracking-[4px] text-accent font-display italic opacity-80">Navigation</p>
              <ul className="space-y-3">
                {[
                  { name: "Home", path: "/" },
                  { name: "About", path: "/about" },
                  { name: "Experience", path: "/experience" },
                  { name: "Work", path: "/work" },
                  { name: "Blog", path: "/blog" },
                  { name: "Content Hub", path: "/content-hub" },
                  { name: "Partners", path: "/partners" },
                  { name: "Resources", path: "/resources" },
                  { name: "Contact", path: "/contact" },
                  { name: "SEO Audit", path: "/seo-audit" }
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all hover:translate-x-1 inline-block">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-8">
              <p className="text-[10px] font-black uppercase tracking-[4px] text-accent font-display italic opacity-80">Services</p>
              <ul className="space-y-5">
                {["SEO Strategy", "Market Research", "Content Audits", "Growth Hacking"].map((item) => (
                  <li key={item}>
                    <Link to={`/contact?interest=${encodeURIComponent(item)}`} className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all hover:translate-x-1 inline-block">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="col-span-2 lg:col-span-1 border-t lg:border-t-0 lg:border-l border-white/5 pt-12 lg:pt-0 lg:pl-12 space-y-8">
              <p className="text-[10px] font-black uppercase tracking-[4px] text-accent font-display italic opacity-80">Mission</p>
              <p className="text-[11px] font-bold uppercase leading-[1.8] text-white/30 tracking-widest">
                I believe that <span className="text-white/60 italic">meaningful marketing</span> is the bridge between a visionary product and its global community. Let's build that bridge.
              </p>
            </div>
          </div>
        </div>
        
        {/* Final Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black uppercase tracking-[3px] text-white/20">
          <p className="text-center md:text-left">
            &copy; {currentYear} G. Hari Kiran. All Architecture & Intellectual Reserved.
          </p>
          <div className="flex gap-12">
            <Link to="/contact" className="hover:text-white transition-colors">Privacy Information</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Service Terms</Link>
            <Link to="/about" className="hover:text-white transition-colors">Attributions & Credentials</Link>
          </div>
        </div>
      </div>
      
      {/* Background Graphic elements for visual weight */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
    </footer>
  );
};

export { Contact, Footer };
