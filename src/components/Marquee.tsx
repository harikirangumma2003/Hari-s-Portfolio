import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

const Marquee = () => {
  const skills = [
    "SEO STRATEGY",
    "CONTENT DESIGN",
    "PAID MEDIA",
    "BLOG WRITING",
    "CONTENT WRITING",
    "WHATSAPP MARKETING",
    "EMAIL MARKETING",
    "SMS MARKETING",
  ];

  return (
    <div className="bg-primary py-4 px-8 flex items-center h-full">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="flex whitespace-nowrap gap-12 items-center"
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-12 items-center">
            {skills.map((skill) => (
              <div key={skill} className="flex items-center gap-12">
                <span className="text-xl md:text-2xl font-display font-black uppercase text-highlight">{skill}</span>
                <span className="text-highlight text-3xl font-display">•</span>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
