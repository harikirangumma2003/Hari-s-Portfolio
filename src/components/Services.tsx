import { motion } from "motion/react";
import { Search, BarChart3, Mail, PenTool, ArrowUpRight } from "lucide-react";

const Services = () => {
  const services = [
    {
      id: "01",
      title: "Retention Marketing",
      description: "Lifecycle emails, SMS & WhatsApp strategies to maximize CLV.",
    },
    {
      id: "02",
      title: "Paid Media",
      description: "Meta, Google & TikTok ads optimized for conversion.",
    },
    {
      id: "03",
      title: "SEO Optimization",
      description: "Technical audits and semantic keyword mapping.",
    },
    {
      id: "04",
      title: "Copywriting",
      description: "Persuasive ad copy and high-conversion sales pages.",
    },
    {
      id: "05",
      title: "Blog Writing",
      description: "SEO-optimized long-form articles that build authority.",
    },
    {
      id: "06",
      title: "Content Writing",
      description: "Strategic content for newsletters, E-books, and social platforms.",
    },
  ];

  return (
    <div className="h-full">
      <span className="text-[10px] font-black uppercase tracking-[2px] text-accent mb-6 block font-sans">Expertise</span>
      <div className="grid md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-5 border border-primary/5 rounded-[16px] bg-[#faf9f6]/50"
          >
            <h4 className="text-sm font-display font-black mb-1 uppercase tracking-tight">{service.title}</h4>
            <p className="text-[10px] text-muted font-medium leading-[1.4]">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
