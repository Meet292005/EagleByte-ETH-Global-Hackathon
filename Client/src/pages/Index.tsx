import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import HeroSection from '@/components/HeroSection';
import ServicesPreview from '@/components/ServicesPreview';
import WhyChooseUs from '@/components/WhyChooseUs';

import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Eagle Byte",
    "url": "https://www.eaglebyte.in",
    "description": "Eagle Byte - Premium website and Agentic AI development services by Kartik Parmar. We build powerful websites and intelligent AI systems that drive business growth.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.eaglebyte.in/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Kartik Parmar - Founder of Eagle Byte"
        description="Kartik Parmar, Founder of Eagle Byte, delivers premium Agentic AI and website development services. Contact Kartik for innovative digital solutions in India."
        keywords="Kartik Parmar, Founder of Eagle Byte, Kartik Parmar Eagle Byte, Is Kartik Parmar Founder of Eagle Byte, Kartik Parmar India, Kartik Parmar Web Developer, Agentic AI, AI automation"
        canonicalUrl="/"
        structuredData={structuredData}
      />
      <HeroSection />
      <ServicesPreview />
      <WhyChooseUs />

      <FAQSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
