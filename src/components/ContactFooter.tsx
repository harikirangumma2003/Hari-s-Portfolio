import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
  const socials = [
    { name: "Discord", link: "https://discord.com/users/1431285511363760149" },
    { name: "LinkedIn", link: "http://www.linkedin.com/in/hari-kiran-gumma" },
  ];

  return (
    <section id="contact" className="py-12">
      <div className="bento-card">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[2px] text-accent mb-4 block">Let's Talk</span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl mb-8"
          >
            Let's Connect There!
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 pt-4">
          {socials.map((social, i) => (
            <motion.a
              key={social.name}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex justify-between items-center py-5 border-b border-primary/5 group transition-all"
            >
              <span className="text-sm font-bold uppercase tracking-widest text-muted group-hover:text-primary transition-colors">
                {social.name}
              </span>
              <div className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                <ArrowUpRight size={20} />
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-24 text-center pb-8 border-b border-primary/5">
          <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Email me at</p>
          <motion.a
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            href="mailto:harikirangumma2003@gmail.com"
            className="text-3xl md:text-5xl lg:text-7xl font-display font-black tracking-tighter border-b-8 border-accent hover:text-accent transition-colors block break-words"
          >
            harikirangumma2003@gmail.com
          </motion.a>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-20">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-20">
          <Link to="/" className="text-2xl font-display font-black tracking-tighter uppercase focus:outline-none">
            G. HARI KIRAN
          </Link>
          
          <div className="flex gap-8">
            <Link to="/" className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Home</Link>
            <Link to="/about" className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">About</Link>
            <Link to="/experience" className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Experience</Link>
            <Link to="/work" className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Works</Link>
            <Link to="/blog" className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Blog</Link>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase font-bold tracking-widest opacity-40">
          <p>Copyright © 2026 G. Hari Kiran. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Contact, Footer };
