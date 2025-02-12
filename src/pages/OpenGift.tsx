import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Heart, Music, Music2, Sparkles, X, Camera, Share2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ValentineGift {
  id: string;
  from_name: string;
  to_name: string;
  message: string;
  opened: boolean;
  images: string[];
}

const FloatingHearts = () => {
  const hearts = Array(30).fill(null);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            scale: 0,
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
            rotate: Math.random() * 360
          }}
          animate={{
            y: -100,
            scale: [0, 1, 0],
            x: `calc(${Math.random() * 100}vw + ${Math.sin(i) * 100}px)`,
            rotate: Math.random() * 360
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          className="absolute"
        >
          <Heart 
            className="w-6 h-6" 
            style={{ 
              color: `hsl(${340 + Math.random() * 40}, ${70 + Math.random() * 30}%, ${70 + Math.random() * 30}%)`
            }} 
          />
        </motion.div>
      ))}
    </div>
  );
};

const FloatingPhotos = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="fixed inset-0 pointer-events-auto">
        {images.map((src, index) => {
          const radius = 300; // Radius of the circular path
          const angle = (index / images.length) * 2 * Math.PI;
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;

          return (
            <motion.div
              key={src}
              className="absolute"
              style={{
                left: centerX,
                top: centerY,
                width: '180px',
                height: '180px',
              }}
              initial={{ 
                scale: 0,
                rotate: Math.random() * 360,
              }}
              animate={{
                scale: 1,
                rotate: [Math.random() * 15 - 7.5, Math.random() * -15 + 7.5],
                x: [
                  radius * Math.cos(angle),
                  radius * Math.cos(angle + 0.2),
                  radius * Math.cos(angle - 0.2),
                  radius * Math.cos(angle),
                ],
                y: [
                  radius * Math.sin(angle),
                  radius * Math.sin(angle + 0.2),
                  radius * Math.sin(angle - 0.2),
                  radius * Math.sin(angle),
                ],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                
              }}
              drag
              whileDrag={{
               scale:0.8
              }}
             
              whileHover={{ 
                scale: 1.2,
                zIndex: 50,
                transition: { duration: 0.3 }
              }}
              onClick={() => setSelectedImage(src)}
            >
              <motion.div
                className="w-full h-full rounded-2xl overflow-hidden shadow-2xl relative cursor-pointer"
                whileHover={{ scale: 1.1 }}
              >
                <img 
                  src={src} 
                  alt="Memory"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-4xl w-full"
              initial={{ scale: 0.9, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.9, rotate: 5 }}
            >
              <img
                src={selectedImage}
                alt="Selected memory"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <motion.button
                className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <X className="w-6 h-6 text-gray-800" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const MessageCard = ({ gift }: { gift: ValentineGift }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-md relative z-10 mx-4"
  >
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <Heart className="w-16 h-16 text-red-500 mx-auto" />
      </motion.div>
      <h2 className="text-4xl font-bold mt-4 text-gray-800 font-serif">
        Dear {gift.to_name},
      </h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-700 mt-6 text-xl leading-relaxed font-serif"
      >
        {gift.message}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-pink-600 mt-8 text-xl font-medium font-serif"
      >
        With love,<br />
        {gift.from_name}
      </motion.p>
    </motion.div>
  </motion.div>
);

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('https://cdn.pixabay.com/audio/2024/09/09/audio_a49654bc23.mp3');
    audioRef.current = audio;
    audio.loop = true;
    
    return () => {
      audio.pause();
      audio.remove();
    };
  }, []);

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        await audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Playback failed:', error);
    }
  };

  return (
    <motion.button
      onClick={toggleMusic}
      className="fixed top-4 right-4 z-50 bg-white/90 p-3 rounded-full shadow-lg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {isPlaying ? (
        <Music2 className="w-6 h-6 text-pink-500" />
      ) : (
        <Music className="w-6 h-6 text-gray-400" />
      )}
    </motion.button>
  );
};

const GiftBox = ({ onOpen }: { onOpen: () => void }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onOpen}
    className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 cursor-pointer text-center max-w-md w-full relative group"
  >
    <motion.div
      animate={{
        rotate: [0, 10, -10, 0],
        y: [0, -10, 0]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }}
      className="relative"
    >
      <Gift className="w-40 h-40 text-red-500 mx-auto transform transition-transform group-hover:scale-110" />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sparkles className="w-48 h-48 text-yellow-400 opacity-50" />
      </motion.div>
    </motion.div>
    <h2 className="text-4xl font-bold mt-8 text-gray-800 font-serif">
      For Someone Special
    </h2>
    <p className="text-gray-600 mt-4 text-xl">Tap to open your Valentine's gift</p>
  </motion.div>
);

export default function OpenGift() {
  const { id } = useParams();
  const [gift, setGift] = useState<ValentineGift | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGift = async () => {
      try {
        const { data, error } = await supabase
          .from('valentines_gifts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setGift(data);
        if (data.opened) setIsOpened(true);
      } catch (error) {
        console.error('Error fetching gift:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGift();
  }, [id]);

  const handleOpen = async () => {
    if (!gift) return;
    setIsOpened(true);
    try {
      await supabase
        .from('valentines_gifts')
        .update({ opened: true })
        .eq('id', gift.id);
    } catch (error) {
      console.error('Error updating gift:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-pink-200 flex items-center justify-center">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity }
          }}
        >
          <Heart className="w-20 h-20 text-pink-500" />
        </motion.div>
      </div>
    );
  }

  if (!gift) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-pink-200 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-3xl text-pink-600 bg-white/90 backdrop-blur-sm p-12 rounded-3xl shadow-2xl text-center"
        >
          <Heart className="w-24 h-24 mx-auto mb-6 text-pink-500" />
          Gift not found 💔
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-pink-200 flex items-center justify-center relative overflow-hidden">
      <BackgroundMusic />
      <FloatingHearts />
      
      <motion.div className="fixed top-4 left-4 z-50">
        <Camera className="w-6 h-6 text-pink-500" />
      </motion.div>
      
      <AnimatePresence>
        {!isOpened ? (
          <GiftBox onOpen={handleOpen} />
        ) : (
          <>
            <MessageCard gift={gift} />
            {gift.images && gift.images.length > 0 && (
              <FloatingPhotos images={gift.images} />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}