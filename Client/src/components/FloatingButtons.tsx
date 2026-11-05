import { motion } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';

const FloatingButtons = () => {
  const phoneNumber = "919773405142";
  const whatsappMessage = encodeURIComponent("Hi! I'm interested in Eagle Byte's web development services.");

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* Call Button */}
      <motion.a
        href={`tel:+${phoneNumber}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shadow-lg neon-glow-purple"
        aria-label="Call us"
      >
        <Phone className="text-secondary-foreground" size={20} />
      </motion.a>

      {/* WhatsApp Button */}
      <motion.a
        href={`https://wa.me/${phoneNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg"
        style={{ boxShadow: '0 0 20px rgba(37, 211, 102, 0.4)' }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="text-white" size={20} />
      </motion.a>
    </div>
  );
};

export default FloatingButtons;
