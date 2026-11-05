import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Parallax Hero Background */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: bgY,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />

      {/* Floating 3D Elements with Parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orb 1 - Parallax */}
        <motion.div
          style={{ y: orb1Y }}
          className="absolute top-1/4 left-[10%]"
        >
          <motion.div
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotateZ: [0, 10, 0],
              rotateX: [0, 15, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 blur-sm"
            style={{ transformStyle: 'preserve-3d' }}
          />
        </motion.div>

        {/* Floating Orb 2 - Parallax */}
        <motion.div
          style={{ y: orb2Y }}
          className="absolute top-1/3 right-[15%]"
        >
          <motion.div
            animate={{
              y: [20, -20, 20],
              x: [10, -10, 10],
              rotateY: [0, 20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-secondary/30 to-secondary/5 blur-md"
            style={{ transformStyle: 'preserve-3d' }}
          />
        </motion.div>

        {/* Floating Orb 3 - Parallax */}
        <motion.div
          style={{ y: orb3Y }}
          className="absolute bottom-1/4 left-[20%]"
        >
          <motion.div
            animate={{
              y: [-15, 25, -15],
              scale: [1, 1.1, 1],
              rotateZ: [0, -15, 0],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 blur-sm"
          />
        </motion.div>

        {/* 3D Rotating Cube */}
        <motion.div
          style={{ y: orb1Y }}
          className="absolute top-[60%] right-[10%] perspective-1000"
        >
          <motion.div
            animate={{
              rotateX: [0, 360],
              rotateY: [0, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-0 border-2 border-primary/30 bg-primary/5"
              style={{ transform: 'translateZ(32px)' }} />
            <div className="absolute inset-0 border-2 border-primary/30 bg-primary/5"
              style={{ transform: 'rotateY(180deg) translateZ(32px)' }} />
            <div className="absolute inset-0 border-2 border-primary/30 bg-primary/5"
              style={{ transform: 'rotateY(90deg) translateZ(32px)' }} />
            <div className="absolute inset-0 border-2 border-primary/30 bg-primary/5"
              style={{ transform: 'rotateY(-90deg) translateZ(32px)' }} />
          </motion.div>
        </motion.div>

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeOut',
            }}
            className="absolute w-2 h-2 rounded-full bg-primary/60"
            style={{
              left: `${15 + i * 15}%`,
              bottom: '10%',
            }}
          />
        ))}

        {/* Grid Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(var(--primary) / 0.3)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <motion.div
        className="container-custom relative z-10"
        style={{ y: textY, opacity, scale }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge with hover effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px hsl(var(--primary) / 0.3)' }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 cursor-default"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm text-muted-foreground">Founded by Kartik Parmar</span>
          </motion.div>

          {/* Main Headline with stagger animation */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Transform Your{' '}
            </motion.span>
            <br className="md:hidden" />
            <motion.span
              className="text-gradient inline-block"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
            >
              Digital Presence
            </motion.span>
            <br className="hidden md:block" />
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {' '}Today
            </motion.span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Eagle Byte – Turning Ideas into Digital Reality.
            <br className="hidden md:block" />
            Premium website and Agentic AI development services from India.
          </motion.p>

          {/* CTA Buttons with micro-interactions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/contact" className="btn-primary flex items-center gap-2 pulse-glow">
                Get Free Quote
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={18} />
                </motion.span>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/services" className="btn-secondary">
                View Our Services
              </Link>
            </motion.div>
          </motion.div>


        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center pt-2"
        >
          <motion.div
            className="w-1.5 h-3 bg-primary rounded-full"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
