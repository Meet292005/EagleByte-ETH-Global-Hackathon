import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Web3 Escrow Protocol', path: '/escrow' },
    { name: 'Pay Invoice', path: '/pay' },
    { name: 'Admin Portal', path: '/admin' },
    { name: 'Contact', path: '/contact' },
  ];



  return (
    <footer className="bg-card/50 border-t border-border">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <img src="/LOGO.jpeg" alt="Eagle Byte Logo" className="w-12 h-12 rounded-xl object-contain bg-white/10 p-1" />
              <span className="font-display font-bold text-xl text-foreground">
                Eagle<span className="text-gradient">Byte</span>
              </span>
            </Link>
            <p className="text-muted-foreground">
              Turning ideas into digital reality. We build powerful websites and intelligent AI systems that drive business growth.
            </p>
            <div className="flex gap-4">

              <a
                href="https://www.linkedin.com/in/kartik-parmar-/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://github.com/kartik-parmar007"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="Github"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+919773405142"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone size={18} className="text-primary" />
                  +91 9773405142
                </a>
              </li>
              <li>
                <a
                  href="mailto:kartikparmar.dev@gmail.com"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail size={18} className="text-primary" />
                  kartikparmar.dev@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin size={18} className="text-primary mt-1" />
                <span>Gujarat, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex justify-center items-center">
          <p className="text-muted-foreground text-sm text-center">
            © {currentYear} Eagle Byte. All rights reserved. Founded by Kartik Parmar.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
