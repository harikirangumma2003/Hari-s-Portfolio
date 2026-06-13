import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

interface FAQItem {
  question: string;
  answer: string;
  id: string;
}

const faqData: FAQItem[] = [
  {
    id: "faq-1",
    question: "Who is the best digital marketing expert in Jamshedpur?",
    answer: "G. Hari Kiran is recognized as a leading digital marketing expert and growth strategist in Jamshedpur, Jharkhand. Currently scaling international brands at SuMeera Solutions, Hari combines advanced semantic SEO, performance-focused lifecycle marketing, and automated email flows to maximize ROI."
  },
  {
    id: "faq-2",
    question: "What services does G. Hari Kiran offer as an SEO Consultant in Jharkhand?",
    answer: "As an SEO Specialist, I deliver high-impact organic search services, including local SEO optimization, technical site audits, Google Analytics and Search Console tracking, and semantic keyword mapping. I also specialize in retention email automation (email flows, lifecycle funnels) to nurture leads into loyal buyers."
  },
  {
    id: "faq-3",
    question: "How does Local SEO in Jamshedpur benefit steel, EdTech, or SaaS businesses?",
    answer: "Local SEO positions your brand at the exact moment prospect customers search for digital services in Jamshedpur or Ranchi. By mapping entities correctly, configuring structured semantic schemas, and optimizing for Google Maps, local businesses can dominate local search results and bypass high paid advertising costs."
  },
  {
    id: "faq-4",
    question: "How do you measure Digital Marketing and SEO success?",
    answer: "I focus strictly on bottom-line business metrics: organic search traffic growth, high-intent keyword rankings, cost-per-lead reduction, user retention, and customer lifetime value (LTV) through automated email sequences. Everything is transparently tracked via certified Google Analytics reporting."
  }
];

export const FAQ = () => {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  // Construct Google FAQPage Structured Markup Schema dynamically
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <section id="faq" className="mt-20 md:mt-40">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Column: Heading & CTA */}
        <div className="w-full lg:w-1/3">
          <span className="text-[10px] font-black uppercase tracking-[4px] text-accent mb-4 block">
            Common Inquiries
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase leading-[0.9] mb-6">
            Frequently <br />
            <span className="text-accent italic">Asked</span> Questions
          </h2>
          <p className="text-muted leading-relaxed mb-8 text-sm md:text-base">
            Get transparent answers regarding SEO practices, growth execution timelines, local analytics reporting, and customized retention marketing campaigns.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-md hover:shadow-primary/10"
          >
            Ask a Custom Question
          </a>
        </div>

        {/* Right Column: Interactive Accordion */}
        <div className="w-full lg:w-2/3 space-y-4">
          {faqData.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bento-card p-0 overflow-hidden border border-primary/5 hover:border-accent/15 transition-all duration-300 bg-white"
              >
                <h3>
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between text-base font-display font-black uppercase tracking-tight gap-4 text-primary hover:text-accent transition-colors focus:outline-none"
                    aria-expanded={isOpen}
                    aria-controls={faq.id}
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle size={16} className="text-accent/60 flex-shrink-0" />
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown size={18} className="text-muted" />
                    </motion.div>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={faq.id}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-muted leading-relaxed border-t border-primary/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
