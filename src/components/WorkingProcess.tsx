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
    <section className="bento-card bg-highlight/10">
      <div className="text-center">
        <span className="text-[10px] font-black uppercase tracking-[2px] text-accent mb-4 block">Workflow</span>
        <h2 className="text-4xl md:text-5xl mb-12">How I Scale Brands</h2>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {steps.map((step, index) => (
            <div key={step.num} className="relative group p-6 rounded-[24px] bg-white border border-primary/5">
              <span className="text-5xl font-display font-black text-primary/10 group-hover:text-accent transition-colors duration-500 mb-4 block">{step.num}</span>
              <h3 className="text-xl font-display font-black mb-3">{step.title}</h3>
              <p className="text-[11px] font-medium leading-relaxed opacity-60 uppercase">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkingProcess;
