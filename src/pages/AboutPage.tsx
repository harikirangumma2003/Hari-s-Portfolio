import { motion } from "motion/react";
import { ArrowLeft, User, Target, Award, Globe, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import { Footer } from "../components/ContactFooter";

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
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>About | G. Hari Kiran - Digital Consultant</title>
        <meta name="description" content="Learn more about G. Hari Kiran, a performance-driven marketing strategist helping brands bridge the gap between vision and potential." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content="About | G. Hari Kiran - Digital Consultant" />
        <meta property="og:description" content="Meet G. Hari Kiran, a Digital Marketer and Growth Strategist focused on building scaleable brands." />
        <meta property="og:image" content="https://i.postimg.cc/59rp3LDd/Hari-Portfolio.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content="About | G. Hari Kiran - Digital Consultant" />
        <meta property="twitter:description" content="Meet G. Hari Kiran, a Digital Marketer and Growth Strategist focused on building scaleable brands." />
        <meta property="twitter:image" content="https://i.postimg.cc/59rp3LDd/Hari-Portfolio.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "G. Hari Kiran",
            "jobTitle": "Digital Marketer & Growth Strategist",
            "url": window.location.origin,
            "sameAs": [
              "http://www.linkedin.com/in/hari-kiran-gumma",
              "https://discord.com/users/1431285511363760149"
            ],
            "description": "Digital Marketer and Growth Strategist passionate about building brands that stand out and scale.",
            "worksFor": {
              "@type": "Organization",
              "name": "SuMeera Solutions"
            }
          })}
        </script>
      </Helmet>
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="container-custom">
          {/* Back Navigation */}
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors mb-12 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-xs font-black uppercase tracking-[2px] text-accent mb-4 block">Meet the Strategist</span>
              <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase leading-[0.9] mb-8">
                G. Hari <span className="text-accent">Kiran</span>
              </h1>
              <div className="space-y-6 text-lg text-muted leading-relaxed">
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
                src="https://i.postimg.cc/59rp3LDd/Hari-Portfolio.png" 
                alt="Professional portrait of G. Hari Kiran"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
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
          <div>
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

          {/* Call to Action */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 p-12 rounded-[40px] bg-primary text-white text-center relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-3xl md:text-5xl font-display font-black uppercase mb-8 leading-none tracking-tighter">Ready to fuel your next <span className="text-accent underline underline-offset-8">Growth Sprints?</span></h3>
              <a href="mailto:harikirangumma2003@gmail.com" className="inline-flex items-center gap-2 bg-accent text-white font-black px-10 py-4 rounded-full uppercase tracking-widest text-xs hover:bg-white hover:text-primary transition-all">
                Send an Email
              </a>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent/20 rounded-full blur-[100px]"></div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
