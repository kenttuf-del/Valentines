
import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Stars, Sparkles, MessageSquareHeart, Gift, PartyPopper as Party } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// --- Types ---

type AppStage = 'asking' | 'accepted' | 'final';

// --- Components ---

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<{ id: number; left: number; size: number; duration: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts(prev => [
        ...prev.slice(-20),
        {
          id: Date.now(),
          left: Math.random() * 100,
          size: Math.random() * (30 - 10) + 10,
          duration: Math.random() * (8 - 4) + 4
        }
      ]);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="heart-float text-pink-300 opacity-60"
          style={{
            left: `${heart.left}%`,
            width: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
          }}
        >
          <Heart fill="currentColor" size={heart.size} />
        </div>
      ))}
    </div>
  );
};

const SweetLetter: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [letterContent, setLetterContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchLetter = useCallback(async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Write a very short, sweet, and concise Valentine's Day message for someone called 'Hon'. It should be only 2 sentences. Include the phrase 'so lucky to have you in my life, Hon'. Start with 'Hi hon,'",
        config: {
          temperature: 0.8,
        }
      });
      setLetterContent(response.text || 'Hi hon, you make my life so much brighter just by being in it. I am so lucky to have you in my life, Hon.');
    } catch (error) {
      setLetterContent('Hi hon, I am so lucky to have you in my life. You have a heart of gold and I love you more every day.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLetter();
  }, [fetchLetter]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-12 border-4 border-pink-200 transform animate-[fadeIn_0.5s_ease-out] flex flex-col items-center">
        <div className="flex justify-center mb-6">
          <MessageSquareHeart className="text-pink-500 w-12 h-12 md:w-16 md:h-16 animate-bounce" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-cursive text-pink-600 text-center mb-6">Dear Hon</h2>
        
        <div className="text-slate-700 leading-relaxed text-base md:text-lg space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar italic text-center w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-pink-400">Writing a quick note for you...</p>
            </div>
          ) : (
            letterContent.split('\n').map((para, i) => para.trim() && <p key={i}>{para}</p>)
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-pink-100 flex justify-center w-full">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-pink-400 hover:text-pink-600 transition-colors font-semibold"
          >
            <Heart size={16} fill="currentColor" /> Close with Love
          </button>
        </div>
      </div>
    </div>
  );
};

const ValentineRequest = () => {
  const [stage, setStage] = useState<AppStage>('asking');
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });

  const noMessages = [
    "No",
    "Sure ka? 🥺",
    "Really really sure??",
    "Think again! ❤️",
    "Ma sad ko... 💔",
    "Mag-potato corner man ta! 💐",
    "Hon, please? 👉👈",
    "You're breaking my heart!",
    "Click Yes for a surprise!",
    "Error 404: No Button Broken",
    "Just click yes already! 😂",
    "Sige na please",
    "I can do this all day!",
    "Wala nakay choice 😉",
  ];

  const handleNoClick = () => {
    setNoCount(prev => prev + 1);
    if (noCount >= 4) {
      moveNoButton();
    }
  };

  const moveNoButton = () => {
    const margin = 80;
    const x = Math.random() * (window.innerWidth - margin * 2) - (window.innerWidth / 2) + margin;
    const y = Math.random() * (window.innerHeight - margin * 2) - (window.innerHeight / 2) + margin;
    setNoPosition({ x, y });
  };

  const getYesButtonSize = () => {
    const baseSize = 1;
    const increment = noCount * 0.2;
    return Math.min(baseSize + increment, 5); 
  };

  const getNoButtonOpacity = () => {
    if (noCount > 15) return 0.1;
    if (noCount > 10) return 0.5;
    return 1;
  };

  if (stage === 'accepted') {
    return (
      <div className="min-h-screen">
        <FloatingHearts />
        <SweetLetter onBack={() => setStage('final')} />
      </div>
    );
  }

  if (stage === 'final') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative z-10 overflow-hidden">
        <FloatingHearts />
        <div className="text-center space-y-6 bg-white/60 backdrop-blur-lg p-10 rounded-3xl border-2 border-white/50 shadow-2xl max-w-lg transform animate-[scaleIn_0.5s_ease-out] flex flex-col items-center">
          <div className="relative">
            <Sparkles className="w-16 h-16 text-yellow-500 animate-[bounce_2s_infinite]" />
            <Heart className="absolute -top-2 -right-2 w-8 h-8 text-pink-500 fill-pink-500 animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-cursive text-pink-600">Yay, hon!</h2>
          <p className="text-xl md:text-2xl font-semibold text-slate-700 leading-relaxed">
            Thank you for saying yes! <br/>
            Can't wait for our Valentine's date on Feb 14! 🌹
          </p>
          <div className="flex justify-center gap-3 mt-4">
             <Heart className="text-pink-500 fill-pink-500 w-8 h-8" />
             <Heart className="text-pink-400 fill-pink-400 w-10 h-10 animate-bounce" />
             <Heart className="text-pink-500 fill-pink-500 w-8 h-8" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 overflow-hidden">
      <FloatingHearts />
      
      <div className="flex flex-col items-center justify-center w-full max-w-2xl">
        <div className="text-center space-y-6 md:space-y-8 bg-white/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border-2 border-white/50 shadow-xl w-full flex flex-col items-center">
          <div className="relative inline-block">
            <Heart className="w-16 h-16 md:w-24 md:h-24 text-pink-500 animate-pulse fill-pink-500" />
            <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-spin" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-7xl font-cursive text-pink-600 drop-shadow-sm">
              Hi hon!
            </h1>
            
            <p className="text-xl md:text-3xl font-semibold text-slate-700 leading-tight">
              Will you be my Valentine? 🌷
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mt-8 md:mt-12 relative min-h-[150px] w-full">
            <button
              onClick={() => setStage('accepted')}
              style={{ 
                transform: `scale(${getYesButtonSize()})`,
                transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-10 md:py-4 md:px-12 rounded-full shadow-lg hover:shadow-pink-300/50 flex items-center gap-2 z-20 whitespace-nowrap"
            >
              YES <Sparkles size={20} />
            </button>

            <button
              onMouseEnter={noCount >= 4 ? moveNoButton : undefined}
              onClick={handleNoClick}
              style={{ 
                transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
                opacity: getNoButtonOpacity(),
                display: noCount > 16 ? 'none' : 'flex',
                transition: noCount >= 4 ? 'transform 0.1s ease-out' : 'all 0.2s'
              }}
              className="bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold py-3 px-6 md:py-4 md:px-8 rounded-full shadow-md flex items-center gap-2 z-10 whitespace-nowrap"
            >
              {noMessages[Math.min(noCount, noMessages.length - 1)]}
            </button>
          </div>

          {noCount > 2 && (
            <p className="text-pink-400 font-medium animate-bounce mt-8 text-sm md:text-base">
              {noCount > 8 ? "hon, you can't run forever! 😘" : "Psst... the YES button is looking really good right now!"}
            </p>
          )}
        </div>
      </div>

      <div className="fixed bottom-4 left-4 text-pink-200/50 -rotate-12 pointer-events-none w-16 md:w-24">
        <Gift className="w-full h-full" />
      </div>
      <div className="fixed top-4 right-4 text-pink-200/50 rotate-12 pointer-events-none w-16 md:w-24">
        <Stars className="w-full h-full" />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="bg-pink-50 min-h-screen text-slate-800 selection:bg-pink-200">
      <ValentineRequest />
    </div>
  );
}
