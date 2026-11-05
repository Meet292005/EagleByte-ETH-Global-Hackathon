import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import CTASection from '@/components/CTASection';
import { Target, Eye, Heart, Award, Users, Rocket } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Excellence',
    description: 'We strive for excellence in every project, delivering solutions that exceed expectations.',
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'We are passionate about technology and creating impactful digital experiences.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We work closely with clients to understand their vision and bring it to life.',
  },
  {
    icon: Rocket,
    title: 'Innovation',
    description: 'We embrace new technologies and methodologies to deliver cutting-edge solutions.',
  },
];

const About = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "Eagle Byte",
      "founder": {
        "@type": "Person",
        "name": "Kartik Parmar",
        "jobTitle": "Founder & Lead Developer",
        "email": "kartikparmar.dev@gmail.com"
      },
      "foundingDate": "2021",
      "description": "Eagle Byte is a premium website and Agentic AI development company founded by Kartik Parmar, dedicated to turning ideas into digital reality.",
    }
  };

  return (
    <Layout>
      <SEOHead
        title="About Kartik Parmar & Eagle Byte"
        description="Kartik Parmar is the Founder and Lead Developer at Eagle Byte. Learn about his vision for Agentic AI and premium website development services in India."
        keywords="About Kartik Parmar, Kartik Parmar Profile, Founder of Eagle Byte, Kartik Parmar Developer, Eagle Byte Team"
        canonicalUrl="/about"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              About <span className="text-gradient">Eagle Byte</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              We are a passionate team of developers dedicated to turning ideas into digital reality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="section-padding bg-card/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-4xl font-bold mb-6">
                Our <span className="text-gradient">Story</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Eagle Byte was founded with a simple yet powerful vision: to bridge the gap between innovative ideas and exceptional digital solutions. What started as a one-person operation has grown into a dedicated team of skilled developers and designers.
                </p>
                <p>
                  Based in Gujarat, India, we have successfully delivered projects for clients across the global, from startups to established enterprises. Our commitment to quality, innovation, and client satisfaction has been the cornerstone of our growth.
                </p>
                <p>
                  Today, Eagle Byte stands as a trusted partner for businesses looking to establish or enhance their digital presence. We specialize in creating websites and intelligent AI systems that not only look stunning but also perform exceptionally well.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card p-8 space-y-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-xl mb-2">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To become a global leader in digital solutions, empowering businesses with technology that drives success.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-xl mb-2">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To deliver exceptional digital products that help businesses grow, innovate, and succeed in the digital age.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Meet the <span className="text-gradient">Founder</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto glass-card p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-40 h-40 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-primary/20 bg-muted">
                <img
                  src="/Kartik Parmar.jpeg"
                  alt="Kartik Parmar"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <h3 className="font-display text-3xl font-bold mb-2">Kartik Parmar</h3>
                <p className="text-primary font-medium mb-4">Founder & Lead Developer</p>
                <p className="text-muted-foreground mb-6">
                  Kartik Parmar is a passionate developer with expertise in modern web technologies. With a strong foundation in full-stack development, he leads Eagle Byte with a vision to create impactful digital solutions. His commitment to quality and innovation has helped numerous businesses achieve their digital goals.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="mailto:kartikparmar.dev@gmail.com"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    kartikparmar.dev@gmail.com
                  </a>
                  <span className="text-border">|</span>
                  <a
                    href="tel:+919773405142"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    +91 9773405142
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-card/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Our <span className="text-gradient">Values</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do at Eagle Byte.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      <CTASection />
    </Layout>
  );
};

export default About;
