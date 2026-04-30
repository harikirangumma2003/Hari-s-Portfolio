import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('success');
      setMessage('Welcome to the inner circle! Check your inbox.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full mt-32 p-8 md:p-16 rounded-[40px] bg-primary text-white overflow-hidden relative"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
        <div className="max-w-xl text-center lg:text-left">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-black uppercase tracking-[4px] text-accent mb-4 block"
          >
            Stay Ahead of the Curve
          </motion.span>
          <h3 className="text-3xl md:text-5xl font-display font-black uppercase leading-[0.9] mb-6">
            Get growth hacks <br className="hidden md:block" /> <span className="text-accent italic">directly</span> in your inbox.
          </h3>

        </div>

        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="relative group">
            <div className={`relative transition-all duration-300 ${status === 'loading' ? 'opacity-50 pointer-events-none' : ''}`}>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR BEST EMAIL ADDRESS" 
                className="w-full pl-6 pr-44 py-6 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest focus:border-accent focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                disabled={status === 'loading' || status === 'success'}
              />
              <button 
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="absolute right-2 top-2 bottom-2 bg-accent text-white px-8 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all flex items-center gap-2 group-hover:shadow-[0_0_20px_rgba(255,107,0,0.3)] shadow-lg disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <>Subscribe <Send size={14} /></>
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -bottom-10 left-0 right-0 flex items-center justify-center gap-2 text-accent text-[10px] font-black uppercase tracking-widest"
                >
                  <CheckCircle2 size={14} /> {message}
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -bottom-10 left-0 right-0 flex items-center justify-center gap-2 text-red-400 text-[10px] font-black uppercase tracking-widest"
                >
                  <AlertCircle size={14} /> {message}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
          

        </div>
      </div>
    </motion.div>
  );
};
