import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export const StatsCard = ({ value, label, accent = false }: { value: string, label: string, accent?: boolean }) => {
  return (
    <div className={`h-full flex flex-col items-center justify-center text-center p-6 rounded-[24px] ${accent ? 'bg-accent text-white' : 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)]'}`}>
      <div className={`text-4xl md:text-5xl font-display font-black leading-none mb-2 ${!accent && 'text-accent'}`}>{value}</div>
      <div className={`text-[10px] font-black uppercase tracking-[2px] ${accent ? 'text-white/80' : 'text-muted'}`}>{label}</div>
    </div>
  );
};

const About = () => {
  return null; // Content moved to specific cards in App.tsx
};

export default About;
