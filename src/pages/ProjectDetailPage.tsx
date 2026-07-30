import { motion } from "motion/react";
import { ArrowLeft, ExternalLink, Calendar, User, Briefcase, ChevronRight, Sparkles, TrendingUp, Target } from "lucide-react";
import { Link, useParams, Navigate } from "react-router-dom";
import { projects } from "../data/projects";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return <Navigate to="/work" replace />;
  }

  const seoTitle = `${project.title} Case Study`.slice(0, 43);
  const seoDescription = project.description.length > 150 ? project.description.slice(0, 150) + "..." : project.description;

  return (
    <div className="pt-32 pb-24">
      <SEO 
        title={seoTitle}
        description={seoDescription}
        image={project.image}
        url={`/work/${project.slug}`}
        schemaData={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "name": project.title,
          "description": project.description,
          "image": project.image,
          "author": {
            "@type": "Person",
            "name": "G. Hari Kiran"
          },
          "genre": project.category,
          "keywords": project.tags.join(", "),
          "about": project.longDescription
        }}
      />
      
      <div className="container-custom">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs items={[{ name: "Portfolio", path: "/work" }, { name: project.title }]} />

          {/* Header */}
          <div className="mb-16 text-center lg:text-left">
            <Link to="/work" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors mb-12 group justify-center lg:justify-start">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Selected Works
            </Link>
            
            <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-8 mb-12">
              <div className="max-w-3xl">
                <span className="text-[10px] font-black uppercase tracking-[3px] text-accent mb-4 block">Case Study</span>
                <h1 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[1] md:leading-[0.85]">
                  {project.title}
                </h1>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-end gap-3">
                 {project.tags.map(tag => (
                   <span key={tag} className="px-4 py-2 rounded-full border border-primary/10 text-[10px] font-black uppercase tracking-widest text-muted">
                     {tag}
                   </span>
                 ))}
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[16/9] md:aspect-[21/9] rounded-[32px] md:rounded-[40px] overflow-hidden mb-24 border border-primary/5 shadow-2xl"
          >
            <img 
              src={project.image} 
              alt={`Featured hero image for ${project.title} case study`} 
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width="1600"
              height="900"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
          </motion.div>

          {/* Intro Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
            <div className="lg:col-span-8">
              <h2 className="text-xs font-black uppercase tracking-[4px] text-accent mb-8">The Challenge & Vision</h2>
              <p className="text-2xl md:text-3xl font-medium leading-tight text-primary mb-10 italic">
                "{project.longDescription}"
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
                {project.process.map((item, idx) => (
                  <div key={idx} className="space-y-4">
                     <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-accent opacity-30">0{idx + 1}</span>
                        <h3 className="text-lg font-display font-black uppercase tracking-tight">{item.step}</h3>
                     </div>
                     <p className="text-sm text-muted leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                <div className="p-8 bg-[#faf9f6] rounded-3xl border border-primary/5">
                  <h3 className="text-[10px] font-black uppercase tracking-[3px] text-accent mb-8">Performance Metrics</h3>
                  <div className="space-y-8">
                    {project.stats.map((stat, idx) => (
                      <div key={idx} className="flex justify-between items-baseline border-b border-primary/5 pb-4 last:border-0 last:pb-0">
                         <span className="text-[10px] font-black uppercase tracking-widest text-muted">{stat.label}</span>
                         <span className="text-3xl font-display font-black text-primary leading-none">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-primary text-white">
                   <h3 className="text-[10px] font-black uppercase tracking-[3px] text-accent mb-6">Execution Phase</h3>
                   <div className="space-y-4">
                      {project.executionHighlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs font-bold opacity-80">
                           <Sparkles size={16} className="text-accent" /> {highlight}
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 sm:p-16 rounded-[40px] md:rounded-[60px] bg-[#faf9f6]/50 border border-primary/5 text-center relative overflow-hidden"
          >
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-3xl md:text-5xl font-display font-black uppercase mb-8 leading-none tracking-tighter">
                Want to reproduce <span className="text-accent">similar growth?</span>
              </h3>
              <p className="text-muted text-sm uppercase font-bold tracking-[2px] mb-10 opacity-70">
                Every business is a unique puzzle. Let's find your specific growth levers.
              </p>
              <a href="mailto:harikirangumma2003@gmail.com" className="inline-flex items-center gap-4 bg-primary text-white px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-accent transition-all shadow-xl">
                Send an Email Inquiry <ChevronRight size={18} />
              </a>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
          </motion.div>
        </div>
      </div>
    );
  };

export default ProjectDetailPage;
