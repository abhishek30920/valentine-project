import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Copy, CheckCircle2, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';

const messageTemplates = [
  "Every moment with you feels like magic. You make my heart smile in ways I never knew possible.",
  "You're not just my Valentine, you're my favorite notification, my best adventure, and my happiest story.",
  "In a world full of ordinary moments, you make every second extraordinary just by being you.",
  "My heart beats in emoji when I think of you! 💝 You're my favorite person to bug with random messages.",
  "If love was a playlist, you'd be my favorite song on repeat. Forever my #1 hit!",
  "You're the missing piece to my puzzle, the wifi to my device, the avocado to my toast! 🥑",
];

const FloatingHearts = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            scale: 0,
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100
          }}
          animate={{
            y: -100,
            scale: [0, 1, 0],
            x: `calc(${Math.random() * 100}vw + ${Math.sin(i) * 50}px)`,
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
          className="absolute"
        >
          <Heart 
            className="w-4 h-4" 
            style={{ 
              color: `hsl(${340 + Math.random() * 40}, ${70 + Math.random() * 30}%, ${70 + Math.random() * 30}%)`
            }} 
          />
        </motion.div>
      ))}
    </div>
  );
};

export default function CreateGift() {
    const [fromName, setFromName] = useState('');
    const [toName, setToName] = useState('');
    const [message, setMessage] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [giftLink, setGiftLink] = useState('');
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * messageTemplates.length);
    setMessage(messageTemplates[randomIndex]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Upload images first
      const imageUrls = await Promise.all(
        images.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError, data } = await supabase.storage
            .from('valentine-images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('valentine-images')
            .getPublicUrl(filePath);

          return publicUrl;
        })
      );

      // Create the gift with image URLs
      const { data, error } = await supabase
        .from('valentines_gifts')
        .insert([
          {
            from_name: fromName,
            to_name: toName,
            message: message,
            images: imageUrls,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const giftUrl = `${window.location.origin}/gift/${data.id}`;
      setGiftLink(giftUrl);
    } catch (error) {
      console.error('Error creating gift:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(giftLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (giftLink) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-pink-200 flex items-center justify-center p-4 relative overflow-hidden">
        <FloatingHearts />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center relative z-10"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Heart className="w-16 h-16 text-red-500 mx-auto" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mt-4">Your gift is ready! 🎉</h2>
            <p className="text-gray-600 mt-2 mb-6">Share this link with {toName}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 p-4 rounded-lg mb-6 relative shadow-inner"
          >
            <p className="text-gray-700 break-all">{giftLink}</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={copyToClipboard}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg"
          >
            {copied ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Copied!
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <Copy className="w-5 h-5" />
                Copy Link
              </motion.div>
            )}
          </motion.button>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={() => {
              setGiftLink('');
              setFromName('');
              setToName('');
              setMessage('');
            }}
            className="mt-6 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-4 h-4" />
            Create another gift
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-pink-200 flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingHearts />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="inline-block"
          >
            <Heart className="w-16 h-16 text-red-500 mx-auto" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mt-4">Create a Valentine's Gift</h1>
            <p className="text-gray-600 mt-2">Share love with someone special</p>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <input
              type="text"
              placeholder="Your Name"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-pink-200 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 bg-white/80"
              required
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <input
              type="text"
              placeholder="Their Name"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-pink-200 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 bg-white/80"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <textarea
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-pink-200 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 min-h-[120px] bg-white/80"
              required
            />
            <motion.button
              type="button"
              onClick={getRandomMessage}
              className="mt-2 text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center gap-1 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-4 h-4" />
              Get a random message
            </motion.button>
          </motion.div>

        
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ImageUpload
              images={images}
              setImages={setImages}
              maxImages={3}
            />
          </motion.div>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isCreating}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg"
          >
            <Send className="w-5 h-5" />
            {isCreating ? 'Creating...' : 'Create Gift'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}