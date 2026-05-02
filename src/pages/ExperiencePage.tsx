import { motion } from "motion/react";
import { ArrowLeft, Briefcase, Calendar, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const experiences = [
  {
    company: "SuMeera Solutions",
    role: "SEO & Digital Marketing",
    period: "2025 - Present",
    location: "Remote / USA",
    description: "Driving scalable growth through comprehensive SEO strategies, Blog Writing, WhatsApp Marketing, and highly personalized, performance-driven email marketing campaigns.",
    achievements: [
      "Optimized on-page and technical SEO resulting in a 35% increase in qualified organic leads.",
      "Developed high-conversion Blog Writing strategies to enhance brand authority and organic reach.",
      "Implemented automated WhatsApp Marketing sequences to increase customer engagement and conversion rates.",
      "Designed automated email nurturing sequences with a focus on maximizing trial-to-paid conversion rates.",
      "Collaborated with product teams to align marketing messaging with key feature releases."
    ]
  },
  {
    company: "Yuvakart",
    role: "Digital Marketing Specialist",
    period: "2025 - Present",
    location: "Remote / India",
    description: "Driving measurable growth through integrated SEO strategies, high-performing paid ad campaigns, and conversion-focused content marketing.",
    achievements: [
      "Executing SEO strategies including keyword research, on-page optimization, and content planning",
      "Managing and optimizing paid ad campaigns to improve ROI and lead generation",
      "Creating high-quality, SEO-driven content to boost organic traffic and engagement"
    ]
  },
  {
    company: "Zomato",
    role: "Sales & Operations Intern",
    period: "2025",
    location: "Remote / India",
    description: "Streamlining operations and enhancing partner performance through data-driven sales and execution strategies at Zomato.",
    achievements: [
      "Assisted restaurant partners in optimizing listings and performance",
      "Supported operational workflows to ensure smooth order management",
      "Coordinated with vendors to improve service efficiency"
    ]
  },
  {
    company: "Yumado",
    role: "Digital Marketing",
    period: "2024 - 2025",
    location: "Jamshedpur / India",
    description: "Driving brand growth and customer engagement through creative, high-impact digital marketing strategies for a growing food delivery platform.",
    achievements: [
      "Created engaging push notification campaigns and marketing strategies",
      "Contributed to brand positioning and customer acquisition efforts",
      "Collaborated on marketing campaigns to boost user engagement"
    ]
  },
  {
    company: "Campus Gyani Pvt. Ltd.",
    role: "Business Development Intern",
    period: "2024",
    location: "Jamshedpur / India",
    description: "Accelerating business growth through strategic outreach and relationship-driven lead generation.",
    achievements: [
      "Identified and connected with potential clients and partners",
      "Assisted in developing sales strategies and outreach campaigns",
      "Contributed to lead generation and conversion efforts"
    ]
  },
  {
    company: "Cnear",
    role: "Business Development Intern",
    period: "2024",
    location: "Remote / India",
    description: "Driving business expansion through targeted prospecting and digital-first client acquisition strategies.",
    achievements: [
      "Conducted market research to identify growth opportunities,",
      "Generated and qualified leads through digital outreach,",
      "Supported sales pipeline management and reporting"
    ]
  }
];

const ExperiencePage = () => {
  return (
    <div className="pt-32 pb-24">
      <div className="container-custom">
          {/* Header */}
          <div className="mb-16">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors mb-8 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase leading-[0.9] mb-6">
              Professional <span className="text-accent">Experience</span>
            </h1>
            <p className="max-w-xl text-muted text-lg">
              A journey defined by growth, strategy, and measurable marketing impact.
            </p>
          </div>

          {/* Experience Gallery */}
          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-primary/5 pb-12 last:border-0"
              >
                {/* Timeline & Meta */}
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-3 text-accent mb-4">
                    <Calendar size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">{exp.period}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-black uppercase leading-tight mb-2">
                    {exp.company}
                  </h3>
                  <div className="flex flex-col gap-1 text-muted text-xs font-bold uppercase tracking-widest italic opacity-70">
                    <div className="flex items-center gap-2"><Briefcase size={14} /> {exp.role}</div>
                    <div className="flex items-center gap-2"><MapPin size={14} /> {exp.location}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-8">
                  <p className="text-lg text-primary mb-8 font-medium italic leading-relaxed">
                    "{exp.description}"
                  </p>
                  
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[2px] text-accent">Key Achievements</p>
                    <ul className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex gap-4 items-start group">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0 group-hover:scale-150 transition-transform" />
                          <span className="text-sm text-muted leading-relaxed group-hover:text-primary transition-colors">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 p-12 rounded-[40px] bg-accent text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden"
          >
            <div className="relative z-10 max-w-xl text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-display font-black uppercase mb-4 leading-none tracking-tighter">
                Looking for a growth partner?
              </h3>
              <p className="text-white/80 uppercase text-[10px] font-black tracking-widest">Let's discuss how we can scale your specific metrics.</p>
            </div>
            <a href="mailto:harikirangumma2003@gmail.com" className="relative z-10 bg-white text-accent font-black px-10 py-4 rounded-full uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all shadow-xl">
              Get Started
            </a>
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-[100px]"></div>
          </motion.div>
        </div>
      </div>
    );
  };

export default ExperiencePage;
