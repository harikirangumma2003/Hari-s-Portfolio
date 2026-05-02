import { motion } from "motion/react";
import { 
  BarChart3, 
  Mail, 
  Search, 
  PenTool, 
  Target, 
  ArrowUpRight 
} from "lucide-react";

const Services = () => {
  const services = [
    {
      id: "01",
      title: "Retention Marketing",
      icon: Mail,
      description: "Lifecycle emails, SMS & WhatsApp strategies to maximize CLV.",
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      id: "02",
      title: "Paid Media",
      icon: Target,
      description: "Meta, Google & TikTok ads optimized for conversion.",
      color: "bg-orange-500/10 text-orange-600"
    },
    {
      id: "03",
      title: "SEO Optimization",
      icon: Search,
      description: "Technical audits and semantic keyword mapping.",
      color: "bg-green-500/10 text-green-600"
    },
    {
      id: "04",
      title: "Growth Hacking",
      icon: BarChart3,
      description: "Viral loop engineering and conversion optimization.",
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      id: "05",
      title: "Copywriting",
      icon: PenTool,
      description: "Persuasive ad copy and high-conversion sales pages.",
      color: "bg-red-500/10 text-red-600"
    },
    {
      id: "06",
      title: "Content Strategy",
      icon: ArrowUpRight,
      description: "Strategic content that builds authority and trust.",
      color: "bg-cyan-500/10 text-cyan-600"
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="h-full flex flex-col pt-4 lg:pt-0">
      <span className="text-[10px] font-black uppercase tracking-[3px] text-accent mb-8 block font-sans text-center lg:text-left">Specialized Services</span>
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow"
      >
        {services.map((service) => (
          <motion.div
            key={service.id}
            variants={item}
            className="group p-5 border border-primary/5 rounded-[24px] bg-[#faf9f6]/30 hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden"
          >
            <div className={`w-8 h-8 rounded-lg ${service.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
              <service.icon size={16} />
            </div>
            <h4 className="text-xs md:text-sm font-display font-black mb-1 uppercase tracking-tight group-hover:text-accent transition-colors">{service.title}</h4>
            <p className="text-[10px] text-muted font-medium leading-[1.4] opacity-70">{service.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Services;
