import { motion } from "motion/react";
import { ArrowRight, Star } from "lucide-react";

export const TestimonialCard = () => {
  const testimonial = {
    name: "Gourav Panda",
    role: "E-commerce Manager, Yuvakart",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    text: "Hari demonstrates an excellent understanding of brand growth and his marketing strategies are both creative and results-driven. He is highly strategic and handles feedback with great professionalism.",
    rating: 5.0
  };

  return (
    <div className="h-full bg-primary text-white p-8 flex flex-col justify-between">
      <div>
        <span className="text-[10px] font-black uppercase tracking-[2px] text-highlight mb-6 block">Client Impact</span>
        <blockquote className="text-lg md:text-xl font-medium leading-tight opacity-90 italic">
          "{testimonial.text}"
        </blockquote>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden border border-white/20">
          <img 
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format,compress&q=80&w=200&fm=webp" 
            alt={testimonial.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-xs">
          <p className="font-black uppercase">{testimonial.name}</p>
          <p className="opacity-60">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
};

const BrandsAndTestimonials = () => {
  return null; // Content moved to App.tsx
};

export default BrandsAndTestimonials;
