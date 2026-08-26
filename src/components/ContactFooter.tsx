import { motion } from "motion/react";
import { ArrowUpRight, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
  const socials = [
    { 
      name: "Blogger", 
      link: "https://gharikiran.blogspot.com/", 
      handle: "gharikiran.blogspot.com",
      icon: (props: any) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M19.78 4.22A5.96 5.96 0 0 0 15.56 2.5H8.44A5.94 5.94 0 0 0 2.5 8.44v7.12a5.94 5.94 0 0 0 5.94 5.94h7.12a5.94 5.94 0 0 0 5.94-5.94V8.44c0-1.58-.62-3.08-1.72-4.22zM15 17H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2zm-1.5-6h-3a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2zm-1.5 3h-1.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2z"/>
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
