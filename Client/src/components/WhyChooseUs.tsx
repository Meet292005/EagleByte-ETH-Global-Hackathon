import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Shield, Clock, Users, Award, HeartHandshake } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed with 90+ Google Lighthouse scores.',
    color: 'primary',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security for all your digital assets.',
    color: 'secondary',
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    description: 'We respect deadlines and deliver projects on schedule.',
    color: 'accent',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    description: '24/7 support to help you with any issues or questions.',
    color: 'primary',
  },
  {
    icon: Award,
    title: 'Quality Assured',
    description: 'Rigorous testing ensures bug-free, polished products.',
    color: 'secondary',
  },
  {
    icon: HeartHandshake,
    title: 'Client Focused',
    description: 'Your success is our priority. We go the extra mile.',
    color: 'accent',
  },
];

const WhyChooseUs = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10]);

  return (
    <section ref={sectionRef} className="section-padding bg-card/30 overflow-hidden">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.h2
            className="font-display text-4xl md:text-5xl font-bold mb-6"
            style={{ rotateX, transformPerspective: 1000 }}
          >
            Why Choose <span className="text-gradient">Eagle Byte</span>?
          </motion.h2>
          <p className="text-lg text-muted-foreground">
            We combine technical excellence with creative innovation to deliver outstanding results.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50, rotateX: 20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: 'spring',
                stiffness: 100,
              }}
              whileHover={{
                scale: 1.03,
                y: -8,
                boxShadow: '0 20px 40px -20px hsl(var(--primary) / 0.3)',
              }}
              className="flex gap-4 p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors cursor-default"
              style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
            >
              <motion.div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${feature.color === 'primary'
                  ? 'bg-primary/20'
                  : feature.color === 'secondary'
                    ? 'bg-secondary/20'
                    : 'bg-accent/20'
                  }`}
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className={`w-6 h-6 ${feature.color === 'primary'
                  ? 'text-primary'
                  : feature.color === 'secondary'
                    ? 'text-secondary'
                    : 'text-accent'
                  }`} />
              </motion.div>
              <div>
                <motion.h3
                  className="font-display font-semibold text-lg mb-2"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {feature.title}
                </motion.h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating background element with parallax */}
        <motion.div
          style={{ y }}
          className="absolute -right-20 top-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none"
        />
      </div>
    </section>
  );
};

export default WhyChooseUs;
