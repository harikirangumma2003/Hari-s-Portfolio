import { motion } from "motion/react";
import { ArrowLeft, Tag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { projects } from "../data/projects";

const WorkPage = () => {
  return (
    <div className="pt-32 pb-24">
      <Helmet>
        <title>Portfolio | G. Hari Kiran - Strategic Growth Projects</title>
        <meta name="description" content="Explore my selected work in growth marketing, SEO, and performance-driven campaigns." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Portfolio | G. Hari Kiran - Strategic Growth Projects" />
        <meta property="og:description" content="Explore my selected work in growth marketing, SEO, and performance-driven campaigns." />
        <meta property="og:image" content="https://i.postimg.cc/59rp3LDd/Hari-Portfolio.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Portfolio | G. Hari Kiran - Strategic Growth Projects" />
        <meta property="twitter:description" content="Explore my selected work in growth marketing, SEO, and performance-driven campaigns." />
        <meta property="twitter:image" content="https://i.postimg.cc/59rp3LDd/Hari-Portfolio.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Project Portfolio of G. Hari Kiran",
            "description": "A collection of growth marketing, SEO, and digital strategy projects.",
            "itemListElement": projects.map((project, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "CreativeWork",
                "name": project.title,
                "description": project.description,
                "image": project.image,
                "url": `${window.location.origin}/work/${project.slug}`,
                "genre": project.category,
                "keywords": project.tags.join(", ")
              }
            }))
          })}
        </script>
      </Helmet>
      
      <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl px-2 mx-auto md:mx-0"
            >
              <span className="text-xs font-black uppercase tracking-[3px] text-accent mb-6 block">Strategic Impact</span>
              <h1 className="text-5xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.85] mb-8">
                Selected <br className="hidden md:block" /> <span className="text-accent">Results</span>
              </h1>
              <p className="text-lg md:text-xl text-muted font-medium italic opacity-70 leading-relaxed border-l-2 border-accent/20 pl-6 text-left max-w-xl mx-auto md:mx-0">
                Real metrics for real brands. Every case study below represents a journey from conceptual vision to measurable digital scale.
              </p>
            </motion.div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 lg:gap-16">
            {projects.map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                className="group flex flex-col"
              >
                <Link to={`/work/${project.slug}`} className="flex flex-col h-full bg-white border border-primary/5 rounded-[48px] p-8 lg:p-10 hover:border-accent/40 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden group/card">
                  <div className="relative aspect-[16/10] overflow-hidden mb-10 rounded-[32px] shadow-sm">
                      <img
                        src={project.image}
                        alt={`Project thumbnail for ${project.title}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover/card:scale-110"
                      />
                    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-white text-primary p-6 rounded-full shadow-2xl scale-75 group-hover/card:scale-100 transition-transform duration-500">
                        <ArrowRight size={36} className="group-hover/card:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col flex-grow relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3 text-[10px] font-black text-accent uppercase tracking-[4px]">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        {project.category}
                      </div>
                      <div className="h-px bg-primary/10 flex-grow mx-4 hidden sm:block" />
                    </div>
                    
                    <h3 className="text-4xl md:text-5xl font-display font-black uppercase leading-[0.9] mb-6 tracking-tighter group-hover/card:text-accent transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-muted text-lg mb-10 line-clamp-2 leading-relaxed opacity-80 font-medium italic">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-primary/40 border border-primary/10 px-5 py-2.5 rounded-full bg-[#fafafa] group-hover/card:bg-accent/5 group-hover/card:text-accent group-hover/card:border-accent/10 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Decorative corner element */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-[60px] opacity-0 group-hover/card:opacity-100 transition-opacity" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

export default WorkPage;
