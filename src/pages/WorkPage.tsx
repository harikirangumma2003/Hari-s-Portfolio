import { motion } from "motion/react";
import { ArrowLeft, Tag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import { Footer } from "../components/ContactFooter";
import { projects } from "../data/projects";

const WorkPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Portfolio | G. Hari Kiran - Strategic Growth Projects</title>
        <meta name="description" content="Explore my selected work in growth marketing, SEO, and performance-driven campaigns." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Portfolio | G. Hari Kiran - Strategic Growth Projects" />
        <meta property="og:description" content="Explore my selected work in growth marketing, SEO, and performance-driven campaigns." />
        <meta property="og:image" content="https://i.postimg.cc/R0x0LnzW/Hari-Portfolio.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Portfolio | G. Hari Kiran - Strategic Growth Projects" />
        <meta property="twitter:description" content="Explore my selected work in growth marketing, SEO, and performance-driven campaigns." />
        <meta property="twitter:image" content="https://i.postimg.cc/R0x0LnzW/Hari-Portfolio.png" />

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
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-16">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors mb-8 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase leading-[0.9] mb-6">
              Selected <span className="text-accent">Works</span>
            </h1>
            <p className="max-w-xl text-muted text-lg">
              A collection of campaigns and projects focused on growth, creativity, and measurable results.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
            {projects.map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group flex flex-col"
              >
                <Link to={`/work/${project.slug}`} className="flex flex-col h-full bg-[#faf9f6]/30 border border-primary/5 rounded-[40px] p-8 hover:border-accent transition-all">
                  <div className="relative aspect-[16/10] overflow-hidden mb-8 rounded-[24px] shadow-sm">
                      <img
                        src={project.image}
                        alt={`Project thumbnail for ${project.title}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <div className="bg-white text-primary p-5 rounded-full shadow-xl">
                        <ArrowRight size={32} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col flex-grow">
                    <div className="flex items-center gap-3 text-[10px] font-black text-accent uppercase tracking-[3px] mb-4">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                      {project.category}
                    </div>
                    <h3 className="text-3xl md:text-5xl font-display font-black uppercase leading-[0.9] mb-6 tracking-tighter group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted text-lg mb-8 line-clamp-2 leading-relaxed opacity-80">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-primary/50 border border-primary/10 px-4 py-2 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WorkPage;
