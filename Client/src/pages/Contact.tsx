import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { usePostHog } from 'posthog-js/react';
import { isPostHogConfigured } from '@/lib/analytics';

const contactSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  mobile: z.string().trim().min(10, 'Mobile number must be at least 10 digits').max(15, 'Mobile number must be less than 15 digits'),
  projectTitle: z.string().trim().min(2, 'Project title must be at least 2 characters').max(100, 'Project title must be less than 100 characters'),
  description: z.string().trim().min(20, 'Description must be at least 20 characters').max(2000, 'Description must be less than 2000 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { toast } = useToast();
  const posthog = usePostHog();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    mobile: '',
    projectTitle: '',
    description: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof ContactFormData] = error.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      toast({
        title: 'Validation Error',
        description: 'Please check the form fields and try again.',
        variant: 'destructive',
      });
      if (isPostHogConfigured) {
        posthog.capture('contact_form_validation_failed', {
          fields: Object.keys(fieldErrors),
        });
      }
      return;
    }

    // Submit to backend
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        if (isPostHogConfigured) {
          posthog.capture('contact_form_submitted', {
            project_title: formData.projectTitle,
          });
        }
        toast({
          title: 'Message Sent!',
          description: 'We will get back to you within 24 hours.',
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      if (isPostHogConfigured) {
        posthog.capture('contact_form_submit_failed');
      }
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "Eagle Byte",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9773405142",
        "email": "kartikparmar.dev@gmail.com",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      }
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Contact Kartik Parmar - Founder"
        description="Directly contact Kartik Parmar, Founder of Eagle Byte. Get a free consultation for your Agentic AI or website development project. Call +91 9773405142."
        keywords="Contact Kartik Parmar, Kartik Parmar Email, Kartik Parmar Phone Number, Hire Kartik Parmar, Eagle Byte Contact"
        canonicalUrl="/contact"
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
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Ready to start your project? Contact us for a free consultation and quote.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-card/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-display text-3xl font-bold mb-6">
                  Contact <span className="text-gradient">Information</span>
                </h2>
                <p className="text-muted-foreground">
                  Reach out to us through any of these channels. We typically respond within 24 hours.
                </p>
              </div>

              <div className="space-y-6">
                <a
                  href="tel:+919773405142"
                  className="flex items-center gap-4 p-4 glass-card hover:neon-glow transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="text-muted-foreground">+91 9773405142</div>
                  </div>
                </a>

                <a
                  href="mailto:kartikparmar.dev@gmail.com"
                  className="flex items-center gap-4 p-4 glass-card hover:neon-glow transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-muted-foreground">kartikparmar.dev@gmail.com</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 glass-card">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold">Location</div>
                    <div className="text-muted-foreground">Gujarat, India</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 glass-card">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Response Time</div>
                    <div className="text-muted-foreground">Within 24 hours</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              {isSubmitted ? (
                <div className="glass-card p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
                  <h3 className="font-display text-2xl font-bold mb-4">Thank You!</h3>
                  <p className="text-muted-foreground mb-6">
                    Your message has been sent successfully. We will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        fullName: '',
                        email: '',
                        mobile: '',
                        projectTitle: '',
                        description: '',
                      });
                    }}
                    className="btn-secondary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                  <h3 className="font-display text-2xl font-bold mb-6">
                    Request a <span className="text-gradient">Free Quote</span>
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`form-input ${errors.fullName ? 'border-destructive' : ''}`}
                        placeholder="Your full name"
                      />
                      {errors.fullName && (
                        <p className="text-destructive text-sm mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-input ${errors.email ? 'border-destructive' : ''}`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="mobile" className="block text-sm font-medium mb-2">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className={`form-input ${errors.mobile ? 'border-destructive' : ''}`}
                        placeholder="+91 XXXXX XXXXX"
                      />
                      {errors.mobile && (
                        <p className="text-destructive text-sm mt-1">{errors.mobile}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="projectTitle" className="block text-sm font-medium mb-2">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        id="projectTitle"
                        name="projectTitle"
                        value={formData.projectTitle}
                        onChange={handleChange}
                        className={`form-input ${errors.projectTitle ? 'border-destructive' : ''}`}
                        placeholder="Project Title"
                      />
                      {errors.projectTitle && (
                        <p className="text-destructive text-sm mt-1">{errors.projectTitle}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2">
                      Project Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      className={`form-input resize-none ${errors.description ? 'border-destructive' : ''}`}
                      placeholder="Tell us about your project, goals, and requirements..."
                    />
                    {errors.description && (
                      <p className="text-destructive text-sm mt-1">{errors.description}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
