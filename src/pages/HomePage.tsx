import { SEO } from "../components/SEO";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import { StatsCard } from "../components/About";
import Services from "../components/Services";
import WorkingProcess from "../components/WorkingProcess";
import { TestimonialCard } from "../components/BrandsAndTestimonials";
import Blog from "../components/Blog";
import FAQ from "../components/FAQ";
import { Contact, Footer } from "../components/ContactFooter";
import { GrowthPartners } from "../components/GrowthPartners";

import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import { LatestContentWidget } from "./ContentHubPage";
import { VideoCarousel } from "../components/VideoCarousel";

const HomePage = () => {
  const featuredProjects = projects.slice(0, 3);

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  const localSchemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://harikiran-portfolio.netlify.app/#person",
        "name": "G. Hari Kiran",
        "jobTitle": "SEO Expert & Digital Marketing Consultant in Jamshedpur",
        "image": "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png",
        "url": "https://harikiran-portfolio.netlify.app",
        "sameAs": [
          "https://www.linkedin.com/in/hari-kiran-gumma",
          "https://x.com/GHariKiran29",
          "https://discord.com/users/1431285511363760149",
          "https://medium.com/@harikirangumma2003"
        ],
        "description": "Leading SEO Expert and professional Digital Marketing Consultant in Jamshedpur, Jharkhand. Specialist in advanced rank acceleration, conversion rate optimization, and automated retention systems.",
        "worksFor": {
          "@id": "https://harikiran-portfolio.netlify.app/#organization"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://harikiran-portfolio.netlify.app/#organization",
        "name": "SuMeera Solutions",
        "url": "https://sumeerasolutions.com",
        "logo": "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png",
        "image": "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png",
        "description": "High-growth digital consulting and technical search marketing agency serving local and global markets.",
        "sameAs": [
          "https://www.linkedin.com/in/hari-kiran-gumma",
          "https://x.com/GHariKiran29"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://harikiran-portfolio.netlify.app/#website",
        "url": "https://harikiran-portfolio.netlify.app",
        "name": "G. Hari Kiran | SEO Expert & Digital Marketing Consultant in Jamshedpur",
        "description": "High-ROI digital growth strategies, conversion-rate optimization, advanced search engine positioning, and business scale consultancy in Jamshedpur.",
        "publisher": {
          "@id": "https://harikiran-portfolio.netlify.app/#person"
        }
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://harikiran-portfolio.netlify.app/#service",
        "name": "G. Hari Kiran - SEO Expert & Digital Marketing Consultant",
        "image": "https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png",
        "url": "https://harikiran-portfolio.netlify.app",
        "telephone": "+91-XXXXXXXXXX",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Bistupur",
          "addressLocality": "Jamshedpur",
          "addressRegion": "Jharkhand",
          "postalCode": "831001",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 22.8046,
          "longitude": 86.2029
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
          ],
          "opens": "09:00",
          "closes": "18:00"
        },
        "areaServed": [
          {
            "@type": "AdministrativeArea",
            "name": "Jamshedpur"
          },
          {
            "@type": "AdministrativeArea",
            "name": "Jharkhand"
          },
          {
            "@type": "AdministrativeArea",
            "name": "India"
          }
        ],
        "knowsAbout": [
          "SEO Expert in Jamshedpur",
          "Digital Marketing Consultant in Jamshedpur",
          "Search Engine Optimization",
          "Local SEO Specialist",
          "Email Campaign Automation",
          "Google Analytics Consultant",
          "SaaS Growth Hacking",
          "Lead Generation"
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://harikiran-portfolio.netlify.app/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://harikiran-portfolio.netlify.app"
          }
        ]
      }
    ]
  };

  return (
    <div className="pt-24 pb-12 bg-bg-light">
      <SEO 
        title="SEO Expert & Consultant Jamshedpur | G. Hari Kiran"
        description="Rank higher and grow your revenue with G. Hari Kiran, the premier SEO Expert and Digital Marketing Consultant in Jamshedpur, Jharkhand. Start with a free audit."
        url=""
        schemaData={localSchemaGraph}
      />
      
      <main className="container-custom">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-[repeat(12,_minmax(120px,_auto))] gap-4 sm:gap-6"
        >
          {/* Hero Section */}
          <motion.div variants={item} className="md:col-span-12 lg:col-span-12 md:row-span-5 bento-card p-6 sm:p-10 flex flex-col justify-center bg-white">
            <Hero />
          </motion.div>

          {/* Skills Ticker */}
          <motion.div variants={item} className="md:col-span-12 md:row-span-1 rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <Marquee />
          </motion.div>

          {/* Stats 1 */}
          <motion.div variants={item} className="md:col-span-6 lg:col-span-3 md:row-span-2">
            <StatsCard value="10+" label="Global Brands" />
          </motion.div>

          {/* Stats 2 */}
          <motion.div variants={item} className="md:col-span-6 lg:col-span-3 md:row-span-2">
            <StatsCard value="98%" label="Client Retention" accent />
          </motion.div>

          {/* Desktop Showcase Image - Local Search Dominance */}
          <motion.div variants={item} className="hidden md:block md:col-span-6 lg:col-span-3 md:row-span-5 rounded-[40px] overflow-hidden group relative border border-primary/5 shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" 
              alt="Local Search Dominance Project" 
              loading="lazy"
              decoding="async"
              width="400"
              height="800"
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-8 left-8">
              <span className="text-[10px] font-black uppercase tracking-[2px] text-accent mb-2 block">Case Study</span>
              <p className="text-white text-xs font-bold uppercase tracking-tight">Local Search<br/>Dominance</p>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div variants={item} className="md:col-span-12 lg:col-span-6 md:row-span-5 bento-card overflow-visible">
            <Services />
          </motion.div>

          {/* Testimonial */}
          <motion.div variants={item} className="md:col-span-12 lg:col-span-12 md:row-span-4 rounded-[40px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-primary text-white border border-white/5">
            <TestimonialCard />
          </motion.div>
        </motion.div>

        {/* Featured Projects Grid for Mobile/Tablet or Desktop Lower Section */}
        <section className="mt-20 md:mt-40">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row justify-between items-center lg:items-end text-center lg:text-left mb-12 md:mb-16 gap-8"
          >
            <div className="max-w-xl">
              <span className="text-[10px] font-black uppercase tracking-[4px] text-accent mb-4 block">Selected Works</span>
              <h2 className="text-4xl sm:text-5xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[1] md:leading-[0.85]">Selected <br className="hidden md:block"/> Solutions</h2>
            </div>
            <Link to="/work" className="w-full sm:w-auto btn-primary group">
              Explore All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="group bento-card p-0 h-[450px] relative cursor-pointer border-none"
              >
                <Link to={`/work/${project.slug}`} className="block h-full w-full relative overflow-hidden rounded-[40px]">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    loading="lazy"
                    decoding="async"
                    width="600"
                    height="450"
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  <div className="absolute bottom-10 left-10 right-10">
                    <p className="text-[9px] font-black uppercase tracking-[2px] text-accent mb-3 block">{project.category}</p>
                    <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter leading-none group-hover:translate-x-2 transition-transform duration-500">{project.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Supporting Sections */}
        <div className="mt-40 space-y-40 mb-20 lg:mb-40">
          <GrowthPartners />
          <WorkingProcess />
          <Blog />
          
          {/* Content Hub Highlights Section */}
          <section id="content-hub-highlights" className="py-12">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end text-center md:text-left mb-12 gap-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[2px] text-accent mb-4 block">Omnichannel stream</span>
                <h2 className="text-3xl md:text-5xl lg:text-6xl leading-tight">Syndicated Content</h2>
              </div>
              <Link to="/content-hub" className="w-full sm:w-auto btn-primary flex items-center bg-primary hover:bg-accent px-8 py-3 rounded-full text-white text-[10px] font-black uppercase tracking-widest transition-all">
                Explore Content Hub <ArrowRight className="ml-2" size={16}/>
              </Link>
            </div>

            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LatestContentWidget platform="Instagram" />
                <LatestContentWidget platform="LinkedIn" />
              </div>
              
              <div className="pt-4">
                <VideoCarousel />
              </div>
            </div>
          </section>

          <FAQ />
          <Contact />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
