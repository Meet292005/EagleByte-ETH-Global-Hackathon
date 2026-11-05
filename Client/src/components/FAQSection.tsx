import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What services does Eagle Byte offer?',
    answer: 'Eagle Byte offers a premium suite of digital services including Website Development and Agentic AI & Automation Systems. We are experts in building high-performance, scalable websites and converting legacy systems into modern, intelligent digital assets.',
  },
  {
    question: 'Who is Kartik Parmar?',
    answer: 'Kartik Parmar is the visionary founder and lead developer of Eagle Byte. With deep expertise in full-stack development and agentic AI, Kartik leads a dedicated team of engineers to deliver world-class digital solutions. His focus is on combining technical excellence with innovative design to solve complex business challenges.',
  },
  {
    question: 'How long does it take to complete a project?',
    answer: 'Project timelines vary based on complexity and scope. A standard professional website typically takes 2-4 weeks, while complex AI automation systems usually range from 4-12 weeks. We follow an agile development process to ensure timely delivery and regular updates throughout the project lifecycle.',
  },
  {
    question: 'What is your pricing structure?',
    answer: 'We offer flexible pricing models tailored to your specific needs. This can range from fixed-price contracts for well-defined projects to hourly rates or monthly retainers for ongoing development and support. We prioritize transparency and provide detailed, itemized quotes before any work begins.',
  },
  {
    question: 'Do you provide maintenance after launch?',
    answer: 'Yes, we believe in building long-term partnerships. We offer comprehensive maintenance and support packages that include security monitoring, performance optimization, content updates, and technical troubleshooting. We ensure your digital platform remains secure, up-to-date, and fully functional 24/7.',
  },
  {
    question: 'Does Eagle Byte handle SEO and performance?',
    answer: 'Absolutely. Performance and SEO are at the core of our development philosophy. Every website and AI system we build is optimized for speed, mobile responsiveness, and search engine visibility. We implement technical SEO best practices, schema markup, and core web vitals optimization to ensure your site ranks well and converts visitors.',
  },
];

const FAQSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <section ref={sectionRef} className="section-padding bg-card/30 relative overflow-hidden">
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Parallax background elements */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute -left-40 top-1/3 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-30, 30]) }}
        className="absolute -right-40 bottom-1/3 w-96 h-96 rounded-full bg-secondary/5 blur-3xl pointer-events-none"
      />

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.h2
            className="font-display text-4xl md:text-5xl font-bold mb-6"
            whileInView={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            Frequently Asked <span className="text-gradient">Questions</span>
          </motion.h2>
          <p className="text-lg text-muted-foreground">
            Got questions? We've got answers. If you don't find what you're looking for, feel free to contact us.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 100,
                }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="glass-card px-6 border-none overflow-hidden group"
                >
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors py-6">
                      <span className="flex items-center gap-3">
                        <motion.span
                          className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold"
                          whileHover={{ scale: 1.1, rotate: 10 }}
                        >
                          {index + 1}
                        </motion.span>
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                  </motion.div>
                  <AccordionContent className="text-muted-foreground pb-6 pl-11">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {faq.answer}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
