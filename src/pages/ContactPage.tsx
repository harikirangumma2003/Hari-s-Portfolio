import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle, Loader2, MapPin, Linkedin } from 'lucide-react';
import { SEO } from '../components/SEO';
import { db, auth } from '@/src/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Growth Strategy',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateField = (name: string, value: string) => {
    let error = '';
    if (!value.trim()) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = 'Please enter a valid email address';
      }
    } else if (name === 'name' && value.trim().length < 2) {
      error = 'Name must be at least 2 characters';
    } else if (name === 'message' && value.trim().length < 10) {
      error = 'Message must be at least 10 characters';
    }
    return error;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate in real-time if already touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
      newTouched[key] = true;
    });

    setErrors(newErrors);
    setTouched(newTouched);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    const pathForWrite = 'contacts';
    try {
      await addDoc(collection(db, pathForWrite), {
        ...formData,
        createdAt: serverTimestamp()
      });
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: 'Growth Strategy', message: '' });
      setTouched({});
      setErrors({});
    } catch (error) {
      setSubmitStatus('error');
      // Always include this error handler for Firestore operations
      handleFirestoreError(error, OperationType.WRITE, pathForWrite);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <SEO 
        title="Contact" 
        description="Get in touch with G. Hari Kiran for marketing consulting, growth strategy, or project inquiries."
      />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Side: Contact Info */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-accent font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-4 block">
                Let's Collaborate
              </span>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-black uppercase leading-[1] md:leading-[0.85] mb-8">
                Get <br /> <span className="text-accent italic">In Touch</span>
              </h1>
              <p className="text-muted text-lg max-w-md mx-auto lg:mx-0 mb-12">
                Have a project in mind? Looking to scale your brand? Or just want to say hi? Drop me a message and I'll get back to you within 24 hours.
              </p>

              <div className="space-y-8 flex flex-col items-center lg:items-start">
                <div className="flex flex-col sm:flex-row items-center lg:items-center gap-6 group text-center sm:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-1">Email Me</span>
                    <a href="mailto:harikirangumma2003@gmail.com" className="text-base sm:text-xl font-bold hover:text-accent transition-colors break-all">
                      harikirangumma2003@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center lg:items-center gap-6 group text-center sm:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-1">Location</span>
                    <span className="text-base sm:text-xl font-bold">Jamshedpur, India</span>
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-16 border-t border-black/5 flex flex-col items-center lg:items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-6">Socials</span>
                <div className="flex gap-4">
                  {[
                    { icon: Linkedin, href: "https://linkedin.com/in/harikirangumma" },
                    { 
                      icon: () => (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2914a.077.077 0 01-.0066.1277 12.2986 12.2986 0 01-1.8722.8923.0766.0766 0 00-.0416.1061c.3628.6912.7663 1.3561 1.226 1.9942a.0775.0775 0 00.0842.028c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
                        </svg>
                      ), 
                      href: "#" // Replace with your actual Discord link
                    }
                  ].map((social, i) => (
                    <a 
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center hover:bg-accent transition-colors"
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-black text-white p-8 md:p-12 rounded-[40px] shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="JOHN DOE"
                    className={`w-full bg-white/5 border ${touched.name && errors.name ? 'border-red-500' : 'border-white/10'} rounded-2xl px-6 py-4 focus:outline-none focus:border-accent focus:bg-white/10 transition-all font-bold text-sm uppercase tracking-widest placeholder:text-white/10`}
                  />
                  <AnimatePresence>
                    {touched.name && errors.name && (
                      <motion.span 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 block"
                      >
                        {errors.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="HELLO@DOMAIN.COM"
                    className={`w-full bg-white/5 border ${touched.email && errors.email ? 'border-red-500' : 'border-white/10'} rounded-2xl px-6 py-4 focus:outline-none focus:border-accent focus:bg-white/10 transition-all font-bold text-sm uppercase tracking-widest placeholder:text-white/10`}
                  />
                  <AnimatePresence>
                    {touched.email && errors.email && (
                      <motion.span 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 block"
                      >
                        {errors.email}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Subject</label>
                <div className="relative">
                  <select 
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-accent focus:bg-white/10 transition-all font-bold text-sm uppercase tracking-widest appearance-none cursor-pointer"
                  >
                    <option value="Growth Strategy" className="bg-neutral-900">GROWTH STRATEGY</option>
                    <option value="Consultation" className="bg-neutral-900">CONSULTATION</option>
                    <option value="Project Inquiry" className="bg-neutral-900">PROJECT INQUIRY</option>
                    <option value="Other" className="bg-neutral-900">OTHER</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Your Message</label>
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={5}
                  placeholder="TELL ME ABOUT YOUR GOALS..."
                  className={`w-full bg-white/5 border ${touched.message && errors.message ? 'border-red-500' : 'border-white/10'} rounded-2xl px-6 py-4 focus:outline-none focus:border-accent focus:bg-white/10 transition-all font-bold text-sm uppercase tracking-widest placeholder:text-white/10 resize-none`}
                ></textarea>
                <AnimatePresence>
                  {touched.message && errors.message && (
                    <motion.span 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 block"
                    >
                      {errors.message}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Send Message
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>

              <AnimatePresence mode="wait">
                {submitStatus === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center gap-2 text-accent font-black uppercase tracking-widest text-xs pt-4"
                  >
                    <CheckCircle2 size={16} /> Message sent successfully!
                  </motion.div>
                )}
                {submitStatus === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center gap-2 text-red-500 font-black uppercase tracking-widest text-xs pt-4"
                  >
                    <AlertCircle size={16} /> Failed to send message. Please try again.
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
