import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import { StatsCard } from "../components/About";
import Services from "../components/Services";
import WorkingProcess from "../components/WorkingProcess";
import { TestimonialCard } from "../components/BrandsAndTestimonials";
import Blog from "../components/Blog";
import { Contact, Footer } from "../components/ContactFooter";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen pt-24">
      <Helmet>
        <title>G. Hari Kiran | Digital Marketing Expert & Growth Strategist</title>
        <meta name="description" content="G. Hari Kiran is a leading Digital Marketing Expert and Growth Strategist at SuMeera Solutions. Specialized in high-impact SEO, conversion-optimized SMS marketing, and data-driven retention strategies." />
        <meta name="keywords" content="Digital Marketing Expert, Growth Strategist, SEO Specialist, SMS Marketing, Performance Marketing, G. Hari Kiran, SuMeera Solutions" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="G. Hari Kiran | Digital Marketing Expert & Growth Strategist" />
        <meta property="og:description" content="Strategizing growth through data-driven SEO and high-conversion marketing engines. View my portfolio and case studies." />
        <meta property="og:image" content="https://i.postimg.cc/59rp3LDd/Hari-Portfolio.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="G. Hari Kiran | Digital Marketing Expert & Growth Strategist" />
        <meta property="twitter:description" content="Strategizing growth through data-driven SEO and high-conversion marketing engines. View my portfolio and case studies." />
        <meta property="twitter:image" content="https://i.postimg.cc/59rp3LDd/Hari-Portfolio.png" />
      </Helmet>
      <Navbar />
      
      <main className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-[repeat(12,_minmax(120px,_auto))] gap-4 sm:gap-6">
          
          {/* Hero Section */}
          <div className="md:col-span-12 md:row-span-5 bento-card p-6 sm:p-10">
            <Hero />
          </div>

          {/* Skills Ticker */}
          <div className="md:col-span-12 md:row-span-1 rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <Marquee />
          </div>

          {/* Stats 1 */}
          <div className="md:col-span-3 md:row-span-2">
            <StatsCard value="10+" label="Brands" />
          </div>

          {/* Testimonial */}
          <div className="md:col-span-4 md:row-span-4 rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <TestimonialCard />
          </div>

          {/* Services */}
          <div className="md:col-span-5 md:row-span-5 bento-card">
            <Services />
          </div>

          {/* Stats 2 */}
          <div className="md:col-span-3 md:row-span-2">
            <StatsCard value="98%" label="Success Rate" accent />
          </div>
        </div>

        {/* Supporting Sections */}
        <div className="mt-16 sm:mt-24 space-y-24 mb-32">
          <WorkingProcess />
          <Blog />
          <Contact />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
