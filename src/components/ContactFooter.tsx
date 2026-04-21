import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
  const socials = [
    { name: "Discord", link: "https://discord.com/users/1431285511363760149", handle: "@hari_kiran" },
    { name: "LinkedIn", link: "http://www.linkedin.com/in/hari-kiran-gumma", handle: "G. Hari Kiran" },
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
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
              className="flex flex-col p-8 rounded-[32px] bg-[#fafafa] border border-primary/5 group transition-all hover:border-accent/40 hover:bg-white hover:shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-accent">
                  {social.name}
                </span>
                <div className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300">
                  <ArrowUpRight size={20} />
                </div>
              </div>
              <span className="text-xl font-display font-black uppercase tracking-tight text-primary">
                {social.handle}
              </span>
            </motion.a>
          ))}
        </div>

        <div className="mt-20 text-center pb-8 border-b border-primary/5 relative z-10">
          <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-6">Inquiries & Partnerships</p>
          <motion.a
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            href="mailto:harikirangumma2003@gmail.com"
            className="text-2xl md:text-5xl lg:text-6xl font-display font-black tracking-tighter hover:text-accent transition-colors block break-words leading-[0.9]"
          >
            harikirangumma2003<span className="text-accent">@</span>gmail.com
          </motion.a>
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
  
  return (
    <footer className="bg-primary text-white pt-32 pb-12 overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-24">
          {/* Brand Column */}
          <div className="md:col-span-5 relative group">
            <Link to="/" className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase mb-8 block">
              Hari <span className="text-accent">.</span>
            </Link>
            <p className="text-sm md:text-lg text-white/50 leading-relaxed max-w-sm mb-12 italic border-l border-accent/30 pl-6">
              Architecting scalable brand systems through high-velocity SEO, data-driven content, and human-centric growth engines.
            </p>
            <div className="flex gap-4">
               {/* Digital Availability Badge */}
               <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                 <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(255,107,0,0.5)]" />
                 <span className="text-[10px] font-black uppercase tracking-[2px] text-white/60">Currently Open for Consultation</span>
               </div>
            </div>
          </div>
          
          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-12 pt-4">
            <div className="space-y-8">
              <p className="text-[10px] font-black uppercase tracking-[4px] text-accent font-display italic opacity-80">Navigation</p>
              <ul className="space-y-5">
                {[
                  { name: "Home", path: "/" },
                  { name: "About", path: "/about" },
                  { name: "Experience", path: "/experience" },
                  { name: "Work", path: "/work" },
                  { name: "Blog", path: "/blog" }
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all hover:translate-x-1 inline-block">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-8">
              <p className="text-[10px] font-black uppercase tracking-[4px] text-accent font-display italic opacity-80">Services</p>
              <ul className="space-y-5">
                {["SEO Strategy", "Market Research", "Content Audits", "Growth Hacking"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all hover:translate-x-1 inline-block">{item}</a>
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
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Attributions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Contact, Footer };
