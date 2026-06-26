import { motion } from "motion/react";
import { ArrowLeft, User, Target, Award, Globe, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";

const milestones = [
  {
    icon: <Target size={24} />,
    title: "Mission Driven",
    text: "Passionate about helping brands navigate the digital landscape with precision and purpose."
  },
  {
    icon: <Award size={24} />,
    title: "Performance Focus",
    text: "Proven record of scaling ROI for 10+ brands across diverse industries."
  },
  {
    icon: <Globe size={24} />,
    title: "Remote First",
    text: "Based in India, collaborating with forward-thinking teams across the globe."
  },
  {
    icon: <Heart size={24} />,
    title: "User Centric",
    text: "Combining analytical data with empathetic storytelling to connect with real humans."
  }
];

const AboutPage = () => {
  return (
    <div className="pt-32 pb-24">
      <SEO 
        title="About G. Hari Kiran | Leading SEO Expert Jamshedpur"
        description="Meet G. Hari Kiran, the leading SEO Expert and dedicated Digital Marketing Consultant in Jamshedpur, Jharkhand. Learn how I grow organic authority and drive business revenue."
        url="/about"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "G. Hari Kiran",
          "jobTitle": "SEO Expert & Digital Marketing Consultant in Jamshedpur",
          "url": "https://harikiran-portfolio.netlify.app/about",
          "sameAs": [
            "https://www.linkedin.com/in/hari-kiran-gumma",
            "https://x.com/GHariKiran29",
            "https://discord.com/users/1431285511363760149",
            "https://medium.com/@harikirangumma2003"
          ],
          "description": "Leading SEO Expert and professional Digital Marketing Consultant based in Jamshedpur, Jharkhand. Specialist in ROI-focused automated marketing, audience acquisition and organic search dominance.",
          "worksFor": {
            "@type": "Organization",
            "name": "SuMeera Solutions",
            "url": "https://sumeerasolutions.com"
          }
        }}
      />
      
      <div className="container-custom">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ name: "About", path: "/about" }]} />

        {/* Back Navigation */}
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs font-black uppercase tracking-[2px] text-accent mb-4 block">Meet the Strategist</span>
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase leading-[0.9] mb-8">
              G. Hari <span className="text-accent">Kiran</span>
            </h1>
            <div className="space-y-6 text-lg text-muted leading-relaxed max-w-xl mx-auto md:mx-0">
              <p>
                I’m a Digital Marketer and Growth Strategist passionate about building brands that stand out and scale.
              </p>
              <p>
                Currently, I work with SuMeera Solutions, a USA-based SaaS company, where I focus on driving growth through SEO and performance-driven email campaigns.
              </p>
              <p>
                With over a year of experience in the food delivery industry, I’ve worked on customer engagement, content strategy, and brand positioning. I’ve also collaborated with EdTech companies, both locally and remotely, helping them strengthen their digital presence.
              </p>
              <p>
                I believe in combining creativity with data to create marketing that not only looks good but delivers results.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square bg-[#faf9f6] rounded-[40px] overflow-hidden border border-primary/5 shadow-inner group"
          >
            <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--color-accent)_25%,_transparent_65%] opacity-10 mix-blend-overlay transition-opacity group-hover:opacity-20"></div>
            <img 
              src="https://i.postimg.cc/d1MxW0j1/Hari-Portfolio.png"
              alt="Professional portrait of G. Hari Kiran"
              loading="lazy"
              decoding="async"
              width="600"
              height="600"
              className="w-full h-full object-cover transition-all duration-700 hover:scale-[1.02]"
            />
            <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-xl hidden md:block">
              <p className="font-display font-black text-primary uppercase text-sm tracking-tight text-center">"Great marketing isn’t built for the moment—it’s built to last."</p>
            </div>
          </motion.div>
        </div>

        {/* Abstract Desktop Element */}
        <div className="absolute top-[20%] right-[-5%] text-[15vw] font-black text-primary/[0.02] uppercase tracking-tighter -z-10 pointer-events-none hidden xl:block select-none">
          Strategy
        </div>

         {/* Milestone Gallery */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tighter">Small Details, <span className="text-accent">Big Impact</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bento-card p-8 bg-white border border-primary/5 hover:border-accent/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h3 className="text-lg font-display font-black uppercase mb-3 tracking-tight">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dynamic Contextual Crawl Links */}
        <div className="my-16 p-8 border border-primary/5 rounded-3xl bg-neutral-50/50 text-center font-sans">
          <p className="text-sm text-muted leading-relaxed">
            Interested in scaling traffic or streamlining regulatory pipelines? Explore G. Hari Kiran's <Link to="/work" className="text-accent font-bold hover:underline">performance campaigns</Link>, view our <Link to="/partners" className="text-accent font-bold hover:underline">growth sponsor tiers</Link>, or check the <Link to="/experience" className="text-accent font-bold hover:underline">service milestones</Link>.
          </p>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-12 rounded-[40px] bg-primary text-white text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="text-3xl md:text-5xl font-display font-black uppercase mb-8 leading-none tracking-tighter">Ready to fuel your next <span className="text-accent underline underline-offset-8">Growth Sprints?</span></h3>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a href="mailto:harikirangumma2003@gmail.com" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent text-white font-black px-10 py-4 rounded-full uppercase tracking-widest text-xs hover:bg-white hover:text-primary transition-all">
                Send an Email
              </a>
              <Link to="/contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 bg-white/5 hover:bg-white hover:text-primary text-white font-black px-10 py-4 rounded-full uppercase tracking-widest text-xs transition-all">
                Direct Inquiry
              </Link>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent/20 rounded-full blur-[100px]"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
