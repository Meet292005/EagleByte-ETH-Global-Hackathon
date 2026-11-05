import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Globe, Cpu, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: 'Website Development',
    description: 'Custom, responsive, SEO-optimized, and high-performance websites built for growth.',
    color: 'primary',
  },
  {
    icon: Cpu,
    title: 'Agentic AI & Automation',
    description: 'Smart AI agents, CRM integration, and automated workflows to streamline operations.',
    color: 'secondary',
  },
];

const ServicesPreview = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const headerScale = useTransform(scrollYProgress, [0, 0.3], [0.9, 1]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0.5, 1]);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Parallax background orbs */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute -left-32 top-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [50, -50]) }}
        className="absolute -right-32 bottom-1/4 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none"
      />

      <div className="container-custom relative">
        {/* Section Header with parallax scale */}
        <motion.div
          style={{ scale: headerScale, opacity: headerOpacity }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.h2
            className="font-display text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our <span className="text-gradient">Services</span>
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We offer comprehensive digital solutions to help your business thrive in the modern world.
          </motion.p>
        </motion.div>

        {/* Services Grid with 3D hover effects */}
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50, rotateY: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                type: 'spring',
                stiffness: 80,
              }}
              whileHover={{
                scale: 1.02,
                rotateY: 5,
                rotateX: -5,
                z: 50,
                boxShadow: `0 25px 50px -12px hsl(var(--${service.color}) / 0.25)`,
              }}
              className="service-card group relative overflow-hidden"
              style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
            >
              {/* Animated gradient border */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, hsl(var(--${service.color}) / 0.2), transparent, hsl(var(--${service.color}) / 0.1))`,
                }}
              />

              <div className="relative z-10">
                <motion.div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${service.color === 'primary'
                    ? 'bg-primary/20 text-primary'
                    : service.color === 'secondary'
                      ? 'bg-secondary/20 text-secondary'
                      : 'bg-accent/20 text-accent'
                    }`}
                  whileHover={{
                    rotate: [0, -15, 15, 0],
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <service.icon size={28} />
                </motion.div>
                <motion.h3
                  className="font-display text-xl font-semibold mb-3 group-hover:text-gradient transition-all"
                  whileHover={{ x: 5 }}
                >
                  {service.title}
                </motion.h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>

              {/* Floating particles on hover */}
              <motion.div
                className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/50"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA with micro-animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/services" className="btn-secondary inline-flex items-center gap-2 group">
              View All Services
              <motion.span
                className="inline-block"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={18} />
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesPreview;
