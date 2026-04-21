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
            className="text-4xl md:text-7xl font-display font-black tracking-tighter uppercase leading-[0.85]"
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
          <div className="md:col-span-5">
            <Link to="/" className="text-4xl font-display font-black tracking-tighter uppercase mb-8 block group">
              Hari <span className="text-accent">.</span>
            </Link>
            <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-sm mb-10 italic">
              A Digital Marketer & Growth Strategist architecting scalable brand systems through data, SEO, and human-centric content.
            </p>
            <div className="flex gap-4">
               {/* Decorative digital status */}
               <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                 <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Open for Scale</span>
               </div>
            </div>
          </div>
          
          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-12">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[3px] text-accent mb-8 block">Navigation</p>
              <ul className="space-y-4">
                {[
                  { name: "Home", path: "/" },
                  { name: "About", path: "/about" },
                  { name: "Experience", path: "/experience" },
                  { name: "Work", path: "/work" },
                  { name: "Blog", path: "/blog" }
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <p className="text-[10px] font-black uppercase tracking-[3px] text-accent mb-8 block">Resources</p>
              <ul className="space-y-4">
                {["Case Studies", "SEO Guide", "Media Kit", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="col-span-2 lg:col-span-1">
              <p className="text-[10px] font-black uppercase tracking-[3px] text-accent mb-8 block">Philosophy</p>
              <p className="text-[10px] font-bold uppercase leading-relaxed text-white/30 tracking-widest underline decoration-accent/20 underline-offset-8">
                Great marketing isn't built for the moment—it's built to last.
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-black uppercase tracking-widest text-white/30">
            &copy; {currentYear} G. Hari Kiran. All Architecture Reserved.
          </p>
          <div className="flex gap-10">
            <a href="#" className="text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Contact, Footer };
