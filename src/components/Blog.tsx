import { motion } from "motion/react";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";

const Blog = () => {
  const posts = blogPosts.slice(0, 3);

  return (
    <section id="blog" className="py-12">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end text-center md:text-left mb-12 gap-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[2px] text-accent mb-4 block">Insights</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl leading-tight">Latest From The Studio</h2>
        </div>
        <Link to="/blog" className="w-full sm:w-auto btn-primary flex items-center bg-primary hover:bg-accent px-8 py-3 rounded-full text-white text-[10px] font-black uppercase tracking-widest transition-all">
          Browse All <ArrowRight className="ml-2" size={16}/>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="group cursor-pointer bento-card border border-primary/5 hover:border-accent/30 transition-all flex flex-col h-full"
          >
            <Link to={`/blog/${post.slug}`} className="flex flex-col h-full">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] mb-6">
                <img
                  src={post.image}
                  alt={`Cover image for ${post.title}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1.5 rounded-full text-[10px] font-black font-display uppercase tracking-widest">
                  {post.category}
                </div>
              </div>
              
              <h3 className="text-lg font-display font-black mb-auto leading-tight group-hover:text-accent transition-colors uppercase">
                {post.title}
              </h3>
              
              <div className="flex items-center gap-2 text-muted text-[10px] font-black uppercase tracking-widest mt-6 pt-6 border-t border-primary/5">
                <Calendar size={12} className="text-accent" />
                {post.date}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Blog;
