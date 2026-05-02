import { motion } from "motion/react";

const WorkingProcess = () => {
  const steps = [
    {
      num: "1",
      title: "Plan",
      description: "Full funnel analysis and technical roadmapping.",
    },
    {
      num: "2",
      title: "Execute",
      description: "Agile sprints and multi-channel campaign deployment.",
    },
    {
      num: "3",
      title: "Deliver",
      description: "Data-backed results and continuous scale analysis.",
    },
  ];

  return (
    <section className="bento-card bg-highlight/10 p-6 sm:p-10 md:p-16">
      <div className="text-center">
        <span className="text-[10px] font-black uppercase tracking-[2px] text-accent mb-4 block">Workflow</span>
        <h2 className="text-3xl md:text-5xl lg:text-6xl mb-12 leading-tight">How I Scale Brands</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
          {steps.map((step, index) => (
            <div key={step.num} className="relative group p-8 rounded-[32px] bg-white border border-primary/5 hover:border-accent/20 transition-all duration-500 shadow-sm hover:shadow-xl">
              <span className="text-4xl md:text-5xl font-display font-black text-primary/10 group-hover:text-accent transition-colors duration-500 mb-6 block leading-none">{step.num}</span>
              <h3 className="text-xl md:text-2xl font-display font-black mb-4 tracking-tight">{step.title}</h3>
              <p className="text-[11px] font-bold leading-relaxed opacity-50 uppercase tracking-wider">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkingProcess;
