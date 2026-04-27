import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  ChevronLeft, 
  Send, 
  Bot,
  Archive,
  Fish,
  Mail,
  Smartphone,
  Battery,
  Wifi,
  Signal,
  Palette,
  Phone,
  Camera,
  Gamepad2,
  ShoppingBag,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Twitter,
  Plus,
  User as UserIcon,
  Search,
  Lock,
  Unlock,
  Book,
  UtensilsCrossed,
  Wallet as WalletIcon,
  Leaf,
  Camera as CameraIcon,
  ChevronRight,
  Sparkles,
  Users,
  Heart,
  Trash2,
  Smile,
  Info,
  CheckCircle2,
  Circle,
  ClipboardList,
  RotateCw,
  MapPin,
  Eye,
  Disc,
  Coins,
  Droplets,
  BookOpen,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const BUBBLE_PRESETS = [
  { name: '經典深藍', css: 'background: linear-gradient(135deg, #007AFF, #0056b3); color: white; border-radius: 18px 18px 2px 18px; border: none; shadow: none;' },
  { name: '浪漫粉嫩', css: 'background: linear-gradient(135deg, #FF9A9E, #FAD0C4); color: white; border-radius: 18px 18px 2px 18px; border: none; shadow: none;' },
  { name: '極簡透白', css: 'background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); color: inherit; border-radius: 18px;' },
  { name: '霓虹電綠', css: 'background: #000; color: #39FF14; border: 2px solid #39FF14; box-shadow: 0 0 8px #39FF14; font-weight: bold; border-radius: 10px;' },
  { name: '工業炭黑', css: 'background: #1c1c1e; border: 1px solid #3a3a3c; color: #fff; border-radius: 15px;' },
  { name: '優雅淡紫', css: 'background: #E6E6FA; color: #4B0082; border: 1px solid #D8BFD8; border-radius: 20px;' },
  { name: '復古牛皮', css: 'background: #f5deb3; color: #5d4037; border: 1px solid #d2b48c; border-radius: 4px;' },
  { name: '玻璃擬態', css: 'background: rgba(255,255,255,0.2); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);' }
];

const ANIMAL_EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🐐', '🦌', '🐕', '🐩', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🕊', '🐇', '🐁', '🐀', '🐿', '🦔'];
const getRandomAnimalEmoji = () => ANIMAL_EMOJIS[Math.floor(Math.random() * ANIMAL_EMOJIS.length)];

const AvatarImage = ({ src, className }: { src: string, className?: string }) => {
  const isEmoji = src && src.length <= 4;
  if (isEmoji) {
    return (
      <div className={`${className} flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-3xl select-none`}>
        {src}
      </div>
    );
  }
  return <img src={src} className={className} />;
};

enum ScreenState { Locked = 'locked', Home = 'home', AppOpen = 'app-open' }
type AppId = 'messages' | 'settings' | 'store' | 'diary' | 'phone' | 'kitchen' | 'wallet' | 'garden' | 'photos' | 'characters' | 'warehouse' | 'fishing' | 'wheel' | 'dex';

interface Message { role: 'user' | 'model'; text: string; }
interface Memo { id: string; text: string; completed: boolean; }
interface UserProfile { name: string; age: string; gender: string; avatar: string; signature: string; }
interface AISettings { apiKey: string; model: string; }
interface Character {
  id: string;
  name: string;
  gender: string;
  age: string;
  personality: string;
  habits: string;
  signature: string;
  settings: string;
  avatar: string;
  favorability: number;
  messages: Message[];
  memos: Memo[];
  minResponseTime: number;
  maxResponseTime: number;
  maxMessagesPerTurn: number;
  chatBackground?: string;
  isChatHidden?: boolean;
  myBubbleCss?: string;
  theirBubbleCss?: string;
  charNickname?: string;
  userNickname?: string;
  relationship?: string;
  location?: string;
  locationInterval?: number;
  walletBalance?: number;
}

interface Fish {
  id: string;
  name: string;
  rarity: '一般' | '稀有' | '史詩' | '傳說';
  icon: string;
}

interface Trash {
  name: string;
  icon: string;
  priceRange: [number, number];
}

const FISH_TYPES: Fish[] = [
  { id: 'f1', name: '孔雀魚', rarity: '一般', icon: '🐟' }, { id: 'f2', name: '吳郭魚', rarity: '一般', icon: '🐟' },
  { id: 'f3', name: '秋刀魚', rarity: '一般', icon: '🐟' }, { id: 'f4', name: '沙丁魚', rarity: '一般', icon: '🐟' },
  { id: 'f5', name: '鯖魚', rarity: '一般', icon: '🐟' }, { id: 'f6', name: '白帶魚', rarity: '一般', icon: '🐟' },
  { id: 'f7', name: '虱目魚', rarity: '一般', icon: '🐟' }, { id: 'f8', name: '鯉魚', rarity: '一般', icon: '🐟' },
  { id: 'f9', name: '黑鮪魚', rarity: '一般', icon: '🐟' }, { id: 'f10', name: '鱸魚', rarity: '一般', icon: '🐟' },
  { id: 'f11', name: '小丑魚', rarity: '一般', icon: '🐠' }, { id: 'f12', name: '比目魚', rarity: '一般', icon: '🐟' },
  { id: 'f13', name: '鯰魚', rarity: '一般', icon: '🐟' }, { id: 'f14', name: '草魚', rarity: '一般', icon: '🐟' },
  { id: 'f15', name: '黃魚', rarity: '一般', icon: '🐟' },
  { id: 'f16', name: '石斑魚', rarity: '稀有', icon: '🐡' }, { id: 'f17', name: '旗魚', rarity: '稀有', icon: '🦈' },
  { id: 'f18', name: '曼波魚', rarity: '稀有', icon: '🐡' }, { id: 'f19', name: '河豚', rarity: '稀有', icon: '🐡' },
  { id: 'f20', name: '劍魚', rarity: '稀有', icon: '🦈' }, { id: 'f21', name: '鯛魚', rarity: '稀有', icon: '🐟' },
  { id: 'f22', name: '海馬', rarity: '稀有', icon: '🐉' }, { id: 'f23', name: '魟魚', rarity: '稀有', icon: '🥏' },
  { id: 'f24', name: '章魚', rarity: '稀有', icon: '🐙' }, { id: 'f25', name: '烏賊', rarity: '稀有', icon: '🦑' },
  { id: 'f26', name: '大白鯊', rarity: '史詩', icon: '🦈' }, { id: 'f27', name: '虎鯨', rarity: '史詩', icon: '🐋' },
  { id: 'f28', name: '鯨鯊', rarity: '史詩', icon: '🦈' }, { id: 'f29', name: '抹香鯨', rarity: '史詩', icon: '🐳' },
  { id: 'f30', name: '皇帶魚', rarity: '史詩', icon: '🐉' },
  { id: 'f31', name: '黃金龍魚', rarity: '傳說', icon: '🐉' }, { id: 'f32', name: '深海大王烏賊', rarity: '傳說', icon: '🦑' }
];

const TRASH_TYPES: Trash[] = [
  { name: '破舊的襪子', icon: '🧦', priceRange: [1, 2] },
  { name: '魚骨頭', icon: '🦴', priceRange: [1, 3] },
  { name: '破鞋子', icon: '👞', priceRange: [1, 2] },
  { name: '濕透的帽子', icon: '🧢', priceRange: [1, 3] },
  { name: '空鋁罐', icon: '🥫', priceRange: [1, 2] },
  { name: '生鏽的鐵罐', icon: '🛢️', priceRange: [1, 3] },
  { name: '海草糾纏的樹枝', icon: '🌿', priceRange: [1, 2] }
];

interface Crop {
  id: string;
  name: string;
  icon: string;
  growthTime: number; // in hours
  sellPrice: number;
}

const CROP_TYPES: Crop[] = [
  { id: 'c1', name: '小麥', icon: '🌾', growthTime: 1, sellPrice: 50 },
  { id: 'c2', name: '玉米', icon: '🌽', growthTime: 2, sellPrice: 80 },
  { id: 'c3', name: '紅蘿蔔', icon: '🥕', growthTime: 3, sellPrice: 120 },
  { id: 'c4', name: '番茄', icon: '🍅', growthTime: 4, sellPrice: 150 },
  { id: 'c5', name: '馬鈴薯', icon: '🥔', growthTime: 5, sellPrice: 200 },
  { id: 'c6', name: '茄子', icon: '🍆', growthTime: 6, sellPrice: 250 },
  { id: 'c7', name: '南瓜', icon: '🎃', growthTime: 7, sellPrice: 300 },
  { id: 'c8', name: '鳳梨', icon: '🍍', growthTime: 8, sellPrice: 350 },
  { id: 'c9', name: '西瓜', icon: '🍉', growthTime: 9, sellPrice: 400 },
  { id: 'c10', name: '葡萄', icon: '🍇', growthTime: 10, sellPrice: 450 },
  { id: 'c11', name: '草莓', icon: '🍓', growthTime: 11, sellPrice: 500 },
  { id: 'c12', name: '櫻桃', icon: '🍒', growthTime: 12, sellPrice: 550 },
  { id: 'c13', name: '蜜桃', icon: '🍑', growthTime: 13, sellPrice: 600 },
  { id: 'c14', name: '芒果', icon: '🥭', growthTime: 14, sellPrice: 650 },
  { id: 'c15', name: '檸檬', icon: '🍋', growthTime: 15, sellPrice: 700 },
  { id: 'c16', name: '梨子', icon: '🍐', growthTime: 16, sellPrice: 750 },
  { id: 'c17', name: '蘋果', icon: '🍎', growthTime: 17, sellPrice: 800 },
  { id: 'c18', name: '奇異果', icon: '🥝', growthTime: 18, sellPrice: 850 },
  { id: 'c19', name: '番薯', icon: '🍠', growthTime: 19, sellPrice: 900 },
  { id: 'c20', name: '椰子', icon: '🥥', growthTime: 20, sellPrice: 950 },
  { id: 'c21', name: '向日葵', icon: '🌻', growthTime: 10, sellPrice: 1000 },
  { id: 'c22', name: '玫瑰', icon: '🌹', growthTime: 12, sellPrice: 1200 },
  { id: 'c23', name: '鬱金香', icon: '🌷', growthTime: 8, sellPrice: 900 },
  { id: 'c24', name: '香菇', icon: '🍄', growthTime: 5, sellPrice: 300 },
  { id: 'c25', name: '大蒜', icon: '🧄', growthTime: 6, sellPrice: 400 },
  { id: 'c26', name: '洋蔥', icon: '🧅', growthTime: 6, sellPrice: 400 },
  { id: 'c27', name: '白菜', icon: '🥬', growthTime: 4, sellPrice: 300 },
  { id: 'c28', name: '花椰菜', icon: '🥦', growthTime: 7, sellPrice: 500 },
  { id: 'c29', name: '辣椒', icon: '🌶️', growthTime: 3, sellPrice: 200 },
  { id: 'c30', name: '黃瓜', icon: '🥒', growthTime: 5, sellPrice: 350 }
];

interface GardenPatch {
  id: number;
  status: 'locked' | 'empty' | 'growing' | 'ready' | 'dead';
  cropId?: string;
  plantedTime?: number;
  lastWateredTime?: number;
  needsWatering?: boolean;
  waterCount?: number;
}


const FishingApp = ({ isDarkMode, goHome, onCatchFish, onCatchTrash }: { isDarkMode: boolean, goHome: () => void, onCatchFish: (id: string) => void, onCatchTrash: (coins: number) => void }) => {
  const [isFishing, setIsFishing] = useState(false);
  const [bobberPos, setBobberPos] = useState(0);
  const requestRef = useRef<number>();
  const posRef = useRef(0);
  const dirRef = useRef(1);
  const speedRef = useRef(2);

  const [resultModal, setResultModal] = useState<{type: 'fish' | 'trash', msg: string, sub?: string} | null>(null);

  const animate = () => {
    posRef.current += dirRef.current * speedRef.current;
    if (posRef.current >= 100) {
      posRef.current = 100;
      dirRef.current = -1;
      speedRef.current = 3.0 + Math.random() * 2;
    } else if (posRef.current <= 0) {
      posRef.current = 0;
      dirRef.current = 1;
      speedRef.current = 3.0 + Math.random() * 2;
    }
    setBobberPos(posRef.current);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isFishing) {
      requestRef.current = requestAnimationFrame(animate);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isFishing]);

  const handleStart = () => {
    setResultModal(null);
    posRef.current = 0;
    dirRef.current = 1;
    speedRef.current = 3.0 + Math.random();
    setBobberPos(0);
    setIsFishing(true);
  };

  const handleCatch = () => {
    setIsFishing(false);
    const pos = posRef.current;
    
    // zones: 0-20 red, 20-40 orange, 40-60 green, 60-80 orange, 80-100 red
    // Green: 40 to 60
    if (pos >= 40 && pos <= 60) {
      // Catch fish
      const roll = Math.random();
      let pool = [];
      if (roll < 0.6) pool = FISH_TYPES.filter(f => f.rarity === '一般');
      else if (roll < 0.9) pool = FISH_TYPES.filter(f => f.rarity === '稀有');
      else if (roll < 0.985) pool = FISH_TYPES.filter(f => f.rarity === '史詩');
      else pool = FISH_TYPES.filter(f => f.rarity === '傳說');
      
      const fish = pool[Math.floor(Math.random() * pool.length)] || FISH_TYPES[0];
      onCatchFish(fish.id);
      setResultModal({ type: 'fish', msg: `釣到了 ${fish.name}!`, sub: `稀有度: ${fish.rarity}` });
    } else {
      // Catch trash
      const trash = TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)];
      const coins = Math.floor(Math.random() * (trash.priceRange[1] - trash.priceRange[0] + 1)) + trash.priceRange[0];
      onCatchTrash(coins);
      setResultModal({ type: 'trash', msg: `釣到了 ${trash.name}`, sub: `獲得了 ${coins} 金幣` });
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-blue-950 text-white' : 'bg-blue-50 text-blue-900'} overflow-hidden`}>
      <div className={`px-4 pt-16 pb-3 flex items-center justify-between border-b ${isDarkMode ? 'border-blue-900' : 'border-blue-200'}`}>
        <h2 className="text-2xl font-bold flex items-center gap-2"><Fish /> 釣魚</h2>
        <button onClick={goHome} className="text-[#007AFF] font-medium">關閉</button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-12 relative overflow-hidden">
        {/* Background ocean waves mock */}
        <div className="absolute inset-0 opacity-10 flex flex-col justify-end pointer-events-none">
          <svg viewBox="0 0 1440 320" className="w-full h-auto"><path fill="currentColor" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
        </div>

        {/* Fishing Slider */}
        <div className="w-full max-w-sm relative h-12 bg-neutral-200 rounded-full overflow-hidden shadow-inner border-2 border-neutral-300">
          {/* Zones */}
          <div className="absolute top-0 left-0 h-full w-[20%] bg-red-400 opacity-80" />
          <div className="absolute top-0 left-[20%] h-full w-[20%] bg-orange-400 opacity-80" />
          <div className="absolute top-0 left-[40%] h-full w-[20%] bg-green-500 opacity-90 shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
          <div className="absolute top-0 left-[60%] h-full w-[20%] bg-orange-400 opacity-80" />
          <div className="absolute top-0 left-[80%] h-full w-[20%] bg-red-400 opacity-80" />
          
          {/* Bobber Indicator */}
          <div 
            className="absolute top-0 h-full w-2 bg-black shadow-[0_0_5px_rgba(0,0,0,0.5)] z-10 transition-none"
            style={{ left: `${bobberPos}%`, transform: 'translateX(-50%)' }}
          />
          {/* Fish icon following bobber */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 z-20 text-xl transition-none"
            style={{ left: `${bobberPos}%`, transform: 'translate(-50%, -50%)', scaleX: dirRef.current === 1 ? -1 : 1 }}
          >
            🐟
          </div>
        </div>

        {/* Actions */}
        <div className="z-10 mt-8">
          {isFishing ? (
            <button 
              onClick={handleCatch}
              className="w-48 h-48 rounded-full bg-blue-500 hover:bg-blue-600 border-8 border-blue-300 text-white font-black text-3xl shadow-2xl active:scale-95 transition-transform"
            >
              拉竿！
            </button>
          ) : (
             <button 
              onClick={handleStart}
              className="px-8 py-4 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold text-xl shadow-lg active:scale-95 transition-transform"
            >
              開始釣魚
            </button>
          )}
        </div>

        <p className="text-sm opacity-60 text-center px-6 z-10 font-medium">
          魚標（🐟）到達中間 <span className="text-green-500 font-bold">綠色區塊</span> 時點擊「拉竿」！<br/>
          紅色/橘色區塊只會釣到垃圾（隨機獲得金幣）。
        </p>
      </div>

      {resultModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-xs ${isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-white text-black'} rounded-3xl p-6 text-center shadow-2xl`}
          >
            <div className="text-6xl mb-4 animate-bounce">
              {resultModal.type === 'fish' ? '🎉' : '🗑️'}
            </div>
            <h3 className="text-2xl font-black mb-2">{resultModal.msg}</h3>
            <p className={`text-sm mb-6 ${resultModal.type === 'fish' ? 'text-orange-500 font-bold' : 'text-neutral-500'}`}>
              {resultModal.sub}
            </p>
            <button 
              onClick={() => setResultModal(null)}
              className="w-full py-3 bg-[#007AFF] hover:bg-blue-600 text-white font-bold rounded-xl transition-colors"
            >
              繼續
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const DexApp = ({ isDarkMode, goHome }: { isDarkMode: boolean, goHome: () => void }) => {
  const [activeTab, setActiveTab] = useState<'fish' | 'crops'>('fish');
  const [expandedRarity, setExpandedRarity] = useState<string | null>(null);

  const rarities = ['一般', '稀有', '史詩', '傳說'];
  const categorizedFish = rarities.reduce((acc, r) => {
    acc[r] = FISH_TYPES.filter(f => f.rarity === r);
    return acc;
  }, {} as Record<string, typeof FISH_TYPES>);

  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-hidden`}>
      <div className={`px-4 pt-16 pb-3 flex flex-col gap-4 border-b ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-200'} bg-opacity-80 backdrop-blur-md z-10 sticky top-0`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2"><BookOpen /> 圖鑑</h2>
          <button onClick={goHome} className="text-[#007AFF] font-medium">關閉</button>
        </div>
        <div className={`flex p-1 rounded-xl w-full ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-gray-200'}`}>
          <button 
            onClick={() => setActiveTab('fish')} 
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg ${activeTab === 'fish' ? (isDarkMode ? 'bg-[#2c2c2e] text-white shadow' : 'bg-white text-black shadow') : 'text-gray-500'}`}
          >
            魚貨
          </button>
          <button 
            onClick={() => setActiveTab('crops')} 
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg ${activeTab === 'crops' ? (isDarkMode ? 'bg-[#2c2c2e] text-white shadow' : 'bg-white text-black shadow') : 'text-gray-500'}`}
          >
            作物
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'fish' && (
          <div className="space-y-4">
            {rarities.map(rarity => {
              const items = categorizedFish[rarity];
              if (items.length === 0) return null;
              
              let rarityColor = 'text-white bg-gray-500';
              if (rarity === '稀有') rarityColor = 'text-white bg-blue-500';
              if (rarity === '史詩') rarityColor = 'text-white bg-purple-500';
              if (rarity === '傳說') rarityColor = 'text-white bg-orange-500';

              return (
                <div key={rarity} className={`rounded-2xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} overflow-hidden`}>
                  <button 
                    onClick={() => setExpandedRarity(expandedRarity === rarity ? null : rarity)}
                    className={`w-full p-4 flex justify-between items-center ${rarityColor}`}
                  >
                    <span className="font-bold text-lg">{rarity}等級</span>
                    <span className="text-sm font-medium">{items.length} 種</span>
                  </button>
                  {expandedRarity === rarity && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-3">
                      {items.map(info => (
                        <div key={info.id} className={`flex flex-col items-center justify-center p-3 rounded-2xl ${isDarkMode ? 'bg-[#2c2c2e]' : 'bg-gray-50'} shadow-sm relative`}>
                          <div className="text-4xl mb-2">{info.icon}</div>
                          <div className="text-xs font-bold truncate w-full text-center">{info.name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {activeTab === 'crops' && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pb-8">
            {CROP_TYPES.map(info => (
              <div key={info.id} className={`flex flex-col items-center justify-center p-3 rounded-2xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} shadow-sm relative`}>
                <div className="text-4xl mb-2">{info.icon}</div>
                <div className="text-xs font-bold truncate w-full text-center">{info.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface Recipe {
  id: string;
  name: string;
  description: string;
  icon: string;
  ingredients: { name: string; amount: number }[];
  type: 'fish' | 'crop';
}

const RECIPES: Recipe[] = [
  // Fish Recipes
  { id: 'r1', name: '烤吳郭魚', description: '外皮焦香的鹽烤吳郭魚，簡單又美味的家常料理。', icon: '🐟', ingredients: [{ name: '吳郭魚', amount: 1 }], type: 'fish' },
  { id: 'r2', name: '鯉魚湯', description: '溫補養生的鯉魚熬湯，滋味鮮甜。', icon: '🍲', ingredients: [{ name: '鯉魚', amount: 1 }], type: 'fish' },
  { id: 'r3', name: '鹽烤鯖魚', description: '富含油脂的鯖魚，撒點鹽巴烘烤就非常迷人。', icon: '🐠', ingredients: [{ name: '鯖魚', amount: 1 }], type: 'fish' },
  { id: 'r4', name: '鮭魚生魚片', description: '新鮮肥美的鮭魚切片，入口即化。', icon: '🍣', ingredients: [{ name: '鮭魚', amount: 1 }], type: 'fish' },
  { id: 'r5', name: '鮪魚肚', description: '上等鮪魚肚肉，豐富的油脂讓口感極佳。', icon: '🍱', ingredients: [{ name: '黑鮪魚', amount: 1 }], type: 'fish' },
  { id: 'r6', name: '糖醋小丑魚', description: '酸甜開胃的糖醋做法，魚肉與番茄完美結合。', icon: '🥘', ingredients: [{ name: '小丑魚', amount: 1 }, { name: '番茄', amount: 1 }], type: 'fish' },
  { id: 'r7', name: '皇帶魚湯', description: '稀有海產熬製的高級湯品，聽說能帶來好運。', icon: '🍲', ingredients: [{ name: '皇帶魚', amount: 1 }], type: 'fish' },
  { id: 'r8', name: '烤腔棘魚', description: '活化石般的珍稀魚類，用簡單炭烤保留原始風味。', icon: '🍢', ingredients: [{ name: '腔棘魚', amount: 1 }], type: 'fish' },
  
  // Crop Recipes
  { id: 'r9', name: '麵包', description: '用小麥研磨烘焙的金黃麵包，香氣撲鼻。', icon: '🍞', ingredients: [{ name: '小麥', amount: 2 }], type: 'crop' },
  { id: 'r10', name: '烤玉米', description: '刷上特製醬汁烤到微焦的玉米，夜市經典美味。', icon: '🌽', ingredients: [{ name: '玉米', amount: 1 }], type: 'crop' },
  { id: 'r11', name: '紅蘿蔔汁', description: '現榨新鮮紅蘿蔔汁，健康又營養滿分。', icon: '🥕', ingredients: [{ name: '紅蘿蔔', amount: 1 }], type: 'crop' },
  { id: 'r12', name: '番茄湯', description: '濃郁酸甜的番茄熬湯，開胃好選擇。', icon: '🥣', ingredients: [{ name: '番茄', amount: 2 }], type: 'crop' },
  { id: 'r13', name: '烤馬鈴薯', description: '帶皮烤熟的鬆軟馬鈴薯，搭配奶油最對味。', icon: '🥔', ingredients: [{ name: '馬鈴薯', amount: 1 }], type: 'crop' },
  { id: 'r14', name: '南瓜湯', description: '顏色金黃的濃郁南瓜湯，口感滑順香甜。', icon: '🎃', ingredients: [{ name: '南瓜', amount: 1 }], type: 'crop' },
  { id: 'r15', name: '草莓果醬', description: '新鮮草莓熬煮的手工果醬，搭配麵包最合適。', icon: '🍓', ingredients: [{ name: '草莓', amount: 2 }], type: 'crop' },
  { id: 'r16', name: '蘋果派', description: '酸甜蘋果餡配上酥脆派皮，經典的下午茶甜點。', icon: '🥧', ingredients: [{ name: '蘋果', amount: 1 }, { name: '小麥', amount: 1 }], type: 'crop' },
  { id: 'r17', name: '西瓜汁', description: '冰透的西瓜打成汁，夏日解暑最佳良伴。', icon: '🍉', ingredients: [{ name: '西瓜', amount: 1 }], type: 'crop' },
  { id: 'r18', name: '蒜炒高麗菜', description: '爆香大蒜與清脆白菜的快炒，簡單美味。', icon: '🥗', ingredients: [{ name: '白菜', amount: 1 }, { name: '大蒜', amount: 1 }], type: 'crop' },
];

const KitchenApp = ({ 
  isDarkMode, 
  goHome,
  warehouseItems,
  setWarehouseItems,
  characters,
  setCharacters
}: { 
  isDarkMode: boolean;
  goHome: () => void;
  warehouseItems: {id: string, amount: number}[];
  setWarehouseItems: React.Dispatch<React.SetStateAction<{id: string, amount: number}[]>>;
  characters: Character[];
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showGiftModal, setShowGiftModal] = useState(false);

  const fishRecipes = RECIPES.filter(r => r.type === 'fish');
  const cropRecipes = RECIPES.filter(r => r.type === 'crop');

  const getPageContent = () => {
    const list = currentPage === 0 ? fishRecipes : cropRecipes;
    const mid = Math.ceil(list.length / 2);
    const leftCol = list.slice(0, mid);
    const rightCol = list.slice(mid);
    return { leftCol, rightCol };
  };

  const getInventoryItem = (name: string) => {
    const fish = FISH_TYPES.find(f => f.name === name);
    const crop = CROP_TYPES.find(c => c.name === name);
    const item = fish || crop;
    if (!item) return { id: '', total: 0 };
    const stock = warehouseItems.find(w => w.id === item.id);
    return { id: item.id, total: stock ? stock.amount : 0 };
  };

  const cookRecipe = () => {
    if (!selectedRecipe) return;
    
    // Deduct items
    setWarehouseItems(prev => {
      let newItems = [...prev];
      for (const ing of selectedRecipe.ingredients) {
        const itemInfo = getInventoryItem(ing.name);
        if (itemInfo.id) {
          const itemIdx = newItems.findIndex(i => i.id === itemInfo.id);
          if (itemIdx > -1) {
            newItems[itemIdx] = { ...newItems[itemIdx], amount: newItems[itemIdx].amount - ing.amount };
          }
        }
      }
      return newItems.filter(i => i.amount > 0);
    });

    setShowGiftModal(true);
  };

  const giveGiftTo = (characterId: string) => {
    setCharacters(prev => prev.map(c => 
      c.id === characterId 
        ? { ...c, favorability: c.favorability + 10 }
        : c
    ));
    setShowGiftModal(false);
    setSelectedRecipe(null);
  };

  if (selectedRecipe) {
    const canCook = selectedRecipe.ingredients.every(ing => getInventoryItem(ing.name).total >= ing.amount);

    return (
      <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-[#1a1510] text-[#e0c9a3]' : 'bg-[#f4e4bc] text-black'} overflow-hidden`}>
        <div className={`px-4 pt-16 pb-3 flex flex-col gap-4 border-b ${isDarkMode ? 'border-[#382818] bg-[#2a1a0f]/80' : 'border-[#d4c49c] bg-[#f4e4bc]/80'} backdrop-blur-md z-10 sticky top-0`}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2"><UtensilsCrossed /> 料理製作</h2>
            <button onClick={() => setSelectedRecipe(null)} className="text-[#007AFF] font-medium">返回</button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center">
          <div className={`w-full max-w-md rounded-2xl p-6 ${isDarkMode ? 'bg-[#2a1a0f] border border-[#3a2a18]' : 'bg-[#fdf5e6] shadow-xl border border-amber-900/10'}`}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{selectedRecipe.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{selectedRecipe.name}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-[#cba677]' : 'text-[#8b5a2b]'}`}>{selectedRecipe.description}</p>
            </div>

            <div className={`rounded-xl p-4 mb-6 ${isDarkMode ? 'bg-[#1a1510]' : 'bg-[#f4e4bc]/50'}`}>
              <h4 className="font-bold mb-3 border-b border-dashed pb-2">所需材料</h4>
              <div className="space-y-3">
                {selectedRecipe.ingredients.map((ing, idx) => {
                  const inventory = getInventoryItem(ing.name);
                  const hasEnough = inventory.total >= ing.amount;
                  return (
                    <div key={idx} className="flex justify-between items-center text-sm font-medium">
                      <span>{ing.name} x{ing.amount}</span>
                      <span className={`${hasEnough ? (isDarkMode ? 'text-green-400' : 'text-green-700') : 'text-red-500'}`}>
                        庫存: {inventory.total}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={cookRecipe}
              disabled={!canCook}
              className={`w-full py-3 rounded-xl font-bold text-lg transition-colors ${canCook ? 'bg-[#FF9500] text-white hover:bg-[#ff8800]' : (isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-300 text-gray-500')}`}
            >
              製作料理
            </button>
          </div>
        </div>

        {showGiftModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-md rounded-2xl p-6 ${isDarkMode ? 'bg-[#2a1a0f]' : 'bg-white'} shadow-2xl`}>
              <h3 className="text-xl font-bold text-center mb-4">要把做好的【{selectedRecipe.name}】送給誰？</h3>
              {characters.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">目前還沒有認識的角色哦！</p>
                  <button onClick={() => {setShowGiftModal(false); setSelectedRecipe(null);}} className="text-[#007AFF] font-bold">自己吃掉 (完成)</button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                  {characters.map(c => (
                    <button 
                      key={c.id} 
                      onClick={() => giveGiftTo(c.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-[#3a2a18] bg-[#1a1510]' : 'hover:bg-amber-50 bg-[#fdf5e6]'}`}
                    >
                      <div className="text-3xl">{c.avatar}</div>
                      <div className="flex-1 text-left">
                        <div className="font-bold">{c.name}</div>
                        <div className="text-xs text-pink-500 font-bold">💖 {c.favorability}</div>
                      </div>
                      <ArrowRight size={20} className="text-[#FF9500]" />
                    </button>
                  ))}
                  <button onClick={() => {setShowGiftModal(false); setSelectedRecipe(null);}} className={`w-full text-center py-3 mt-4 text-sm font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    不送了，自己吃掉
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  const { leftCol, rightCol } = getPageContent();

  const renderRecipe = (r: Recipe) => (
    <button key={r.id} onClick={() => setSelectedRecipe(r)} className="w-full text-left mb-4 p-2 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{r.icon}</span>
          <span className="font-bold text-[#5c3a21] dark:text-[#e0c9a3] text-sm md:text-base">{r.name}</span>
        </div>
        <ArrowRight size={16} className="text-amber-900/40 dark:text-amber-100/40" />
      </div>
      <div className="text-xs text-[#8b5a2b] dark:text-[#cba677] pl-8">
        - {r.ingredients.map(i => `${i.name} x${i.amount}`).join(', ')}
      </div>
    </button>
  );

  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-[#1a1510] text-[#e0c9a3]' : 'bg-[#f4e4bc] text-black'} overflow-hidden`}>
      <div className={`px-4 pt-16 pb-3 flex flex-col gap-4 border-b ${isDarkMode ? 'border-[#382818] bg-[#2a1a0f]/80' : 'border-[#d4c49c] bg-[#f4e4bc]/80'} backdrop-blur-md z-10 sticky top-0`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-[#e0c9a3]' : 'text-[#8b4513]'}`}><UtensilsCrossed /> 食譜</h2>
          <button onClick={goHome} className="text-[#007AFF] font-medium">關閉</button>
        </div>
      </div>
      
      <div className={`flex-1 overflow-y-auto p-2 sm:p-4 flex flex-col items-center justify-center relative ${isDarkMode ? 'bg-[#1a1510]' : 'bg-[#f4e4bc]/50'}`}>
        <div className={`w-full max-w-2xl h-[90%] relative shadow-2xl rounded-sm flex ring-1 ${isDarkMode ? 'bg-[#2a1a08] ring-black' : 'bg-[#fdf5e6] ring-amber-900/10'}`}>
          {/* Middle spine shadow */}
          <div className="absolute inset-y-0 left-1/2 w-8 -ml-4 bg-gradient-to-r from-black/5 via-black/10 to-black/5 z-10 pointer-events-none"></div>
          
          {/* Left Page */}
          <div className={`flex-1 p-3 sm:p-6 border-r relative overflow-y-auto page-scroll ${isDarkMode ? 'border-[#3a2a18]' : 'border-[#d4c49c]/50'}`}>
             <h3 className={`text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6 border-b-2 border-dashed pb-2 ${isDarkMode ? 'text-[#cba677] border-[#cba677]/30' : 'text-[#8b4513] border-[#8b4513]/30'}`}>
               {currentPage === 0 ? '魚貨料理' : '作物料理'}
             </h3>
             <div className="space-y-2">
               {leftCol.map(renderRecipe)}
             </div>
          </div>
          
          {/* Right Page */}
          <div className="flex-1 p-3 sm:p-6 relative overflow-y-auto page-scroll">
             <h3 className={`text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6 border-b-2 border-dashed pb-2 ${isDarkMode ? 'text-[#cba677] border-[#cba677]/30' : 'text-[#8b4513] border-[#8b4513]/30'}`}>
               {currentPage === 0 ? '更多海寶' : '更多珍饈'}
             </h3>
             <div className="space-y-2 pb-12">
               {rightCol.map(renderRecipe)}
             </div>
             
             {/* Flip button */}
             <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-20">
               {currentPage === 0 ? (
                 <button onClick={() => setCurrentPage(1)} className={`flex items-center gap-1 transition-colors animate-pulse p-2 rounded-full ${isDarkMode ? 'text-[#cba677] bg-[#3a2a18]/50 hover:text-white' : 'text-[#8b4513] bg-amber-200/50 hover:text-amber-900'}`}>
                   <ArrowRight size={24} />
                 </button>
               ) : (
                 <button onClick={() => setCurrentPage(0)} className={`flex items-center gap-1 transition-colors p-2 rounded-full ${isDarkMode ? 'text-[#cba677] bg-[#3a2a18]/50 hover:text-white' : 'text-[#8b4513] bg-amber-200/50 hover:text-amber-900'}`}>
                   <ArrowLeft size={24} />
                 </button>
               )}
             </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .page-scroll::-webkit-scrollbar { width: 4px; }
        .page-scroll::-webkit-scrollbar-track { background: transparent; }
        .page-scroll::-webkit-scrollbar-thumb { background: rgba(139, 69, 19, 0.2); border-radius: 4px; }
      `}} />
    </div>
  );
};

const WarehouseApp = ({ warehouseItems, isDarkMode, goHome }: { warehouseItems: {id: string, amount: number}[], isDarkMode: boolean, goHome: () => void }) => {
  const [activeTab, setActiveTab] = useState<'fish' | 'crops'>('fish');
  const [expandedRarity, setExpandedRarity] = useState<string | null>(null);
  const getFishInfo = (id: string) => FISH_TYPES.find(f => f.id === id);
  const getCropInfo = (id: string) => CROP_TYPES.find(c => c.id === id);

  const fishItems = warehouseItems.filter(item => item.id.startsWith('f'));
  const cropItems = warehouseItems.filter(item => item.id.startsWith('c'));

  const rarities = ['一般', '稀有', '史詩', '傳說'];
  const categorizedFish = rarities.reduce((acc, r) => {
    acc[r] = fishItems.filter(item => getFishInfo(item.id)?.rarity === r);
    return acc;
  }, {} as Record<string, typeof warehouseItems>);

  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-hidden`}>
      <div className={`px-4 pt-16 pb-3 flex flex-col gap-4 border-b ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-200'} bg-opacity-80 backdrop-blur-md z-10 sticky top-0`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Archive /> 倉庫</h2>
          <button onClick={goHome} className="text-[#007AFF] font-medium">關閉</button>
        </div>
        <div className={`flex p-1 rounded-xl w-full ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-gray-200'}`}>
          <button 
            onClick={() => setActiveTab('fish')} 
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg ${activeTab === 'fish' ? (isDarkMode ? 'bg-[#2c2c2e] text-white shadow' : 'bg-white text-black shadow') : 'text-gray-500'}`}
          >
            魚貨
          </button>
          <button 
            onClick={() => setActiveTab('crops')} 
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg ${activeTab === 'crops' ? (isDarkMode ? 'bg-[#2c2c2e] text-white shadow' : 'bg-white text-black shadow') : 'text-gray-500'}`}
          >
            作物
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'fish' && (
          fishItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4">
              <Archive size={48} />
              <p>沒有魚貨，快去釣魚吧！</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rarities.map(rarity => {
                const items = categorizedFish[rarity];
                if (items.length === 0) return null;
                
                let rarityColor = 'text-white bg-gray-500';
                if (rarity === '稀有') rarityColor = 'text-white bg-blue-500';
                if (rarity === '史詩') rarityColor = 'text-white bg-purple-500';
                if (rarity === '傳說') rarityColor = 'text-white bg-orange-500';

                return (
                  <div key={rarity} className={`rounded-2xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} overflow-hidden`}>
                    <button 
                      onClick={() => setExpandedRarity(expandedRarity === rarity ? null : rarity)}
                      className={`w-full p-4 flex justify-between items-center ${rarityColor}`}
                    >
                      <span className="font-bold text-lg">{rarity}等級</span>
                      <span className="text-sm font-medium">{items.length} 種</span>
                    </button>
                    {expandedRarity === rarity && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-3">
                        {items.map(item => {
                          const info = getFishInfo(item.id);
                          if (!info) return null;
                          return (
                            <div key={item.id} className={`flex flex-col items-center justify-center p-3 rounded-2xl ${isDarkMode ? 'bg-[#2c2c2e]' : 'bg-gray-50'} shadow-sm relative`}>
                              <div className="text-4xl mb-2">{info.icon}</div>
                              <div className="text-xs font-bold truncate w-full text-center">{info.name}</div>
                              <div className="absolute top-1 right-2 text-xs font-black opacity-40">
                                x{item.amount}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
        
        {activeTab === 'crops' && (
          cropItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4">
              <Archive size={48} />
              <p>沒有作物，快去花園種植吧！</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pb-8">
              {cropItems.map(item => {
                const info = getCropInfo(item.id);
                if (!info) return null;
                return (
                  <div key={item.id} className={`flex flex-col items-center justify-center p-3 rounded-2xl ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} shadow-sm relative`}>
                    <div className="text-4xl mb-2">{info.icon}</div>
                    <div className="text-xs font-bold truncate w-full text-center">{info.name}</div>
                    <div className="absolute top-1 right-2 text-xs font-black opacity-40">
                      x{item.amount}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};

interface DiaryEntry {
  id: string;
  date: string;
  authorId: string;
  content: string;
  mood: string;
}

const DiaryApp = ({
  isDarkMode,
  goHome,
  characters,
  userProfile,
  diaryEntries,
  setDiaryEntries,
  aiSettings
}: {
  isDarkMode: boolean;
  goHome: () => void;
  characters: Character[];
  userProfile: UserProfile;
  diaryEntries: DiaryEntry[];
  setDiaryEntries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
  aiSettings: AISettings;
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // YYYY-MM-DD
  const [newEntryContent, setNewEntryContent] = useState('');
  const [newEntryMood, setNewEntryMood] = useState('😊');
  const [selectedAuthor, setSelectedAuthor] = useState('user');
  const [isGeneratingLog, setIsGeneratingLog] = useState(false);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const actualToday = new Date();
  const actualTodayStr = `${actualToday.getFullYear()}-${String(actualToday.getMonth() + 1).padStart(2, '0')}-${String(actualToday.getDate()).padStart(2, '0')}`;

  const handleDayClick = (day: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    setSelectedDate(`${year}-${formattedMonth}-${formattedDay}`);
  };

  const generateCharactersDiary = async (date: string) => {
    if (isGeneratingLog) return;
    setIsGeneratingLog(true);
    try {
      const charsWithoutEntry = characters.filter(c => !diaryEntries.some(e => e.date === date && e.authorId === c.id));
      if (charsWithoutEntry.length === 0) {
        alert('所有角色這天都已經寫過日記了！');
        setIsGeneratingLog(false);
        return;
      }
      
      const apiKeyToUse = aiSettings.apiKey || process.env.GEMINI_API_KEY;
      if (!apiKeyToUse) {
        alert('請先在設定中輸入 Gemini API 連線金鑰！');
        setIsGeneratingLog(false);
        return;
      }
      
      const localAi = new GoogleGenAI({ apiKey: apiKeyToUse });
      const newEntries: DiaryEntry[] = [];
      for (const char of charsWithoutEntry) {
        try {
          const prompt = `你是一個名叫${char.name}的角色，年齡${char.age}，個性${char.personality}，習慣${char.habits}。請以第一人稱寫一篇關於今天的簡短日記(30字以內)，並包含一個符合心情的emoji。請輸出純JSON格式：{"mood": "心情emoji(需在以下清單中選擇：😊, 😂, 🥰, 😎, 🤔, 😴, 😭, 😡, 🤢, 🤯)", "content": "日記內容"}`;
          const response = await localAi.models.generateContent({
            model: aiSettings.model || "gemini-1.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json"
            }
          });
          const jsonText = response.text || '';
          const parsed = JSON.parse(jsonText);
          
          newEntries.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            date: date,
            authorId: char.id,
            content: parsed.content || "今天過得很開心！",
            mood: parsed.mood || "😊",
          });
        } catch (err) {
          console.error('Failed to generate diary for', char.name, err);
        }
      }
      
      if (newEntries.length > 0) {
        setDiaryEntries(prev => [...prev, ...newEntries]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingLog(false);
    }
  };

  const getAuthorInfo = (authorId: string) => {
    if (authorId === 'user') return { name: userProfile.name || '我', avatar: userProfile.avatar || '😀' };
    const char = characters.find(c => c.id === authorId);
    return char ? { name: char.name, avatar: char.avatar } : { name: '未知', avatar: '❓' };
  };

  const saveEntry = () => {
    if (!newEntryContent.trim() || !selectedDate) return;
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      authorId: selectedAuthor,
      content: newEntryContent.trim(),
      mood: newEntryMood,
    };
    setDiaryEntries(prev => [...prev, newEntry]);
    setNewEntryContent('');
  };

  const deleteEntry = (id: string) => {
    setDiaryEntries(prev => prev.filter(e => e.id !== id));
  };

  const MOODS = ['😊', '😂', '🥰', '😎', '🤔', '😴', '😭', '😡', '🤢', '🤯'];

  if (selectedDate) {
    const dateEntries = diaryEntries.filter(e => e.date === selectedDate);
    return (
      <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-orange-50 text-black'}`}>
        <div className={`px-4 pt-16 pb-3 flex items-center justify-between border-b ${isDarkMode ? 'border-gray-800 bg-[#1c1c1e]' : 'border-orange-200 bg-orange-100'}`}>
          <button onClick={() => setSelectedDate(null)} className="text-[#FFCC00] font-medium flex items-center gap-1">
            <ArrowLeft size={20} /> 返回
          </button>
          <h2 className="text-xl font-bold">{selectedDate}</h2>
          <div className="w-16"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-500">今日日記</h3>
            <button 
              onClick={() => generateCharactersDiary(selectedDate)}
              disabled={isGeneratingLog}
              className={`text-sm font-bold flex items-center gap-1 ${isDarkMode ? 'text-[#FFCC00]' : 'text-orange-600'} ${isGeneratingLog ? 'opacity-50' : ''}`}
            >
              {isGeneratingLog ? '角色撰寫中...' : '讓角色寫下日記'}
            </button>
          </div>
          {dateEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">這天還沒有日記紀錄喔！</div>
          ) : (
            dateEntries.map((entry) => {
              const info = getAuthorInfo(entry.authorId);
              return (
                <div key={entry.id} className={`p-4 rounded-2xl ${isDarkMode ? 'bg-[#2c2c2e]' : 'bg-white shadow-sm border border-orange-100'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-lg">{info.avatar}</div>
                      <span className="font-bold">{info.name}</span>
                      <span className="text-xl">{entry.mood}</span>
                    </div>
                    <button onClick={() => deleteEntry(entry.id)} className="text-red-500 text-sm">刪除</button>
                  </div>
                  <p className="whitespace-pre-wrap">{entry.content}</p>
                </div>
              );
            })
          )}
        </div>

        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-800 bg-[#1c1c1e]' : 'border-orange-200 bg-orange-100'}`}>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <select 
                value={selectedAuthor} 
                onChange={e => setSelectedAuthor(e.target.value)}
                className={`p-2 rounded-xl flex-1 ${isDarkMode ? 'bg-[#2c2c2e] text-white' : 'bg-white text-black'}`}
              >
                <option value="user">我 ({userProfile.name || '使用者'})</option>
                {characters.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <select 
                value={newEntryMood} 
                onChange={e => setNewEntryMood(e.target.value)}
                className={`p-2 rounded-xl text-xl ${isDarkMode ? 'bg-[#2c2c2e]' : 'bg-white'}`}
              >
                {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <textarea
              value={newEntryContent}
              onChange={e => setNewEntryContent(e.target.value)}
              placeholder="寫下今天的心情..."
              className={`w-full p-3 rounded-xl resize-none outline-none ${isDarkMode ? 'bg-[#2c2c2e] text-white' : 'bg-white text-black'}`}
              rows={3}
            />
            <button 
              onClick={saveEntry}
              disabled={!newEntryContent.trim()}
              className="w-full py-3 bg-[#FFCC00] text-black font-bold rounded-xl disabled:opacity-50"
            >
              發布日記
            </button>
          </div>
        </div>
      </div>
    );
  }

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i);

  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-orange-50 text-black'}`}>
      <div className={`px-4 pt-16 pb-3 flex flex-col gap-4 border-b ${isDarkMode ? 'border-gray-800 bg-[#1c1c1e]' : 'border-orange-200 bg-orange-100'}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Book /> 日曆 & 交換日記</h2>
          <button onClick={goHome} className="text-[#007AFF] font-medium">關閉</button>
        </div>
        <div className="flex items-center justify-between px-4">
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-black/10"><ArrowLeft /></button>
          <div className="text-xl font-bold">{year}年 {month + 1}月</div>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-black/10"><ArrowRight /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className={`w-full max-w-md mx-auto aspect-[3/4] p-4 rounded-xl shadow-lg flex flex-col ${isDarkMode ? 'bg-[#2c2c2e]' : 'bg-white'}`}>
          <div className="grid grid-cols-7 gap-1 mb-2 text-center font-bold text-sm text-gray-500">
            <div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div><div>日</div>
          </div>
          <div className="grid grid-cols-7 gap-1 flex-1">
            {blanks.map((_, i) => <div key={`blank-${i}`} className="border border-transparent"></div>)}
            {days.map(day => {
              const formattedMonth = String(month + 1).padStart(2, '0');
              const formattedDay = String(day).padStart(2, '0');
              const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
              const isToday = dateStr === actualTodayStr;
              const entries = diaryEntries.filter(e => e.date === dateStr);
              return (
                <button 
                  key={day} 
                  onClick={() => handleDayClick(day)}
                  className={`flex flex-col items-center justify-start pt-1 pb-1 border rounded-lg active:scale-95 transition-transform ${
                    isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-orange-100 hover:bg-orange-50'
                  } ${isToday ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-900/20' : ''}`}
                >
                  <span className="font-bold mb-1">{day}</span>
                  <div className="flex flex-wrap gap-0.5 justify-center px-0.5">
                    {entries.slice(0, 4).map(e => (
                      <span key={e.id} className="text-[10px] sm:text-xs leading-none">{getAuthorInfo(e.authorId).avatar}</span>
                    ))}
                    {entries.length > 4 && <span className="text-[10px] text-gray-400">...</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [screenState, setScreenState] = useState<ScreenState>(ScreenState.Locked);
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Customization States
  const [lockWallpaper, setLockWallpaper] = useState<string>("grey-cross");
  const [homeWallpaper, setHomeWallpaper] = useState<string>("grey-cross");
  const [userProfile, setUserProfile] = useState<UserProfile>({ 
    name: '使用者', 
    age: '', 
    gender: '', 
    avatar: '🥕',
    signature: '今天也是美好的一天' 
  });
  const [aiSettings, setAiSettings] = useState<AISettings>({ 
    apiKey: process.env.GEMINI_API_KEY || '', 
    model: 'gemini-1.5-flash' 
  });
  const [customIcons, setCustomIcons] = useState<Record<string, string>>({});
  const [appNames, setAppNames] = useState<Record<string, string>>({
    messages: '訊息',
    store: '商城',
    diary: '日曆',
    settings: '設定',
    phone: '電話',
    kitchen: '廚房',
    wallet: '錢包',
    garden: '花園',
    photos: '信箱',
    characters: '角色',
    warehouse: '倉庫',
    fishing: '釣魚',
    wheel: '每日轉盤',
    dex: '圖鑑'
  });
  const [installedApps, setInstalledApps] = useState<AppId[]>(['messages', 'diary', 'settings', 'store', 'kitchen', 'wallet', 'garden', 'photos', 'characters', 'warehouse', 'fishing', 'wheel', 'dex']);
  const [dockApps, setDockApps] = useState<AppId[]>(['phone']);
  
  const CountdownTimer = ({ plantedTime, growthHours }: { plantedTime: number, growthHours: number }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const end = plantedTime + growthHours * 60 * 60 * 1000;
      const diff = end - now;
      if (diff <= 0) {
        setTimeLeft('00:00:00');
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [plantedTime, growthHours]);

  return <span className="text-[10px] font-mono font-bold bg-black/60 text-white px-2 py-0.5 rounded-full mt-2 block shadow-sm border border-black/20">{timeLeft}</span>;
}

const GardenApp = ({ 
  patches, 
  isDarkMode, 
  goHome, 
  onUnlockPatch, 
  onPlant, 
  onWater, 
  onHarvest 
}: { 
  patches: GardenPatch[], 
  isDarkMode: boolean, 
  goHome: () => void,
  onUnlockPatch: (id: number) => void,
  onPlant: (id: number) => void,
  onWater: (id: number) => void,
  onHarvest: (id: number) => void
}) => {
  return (
    <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-[#2a1b14] text-amber-50' : 'bg-[#e8ece1] text-[#3e2723]'} overflow-hidden relative`}>
      {/* Decorative background dirt/grass texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3e2723 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className={`px-4 pt-16 pb-4 flex items-center justify-between border-b ${isDarkMode ? 'border-[#4a3424] bg-[#2a1b14]/80' : 'border-[#c5ceb6] bg-[#e8ece1]/80'} backdrop-blur-md z-10 sticky top-0 shadow-sm`}>
        <h2 className="text-2xl font-black flex items-center gap-2"><Leaf className="text-emerald-500" /> <span style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}>種植花園</span></h2>
        <button onClick={goHome} className="text-[#007AFF] font-bold bg-[#007AFF]/10 px-3 py-1.5 rounded-full text-sm">關閉</button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 z-0">
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {patches.map(patch => {
            const crop = patch.cropId ? CROP_TYPES.find(c => c.id === patch.cropId) : null;
            return (
              <div key={patch.id} className="relative aspect-square">
                {/* Soil background layered look */}
                <div className={`absolute inset-0 rounded-[2rem] border-b-8 ${isDarkMode ? 'bg-[#3e2723] border-[#1e1008]' : 'bg-[#795548] border-[#4e342e]'} shadow-inner`}></div>
                <div className={`absolute inset-2 rounded-[1.5rem] border-t-8 ${isDarkMode ? 'bg-[#4e342e] border-[#5d4037]/50' : 'bg-[#8d6e63] border-[#a1887f]/50'}`}></div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 z-10">
                  {patch.status === 'locked' && (
                    <button onClick={() => onUnlockPatch(patch.id)} className="text-center group flex flex-col items-center justify-center h-full w-full">
                      <div className="bg-black/30 p-4 rounded-full mb-2 group-active:scale-95 transition-transform backdrop-blur-sm">
                        <Lock size={28} className="text-white/80" />
                      </div>
                      <span className="text-xs font-bold text-white/90 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">300金幣解鎖</span>
                    </button>
                  )}
                  {patch.status === 'empty' && (
                    <button onClick={() => onPlant(patch.id)} className="text-center group flex flex-col items-center justify-center h-full w-full">
                      <div className="bg-white/20 p-4 rounded-full mb-2 group-active:scale-95 transition-transform backdrop-blur-sm border border-white/30 shadow-sm">
                        <Plus size={32} className="text-white" />
                      </div>
                      <span className="text-xs font-bold text-white bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">種植作物</span>
                    </button>
                  )}
                  {patch.status === 'growing' && (
                    <div className="text-center relative flex flex-col items-center justify-center h-full w-full">
                      <div className="text-5xl filter drop-shadow-md pb-2 transform transition-transform animate-pulse">🌱</div>
                      {patch.needsWatering && (
                        <button onClick={() => onWater(patch.id)} className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-2.5 shadow-lg border-2 border-white animate-bounce">
                          <Droplets size={18} color="white" strokeWidth={3} />
                        </button>
                      )}
                      <CountdownTimer plantedTime={patch.plantedTime || 0} growthHours={crop?.growthTime || 0} />
                    </div>
                  )}
                  {patch.status === 'ready' && (
                     <button onClick={() => onHarvest(patch.id)} className="text-center group flex flex-col items-center justify-center h-full w-full">
                       <span className="text-6xl filter drop-shadow-xl group-active:scale-90 transition-transform">{crop?.icon}</span>
                       <span className="text-xs font-bold text-white bg-emerald-500/90 px-3 py-1 rounded-full mt-2 shadow-sm border border-white/20 whitespace-nowrap">點擊收成!</span>
                     </button>
                  )}
                  {patch.status === 'dead' && (
                    <button onClick={() => onHarvest(patch.id)} className="text-center flex flex-col items-center justify-center h-full w-full group">
                      <span className="text-5xl opacity-80 filter sepia grayscale group-active:scale-90 transition-transform">🥀</span>
                      <span className="text-[10px] font-bold text-white bg-red-500/80 px-2 py-0.5 rounded-full mt-2">枯萎了...</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

  const [settingsSubPage, setSettingsSubPage] = useState<'main' | 'profile' | 'wallpaper' | 'icons'>('main');
  const [characterSubPage, setCharacterSubPage] = useState<'list' | 'add' | 'details' | 'edit' | 'peeper'>('list');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedCharIds, setSelectedCharIds] = useState<Set<string>>(new Set());
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isChatConfigOpen, setIsChatConfigOpen] = useState(false);
  const [emojiPickerTab, setEmojiPickerTab] = useState<'stickers' | 'nudge' | 'memo'>('stickers');
  const [nudgeInput, setNudgeInput] = useState('');
  const [memoInput, setMemoInput] = useState('');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState(1000);
  const [warehouseItems, setWarehouseItems] = useState<{id: string, amount: number}[]>([]);
  const [gardenPatches, setGardenPatches] = useState<GardenPatch[]>(
    Array.from({ length: 8 }, (_, i) => ({ 
      id: i, 
      status: i < 4 ? 'empty' : 'locked' 
    }))
  );
  const [isJiggling, setIsJiggling] = useState(false);
  const [isAddingApp, setIsAddingApp] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const onUnlockPatch = (id: number) => {
    if (walletBalance >= 300) {
      setWalletBalance(prev => prev - 300);
      setGardenPatches(prev => prev.map(p => p.id === id ? { ...p, status: 'empty' } : p));
    }
  };

  const onPlant = (id: number) => {
    const crop = CROP_TYPES[Math.floor(Math.random() * CROP_TYPES.length)];
    setGardenPatches(prev => prev.map(p => p.id === id ? { 
      ...p, 
      status: 'growing', 
      cropId: crop.id, 
      plantedTime: Date.now(), 
      lastWateredTime: Date.now(),
      needsWatering: false,
      waterCount: 0
    } : p));
  };
  
  const onWater = (id: number) => {
    setGardenPatches(prev => prev.map(p => p.id === id ? { 
      ...p, 
      lastWateredTime: Date.now(), 
      needsWatering: false,
      waterCount: (p.waterCount || 0) + 1
    } : p));
  };

  const onHarvest = (id: number) => {
    setGardenPatches(prev => prev.map(p => {
      if (p.id === id) {
        if (p.status === 'ready' && p.cropId) {
          setWarehouseItems(items => {
            const existing = items.find(i => i.id === p.cropId);
            if (existing) {
              return items.map(i => i.id === p.cropId ? { ...i, amount: i.amount + 1 } : i);
            }
            return [...items, { id: p.cropId!, amount: 1 }];
          });
        }
        return { ...p, status: 'empty', cropId: undefined, waterCount: 0 };
      }
      return p;
    }));
  };

  // Add a timer to check for needsWatering
  useEffect(() => {
    const interval = setInterval(() => {
       setGardenPatches(prev => {
         let changed = false;
         const next = prev.map(p => {
           if (p.status === 'growing') {
             const timeSincePlanted = Date.now() - (p.plantedTime || 0);
             const crop = CROP_TYPES.find(c => c.id === p.cropId)!;
             const totalDuration = crop.growthTime * 60 * 60 * 1000;
             
             if (timeSincePlanted >= totalDuration) {
               changed = true;
               return { ...p, status: 'ready', needsWatering: false };
             }
             
             const progress = timeSincePlanted / totalDuration;
             const requiredWaterings = crop.growthTime >= 10 ? 2 : 1;
             const currentWaterCount = p.waterCount || 0;
             
             let shouldNeedWatering = false;
             if (requiredWaterings === 1 && currentWaterCount === 0 && progress >= 0.5) {
               shouldNeedWatering = true;
             } else if (requiredWaterings === 2) {
               if (currentWaterCount === 0 && progress >= 0.33) shouldNeedWatering = true;
               if (currentWaterCount === 1 && progress >= 0.66) shouldNeedWatering = true;
             }
             
             if (shouldNeedWatering && !p.needsWatering) {
               changed = true;
               return { ...p, needsWatering: true, lastWateredTime: Date.now() };
             }
             
             // Die if not watered for 2 hours
             if (p.needsWatering && (Date.now() - (p.lastWateredTime || 0)) > 2 * 60 * 60 * 1000) {
               changed = true;
               return { ...p, status: 'dead', needsWatering: false };
             }
           }
           return p;
         });
         return changed ? next : prev;
       });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [stickers, setStickers] = useState<string[]>([]);
  const stickerInputRef = useRef<HTMLInputElement>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [newChar, setNewChar] = useState<Partial<Character>>({
    name: '', gender: '', age: '', personality: '', habits: '', signature: '', settings: '', avatar: getRandomAnimalEmoji(), favorability: 0,
    minResponseTime: 3, maxResponseTime: 35, maxMessagesPerTurn: 3,
    chatBackground: '', myBubbleCss: '', theirBubbleCss: '',
    charNickname: '', userNickname: '', relationship: '', location: '', locationInterval: 1
  });

  const lockWallRef = useRef<HTMLInputElement>(null);
  const homeWallRef = useRef<HTMLInputElement>(null);
  const avatarWallRef = useRef<HTMLInputElement>(null);
  const charAvatarRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const [targetIconId, setTargetIconId] = useState<AppId | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [systemMemos, setSystemMemos] = useState<Memo[]>([]);
  const [isSystemChatHidden, setIsSystemChatHidden] = useState(false);
  const [wheelSpins, setWheelSpins] = useState(3);
  const [lastWheelReset, setLastWheelReset] = useState('');
  const [wheelRewards, setWheelRewards] = useState<number[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [input, setInput] = useState('');
  const [typingChatId, setTypingChatId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendNudge = (character: Character) => {
    if (selectedChatId === 'system') return;
    const nudgeText = `拍了拍他的 ${nudgeInput || '...'}`;
    const nudgeMsg: Message = { role: 'user', text: `[拍一拍] ${nudgeText}` };
    setCharacters(prev => prev.map(c => c.id === character.id ? { ...c, messages: [...c.messages, nudgeMsg] } : c));
    setIsEmojiPickerOpen(false);
    setNudgeInput('');
  };

  const addMemo = (chatId: string) => {
    if (!memoInput.trim()) return;
    const newMemo: Memo = { id: Date.now().toString(), text: memoInput, completed: false };
    if (chatId === 'system') {
      setSystemMemos(prev => [...prev, newMemo]);
    } else {
      setCharacters(prev => prev.map(c => c.id === chatId ? { ...c, memos: [...(c.memos || []), newMemo] } : c));
    }
    setMemoInput('');
  };

  const toggleMemo = (chatId: string, memoId: string) => {
    if (chatId === 'system') {
      setSystemMemos(prev => prev.map(m => m.id === memoId ? { ...m, completed: !m.completed } : m));
    } else {
      setCharacters(prev => prev.map(c => c.id === chatId ? { ...c, memos: (c.memos || []).map(m => m.id === memoId ? { ...m, completed: !m.completed } : m) } : c));
    }
  };

  const deleteMemo = (chatId: string, memoId: string) => {
    if (chatId === 'system') {
      setSystemMemos(prev => prev.filter(m => m.id !== memoId));
    } else {
      setCharacters(prev => prev.map(c => c.id === chatId ? { ...c, memos: (c.memos || []).filter(m => m.id !== memoId) } : c));
    }
  };
  
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const Header = ({ title, onBack }: { title: string, onBack: () => void }) => (
    <div className={`px-4 pt-16 pb-3 flex items-center border-b ${isDarkMode ? 'bg-[#1c1c1e] border-[#38383a]' : 'bg-[#f2f2f7] border-neutral-200'} sticky top-0 z-10`}>
      <button onClick={onBack} className="text-[#007AFF] flex items-center gap-0.5 font-medium transition-colors"><ChevronLeft size={20} strokeWidth={2.5} /> 返回</button>
      <h2 className={`flex-1 text-center font-bold mr-10 ${isDarkMode ? 'text-white' : 'text-black'}`}>{title}</h2>
    </div>
  );

  // Persistence state
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ais_app_data');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.userProfile) setUserProfile(data.userProfile);
        if (data.characters) setCharacters(data.characters);
        if (data.stickers) setStickers(data.stickers);
        if (data.lockWallpaper) setLockWallpaper(data.lockWallpaper);
        if (data.homeWallpaper) setHomeWallpaper(data.homeWallpaper);
        if (data.customIcons) setCustomIcons(data.customIcons);
        if (data.diaryEntries) setDiaryEntries(data.diaryEntries);
        if (data.installedApps) {
          let apps = data.installedApps.filter((a: string) => a !== 'beautify' && a !== 'game');
          if (!apps.includes('wheel')) apps.push('wheel');
          if (!apps.includes('fishing')) apps.push('fishing');
          if (!apps.includes('warehouse')) apps.push('warehouse');
          if (!apps.includes('dex')) apps.push('dex');
          setInstalledApps(apps);
        }
        if (data.dockApps) setDockApps(data.dockApps);
        if (data.isDarkMode !== undefined) setIsDarkMode(data.isDarkMode);
        if (data.messages) setMessages(data.messages);
        if (data.appNames) {
          const { beautify, ...rest } = data.appNames;
          setAppNames({ ...rest, diary: '日曆', wheel: '每日轉盤', warehouse: '倉庫', fishing: '釣魚', dex: '圖鑑' });
        }
        if (data.walletBalance !== undefined) setWalletBalance(data.walletBalance);
        if (data.warehouseItems) setWarehouseItems(data.warehouseItems);
        if (data.gardenPatches) setGardenPatches(data.gardenPatches);
      }
    } catch (e) {
      console.error("Failed to load persistence data", e);
    }
    setIsLoaded(true);
  }, []);

  // Migration and Persistence
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const saved = localStorage.getItem('ais_app_data');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.systemMemos) setSystemMemos(data.systemMemos);
        if (data.isSystemChatHidden !== undefined) setIsSystemChatHidden(data.isSystemChatHidden);
        if (data.wheelSpins !== undefined) setWheelSpins(data.wheelSpins);
        if (data.lastWheelReset) setLastWheelReset(data.lastWheelReset);
        if (data.wheelRewards) setWheelRewards(data.wheelRewards);
      }
    } catch (e) {}

    // Midnight Check & Daily Spin Reset
    const today = new Date().toLocaleDateString();
    setLastWheelReset(prev => {
      if (prev !== today) {
        setWheelSpins(3);
        const dailyRewards = Array.from({ length: 7 }, () => Math.floor(Math.random() * 11) + 10);
        setWheelRewards(dailyRewards);
        return today;
      }
      return prev;
    });
    
    // Migrate old default avatars to emojis
    const oldUserDefault = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150';
    const oldCharDefault = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=150';

    if (userProfile.avatar === oldUserDefault) {
      setUserProfile(prev => ({ ...prev, avatar: '🥕' }));
    }

    setCharacters(prev => prev.map(c => {
      if (c.avatar === oldCharDefault) {
        return { ...c, avatar: getRandomAnimalEmoji() };
      }
      return c;
    }));
  }, [isLoaded]);

  // Save to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    const data = {
      userProfile,
      characters,
      stickers,
      lockWallpaper,
      homeWallpaper,
      customIcons,
      appNames,
      installedApps,
      dockApps,
      isDarkMode,
      messages,
      diaryEntries,
      systemMemos,
      isSystemChatHidden,
      wheelSpins,
      lastWheelReset,
      wheelRewards,
      walletBalance,
      warehouseItems,
      gardenPatches
    };
    localStorage.setItem('ais_app_data', JSON.stringify(data));
  }, [
    isLoaded,
    userProfile,
    characters,
    stickers,
    lockWallpaper,
    homeWallpaper,
    customIcons,
    appNames,
    installedApps,
    dockApps,
    isDarkMode,
    messages,
    diaryEntries,
    walletBalance,
    warehouseItems,
    gardenPatches,
    systemMemos,
    isSystemChatHidden,
    wheelSpins,
    lastWheelReset,
    wheelRewards
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, characters, selectedChatId]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', text: input };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    const currentInput = input;
    setInput('');
    setTypingChatId('system');
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: currentMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        config: { systemInstruction: `你是一個住在 iPhone 裡的 AI 助手。
你的回覆風格：
1. 像真人一樣說話，口語化、親切、現代且有禮貌。
2. 保持簡潔，盡量使用短句。
3. 避免一次輸出大段文字，如果是複雜的回答，請分成多個連貫的小短句。
目前使用者姓名是 ${userProfile.name}。` }
      });
      
      if (response.text) {
        // Split by major punctuation while keeping them
        const sentences = response.text.split(/([。！？\n])/).reduce((acc: string[], val, i) => {
          if (i % 2 === 0) acc.push(val);
          else if (acc.length > 0) acc[acc.length - 1] += val;
          return acc;
        }, []).filter(s => s.trim().length > 0);

        for (const sentence of sentences) {
          setTypingChatId('system');
          await new Promise(r => setTimeout(r, 600 + Math.random() * 800)); // Typing delay
          setMessages(prev => [...prev, { role: 'model', text: sentence.trim() }]);
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "機器人似乎遇到了問題，請檢查您的 API 金鑰。 " + (error instanceof Error ? error.message : "") }]);
    } finally { setTypingChatId(null); }
  };

  const handleCharacterChat = async (character: Character, text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', text };
    const currentHistory = [...character.messages, userMsg];

    const uncompletedMemos = (character.memos || []).filter(m => !m.completed).map(m => m.text);
    const memoContext = uncompletedMemos.length > 0 
      ? `\n\n注意：使用者目前有以下「待辦備忘錄」尚未完成：\n${uncompletedMemos.map(t => `- ${t}`).join('\n')}\n請你在對話中「自然且符合你設定的語氣和性格」地適時提醒或關心使用者這些事情的進度，不要太刻意，要像朋友或伴侶間的閒聊提醒。`
      : "";
    
    setCharacters(prev => prev.map(c => 
      c.id === character.id ? { ...c, messages: currentHistory } : c
    ));
    const currentInput = text;
    setInput('');
    setTypingChatId(character.id);

    try {
      const systemPrompt = `你現在扮演一個角色：
角色姓名：${character.name}
妳對他的暱稱：${character.charNickname || '無'}
他對妳的暱稱：${character.userNickname || '無'}
妳與他的關係：${character.relationship || '無'}
出沒區域：${character.location || '未知'}
個性：${character.personality}
習性：${character.habits}
好感度：${character.favorability} (好感度越高，說話語氣可以越親暱)
${memoContext}

對話風格要求：
1. 嚴格遵守角色設定的性格和說話方式。
2. 妳對使用者的暱稱必須是「${character.userNickname || userProfile.name}」。
3. 妳與使用者的關係是「${character.relationship || '陌生人'}」，請根據此關係調整語態。
4. 像在通訊軟體聊天一樣，多用短句。
5. 避免長篇大論，盡量分段表達。
6. 自然地使用語助詞，口語化。
請以這個角色的口吻和使用者對話。使用者姓名是 ${userProfile.name}。`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: currentHistory.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        config: { systemInstruction: systemPrompt }
      });

      // Increase favorability slightly on each successful interaction (randomly between 1-5, no limit)
      setCharacters(prev => prev.map(c => 
        c.id === character.id ? { ...c, favorability: (c.favorability || 0) + (Math.floor(Math.random() * 5) + 1) } : c
      ));

      if (response.text) {
        const fullSentences = response.text.split(/([。！？\n])/).reduce((acc: string[], val, i) => {
          if (i % 2 === 0) acc.push(val);
          else if (acc.length > 0) acc[acc.length - 1] += val;
          return acc;
        }, []).filter(s => s.trim().length > 0);

        // Respect maxMessagesPerTurn
        const sentences = fullSentences.slice(0, character.maxMessagesPerTurn || 3);

        const minDelay = (character.minResponseTime || 1) * 1000;
        const maxDelay = (character.maxResponseTime || 30) * 1000;

        for (let i = 0; i < sentences.length; i++) {
          setTypingChatId(character.id);
          
          // Initial delay for the first message, staggered for subsequent ones
          const waitTime = i === 0 
            ? minDelay + Math.random() * (maxDelay - minDelay)
            : 500 + Math.random() * 1000; 

          await new Promise(r => setTimeout(r, waitTime));
          
          setCharacters(prev => prev.map(c => 
            c.id === character.id ? { ...c, messages: [...c.messages, { role: 'model', text: sentences[i].trim() }] } : c
          ));
        }
      }
    } catch (error) {
      console.error(error);
      setCharacters(prev => prev.map(c => 
        c.id === character.id ? { ...c, messages: [...c.messages, { role: 'model', text: "系統異常：" + (error instanceof Error ? error.message : "") }] } : c
      ));
    } finally { setTypingChatId(null); }
  };

  const openApp = (app: AppId) => {
    if (isJiggling) return;
    setActiveApp(app);
    setScreenState(ScreenState.AppOpen);
    setSettingsSubPage('main');
    setSelectedChatId(null);
    setIsChatConfigOpen(false);
  };

  const goHome = () => {
    setScreenState(ScreenState.Home);
    setActiveApp(null);
    setIsJiggling(false);
    setSelectedChatId(null);
    setIsChatConfigOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleHomePointerDown = (id?: AppId) => {
    if (isJiggling) return;
    longPressTimer.current = setTimeout(() => {
      setIsJiggling(true);
    }, 800);
  };

  const handleHomePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const swapApps = (draggedId: AppId, targetId: AppId, list: AppId[], setList: (l: AppId[]) => void) => {
    const fromIndex = list.indexOf(draggedId);
    const toIndex = list.indexOf(targetId);
    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      const newList = [...list];
      newList.splice(fromIndex, 1);
      newList.splice(toIndex, 0, draggedId);
      setList(newList);
    }
  };

  const addApp = (app: AppId) => {
    if (!installedApps.includes(app) && !dockApps.includes(app)) {
      setInstalledApps(prev => [...prev, app]);
    }
    setIsAddingApp(false);
  };

  const getIconColor = (id: AppId) => {
    switch(id) {
      case 'messages': return '#34C759';
      case 'settings': return '#AEAEB2';
      case 'store': return '#007AFF';
      case 'phone': return '#34C759';
      case 'diary': return '#FFCC00';
      case 'kitchen': return '#FF9500';
      case 'wallet': return '#5856D6';
      case 'garden': return '#4CD964';
      case 'photos': return '#5AC8FA';
      case 'characters': return '#AF52DE';
      case 'warehouse': return '#8E8E93';
      case 'fishing': return '#007AFF';
      case 'wheel': return '#FF9500';
      case 'dex': return '#FF2D55';
      default: return '#AEAEB2';
    }
  };

  const getIconElement = (id: AppId) => {
    const iconColorClass = "text-inherit";
    switch (id) {
      case 'messages': return <MessageCircle className={iconColorClass} size={30} />;
      case 'settings': return <SettingsIcon className={iconColorClass} size={30} />;
      case 'store': return <ShoppingBag className={iconColorClass} size={30} />;
      case 'phone': return <Phone className={iconColorClass} size={30} />;
      case 'diary': return <Book className={iconColorClass} size={30} />;
      case 'kitchen': return <UtensilsCrossed className={iconColorClass} size={30} />;
      case 'wallet': return <WalletIcon className={iconColorClass} size={30} />;
      case 'garden': return <Leaf className={iconColorClass} size={30} />;
      case 'photos': return <Mail className={iconColorClass} size={30} />;
      case 'characters': return <Users className={iconColorClass} size={30} />;
      case 'warehouse': return <Archive className={iconColorClass} size={30} />;
      case 'fishing': return <Fish className={iconColorClass} size={30} />;
      case 'wheel': return <Disc className={iconColorClass} size={30} />;
      case 'dex': return <BookOpen className={iconColorClass} size={30} />;
      default: return <Smartphone className={iconColorClass} size={30} />;
    }
  };

  const removeApp = (app: AppId) => {
    setInstalledApps(prev => prev.filter(a => a !== app));
  };

  const removeDockApp = (app: AppId) => {
    setDockApps(prev => prev.filter(a => a !== app));
  };

  const renderSettings = () => {
    if (settingsSubPage === 'ai-config' as any) return (
      <div className={`flex-1 ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto`}>
        <Header title="AI 助手設定" onBack={() => setSettingsSubPage('main')} />
        <div className="p-4 space-y-6">
          <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl p-4 shadow-sm space-y-4`}>
            <div>
              <label className="text-xs font-bold text-neutral-400 block mb-1 uppercase px-1">Gemini API 金鑰</label>
              <input 
                type="password"
                className={`w-full text-sm outline-none px-4 py-3 rounded-lg ${isDarkMode ? 'bg-black/40 text-white border border-[#38383a]' : 'bg-neutral-50 text-black border border-neutral-100'}`}
                value={aiSettings.apiKey}
                onChange={e => setAiSettings(p => ({ ...p, apiKey: e.target.value }))}
                placeholder="在此輸入您的 Gemini API Key"
              />
              <p className="text-[10px] text-neutral-400 mt-2 px-1 leading-relaxed">
                您的 API 金鑰將儲存在此 App 的狀態中。若要獲取金鑰，請訪問 Google AI Studio。
              </p>
            </div>
            
            <div className="pt-2">
              <label className="text-xs font-bold text-neutral-400 block mb-1 uppercase px-1">模型選擇</label>
              <select 
                className={`w-full text-sm outline-none px-4 py-3 rounded-lg appearance-none ${isDarkMode ? 'bg-black/40 text-white border border-[#38383a]' : 'bg-neutral-50 text-black border border-neutral-100'}`}
                value={aiSettings.model}
                onChange={e => setAiSettings(p => ({ ...p, model: e.target.value }))}
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (快速)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (強大)</option>
                <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (實驗性)</option>
              </select>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <Bot size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm">AI 機器人狀態</h4>
                <p className={`text-xs ${aiSettings.apiKey ? 'text-green-500' : 'text-neutral-400'}`}>
                  {aiSettings.apiKey ? '● 已就緒' : '○ 尚未設定'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    if (settingsSubPage === 'profile') return (
      <div className={`flex-1 ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto`}>
        <Header title="個人資料" onBack={() => setSettingsSubPage('main')} />
        <div className="p-4 space-y-4">
          <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl p-6 flex flex-col items-center gap-4`}>
              <div 
                className="w-24 h-24 rounded-full overflow-hidden bg-neutral-200 border-4 border-neutral-100 shadow-sm cursor-pointer group relative"
                onClick={() => avatarWallRef.current?.click()}
              >
                <AvatarImage src={userProfile.avatar} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                  <CameraIcon size={24} />
                </div>
              </div>
            <p className="text-xs text-neutral-400">點擊大頭照更換</p>
          </div>

          <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl divide-y ${isDarkMode ? 'divide-[#38383a]' : 'divide-neutral-100'} overflow-hidden`}>
            <ProfileInput label="姓名" value={userProfile.name} isDark={isDarkMode} onChange={v => setUserProfile(p => ({ ...p, name: v }))} />
            <div className="px-5 py-3 flex items-center">
              <span className="w-20 text-sm font-medium">簽名</span>
              <input 
                className={`flex-1 text-sm outline-none bg-transparent ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`} 
                value={userProfile.signature} 
                onChange={e => setUserProfile(p => ({ ...p, signature: e.target.value }))} 
                placeholder="請輸入個人簽名" 
              />
            </div>
            <ProfileInput label="年齡" value={userProfile.age} isDark={isDarkMode} onChange={v => setUserProfile(p => ({ ...p, age: v }))} />
            <ProfileInput label="性別" value={userProfile.gender} isDark={isDarkMode} onChange={v => setUserProfile(p => ({ ...p, gender: v }))} />
          </div>
          <input type="file" hidden ref={avatarWallRef} accept="image/*" onChange={e => handleImageUpload(e, (url) => setUserProfile(p => ({ ...p, avatar: url })))} />
        </div>
      </div>
    );

    if (settingsSubPage === 'wallpaper') return (
      <div className={`flex-1 ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto`}>
        <Header title="背景圖片" onBack={() => setSettingsSubPage('main')} />
        <div className="p-6 flex flex-col items-center gap-6">
          <div className="flex gap-6">
            <WallpaperThumb label="鎖定螢幕" src={lockWallpaper} onClick={() => lockWallRef.current?.click()} />
            <WallpaperThumb label="主畫面" src={homeWallpaper} onClick={() => homeWallRef.current?.click()} />
          </div>
          <div className={`w-full ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl p-4 flex items-center justify-between`}>
            <span className="font-medium">深色模式</span>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-12 h-7 rounded-full relative transition-colors duration-200 ${isDarkMode ? 'bg-[#34C759]' : 'bg-neutral-200'}`}
            >
              <motion.div 
                animate={{ x: isDarkMode ? 20 : 2 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>
          <input type="file" hidden ref={lockWallRef} accept="image/*" onChange={e => handleImageUpload(e, setLockWallpaper)} />
          <input type="file" hidden ref={homeWallRef} accept="image/*" onChange={e => handleImageUpload(e, setHomeWallpaper)} />
        </div>
      </div>
    );

    if (settingsSubPage === 'icons') return (
      <div className={`flex-1 ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto`}>
        <Header title="更換圖示與名稱" onBack={() => setSettingsSubPage('main')} />
        <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} m-4 rounded-xl divide-y ${isDarkMode ? 'divide-[#38383a]' : 'divide-neutral-100'}`}>
          {(Object.keys(appNames) as AppId[]).map(id => (
            <div key={id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                    {customIcons[id] ? <img src={customIcons[id]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-neutral-400 capitalize">{id[0]}</div>}
                  </div>
                  <input 
                    className="bg-transparent border-none outline-none font-medium" 
                    value={appNames[id]} 
                    onChange={e => setAppNames(p => ({ ...p, [id]: e.target.value }))}
                  />
                </div>
                <button onClick={() => { setTargetIconId(id); iconInputRef.current?.click(); }} className="text-[#007AFF] text-xs font-bold">更換圖示</button>
              </div>
            </div>
          ))}
        </div>
        <input type="file" hidden ref={iconInputRef} accept="image/*" onChange={e => targetIconId && handleImageUpload(e, url => setCustomIcons(p => ({ ...p, [targetIconId]: url })))} />
      </div>
    );

    return (
      <div className={`flex-1 ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto`}>
        <div className="px-5 pt-12 pb-20">
          <h2 className={`text-3xl font-extrabold mb-5 px-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>設定</h2>
          
          {/* Search Bar Placeholder */}
          <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white/80'} backdrop-blur-md rounded-xl px-3 py-2 flex gap-2 mb-6 text-neutral-400 items-center`}>
            <Search size={16} /> 
            <span className="text-sm">搜尋</span>
          </div>
          
          {/* iCloud Profile Section */}
          <div onClick={() => setSettingsSubPage('profile')} className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl p-3 flex items-center gap-4 mb-6 shadow-sm active:opacity-70 transition-opacity cursor-pointer`}>
            <div 
              className="w-14 h-14 bg-neutral-300 rounded-full flex items-center justify-center text-white overflow-hidden border border-white/10"
            >
                <AvatarImage src={userProfile.avatar} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>{userProfile.name}</h3>
              <p className="text-[11px] opacity-60">Apple ID, iCloud, 媒體與購買項目</p>
            </div>
            <ChevronRight className="text-neutral-300" size={18} />
          </div>

          {/* Settings Groups */}
          <div className="space-y-6">
            <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl overflow-hidden divide-y ${isDarkMode ? 'divide-[#38383a]' : 'divide-neutral-100'} shadow-sm`}>
              <SettingsRow icon={<Bot className="text-white" size={18} />} iconBg="#007AFF" label="AI 助手與 API 設定" onClick={() => setSettingsSubPage('ai-config' as any)} />
              <SettingsRow icon={<ImageIcon className="text-white" size={18} />} iconBg="#34C759" label="背景圖片與外觀" onClick={() => setSettingsSubPage('wallpaper')} />
              <SettingsRow icon={<Palette className="text-white" size={18} />} iconBg="#FF9500" label="圖示與自定義名稱" onClick={() => setSettingsSubPage('icons')} />
            </div>

            <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl overflow-hidden divide-y ${isDarkMode ? 'divide-[#38383a]' : 'divide-neutral-100'} shadow-sm`}>
              <SettingsRow icon={<SettingsIcon className="text-white" size={18} />} iconBg="#8E8E93" label="一般" onClick={() => {}} />
              <SettingsRow icon={<Lock className="text-white" size={18} />} iconBg="#5856D6" label="隱私權與安全性" onClick={() => {}} />
            </div>
            
            <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl overflow-hidden shadow-sm mt-6`}>
              <button 
                onClick={() => setIsResetConfirmOpen(true)}
                className="w-full py-3 px-4 text-center text-red-500 font-semibold active:bg-neutral-100/10"
              >
                重置玩家資料
              </button>
            </div>
          </div>
          
          {isResetConfirmOpen && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <div className={`${isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-white text-black'} rounded-2xl w-full max-w-[300px] overflow-hidden shadow-2xl`}>
                <div className="p-5 text-center">
                  <h3 className="text-lg font-bold mb-2 text-red-500">重置玩家資料</h3>
                  <p className="text-sm opacity-80 leading-relaxed">確定要重置所有玩家資料嗎？這將刪除包含釣魚、花園、訊息、角色紀錄以及錢包金幣。此操作無法復原。</p>
                </div>
                <div className={`flex border-t ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-200'}`}>
                  <button 
                    onClick={() => setIsResetConfirmOpen(false)}
                    className="flex-1 py-3 text-center border-r border-inherit active:bg-neutral-100/10"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => {
                      setWarehouseItems([]);
                      setGardenPatches(Array.from({ length: 8 }, (_, i) => ({ id: i, status: i < 4 ? 'empty' : 'locked' })));
                      setMessages([]);
                      setCharacters([]);
                      setWalletBalance(1000);
                      setIsResetConfirmOpen(false);
                    }}
                    className="flex-1 py-3 text-center font-bold text-red-500 active:bg-neutral-100/10"
                  >
                    重置
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <p className="mt-12 text-center text-[10px] opacity-30 font-mono">Software Version: 17.4.1 (21E236)</p>
        </div>
      </div>
    );
  };

  const renderCharacters = () => {
    if (characterSubPage === 'add' || (characterSubPage === 'edit' && selectedCharacter)) {
      const isEdit = characterSubPage === 'edit';
      const charToEdit = isEdit ? characters.find(c => c.id === selectedCharacter?.id) || newChar : newChar;

      return (
        <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} h-full`}>
          <Header title={isEdit ? "修改角色" : "製作角色"} onBack={() => setCharacterSubPage(isEdit ? 'details' : 'list')} />
          <div className="p-4 space-y-4 overflow-y-auto pb-20">
            <div className="flex flex-col items-center gap-2 mb-4">
              <div 
                className="w-20 h-20 rounded-full overflow-hidden bg-neutral-200 border-2 border-white shadow-md cursor-pointer group relative"
                onClick={() => charAvatarRef.current?.click()}
              >
                <AvatarImage src={isEdit ? charToEdit.avatar : newChar.avatar} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                  <CameraIcon size={20} />
                </div>
              </div>
              <button 
                className="text-xs text-[#007AFF] font-medium"
                onClick={() => charAvatarRef.current?.click()}
              >
                更換角色照片
              </button>
              <input 
                type="file" 
                hidden 
                ref={charAvatarRef} 
                accept="image/*" 
                onChange={e => handleImageUpload(e, (url) => {
                  if (isEdit) {
                    setCharacters(prev => prev.map(c => c.id === selectedCharacter?.id ? { ...c, avatar: url } : c));
                  } else {
                    setNewChar(prev => ({ ...prev, avatar: url }));
                  }
                })} 
              />
            </div>
            
            <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-xl divide-y ${isDarkMode ? 'divide-[#38383a]' : 'divide-neutral-100'} overflow-hidden shadow-sm`}>
              {[
                { label: '姓名', key: 'name', placeholder: '例如：艾莉絲' },
                { label: '性別', key: 'gender', placeholder: '例如：女' },
                { label: '年齡', key: 'age', placeholder: '例如：20' },
                { label: '性格簽名', key: 'signature', placeholder: '一句話介紹自己' },
                { label: '基本設定', key: 'settings', placeholder: '角色的背景故事或詳細設定' },
                { label: '妳對他的暱稱', key: 'charNickname', placeholder: '例如：笨蛋、親愛的' },
                { label: '他對妳的暱稱', key: 'userNickname', placeholder: '例如：主人、小貓' },
                { label: '妳與他的關係', key: 'relationship', placeholder: '例如：青梅竹馬、僕人' },
                { label: '出沒區域', key: 'location', placeholder: '例如：學校後花園' },
                { label: '個性', key: 'personality', placeholder: '例如：溫柔、聰明' },
                { label: '習性', key: 'habits', placeholder: '例如：喜歡喝下午茶' },
                { label: '好感度', key: 'favorability', placeholder: '0 - 100', type: 'number' },
              ].map((item) => (
                <div key={item.key} className="px-5 py-3 flex items-center">
                  <span className="w-20 text-sm font-medium">{item.label}</span>
                  <input 
                    type="text"
                    inputMode={item.type === 'number' ? 'numeric' : 'text'}
                    className={`flex-1 text-sm outline-none bg-transparent ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`} 
                    value={isEdit ? (charToEdit as any)[item.key] : ((newChar as any)[item.key] === 0 && item.type === 'number' ? '' : (newChar as any)[item.key])} 
                    onChange={e => {
                      const val = item.type === 'number' ? (e.target.value === '' ? 0 : parseInt(e.target.value) || 0) : e.target.value;
                      if (isEdit) {
                        setCharacters(prev => prev.map(c => c.id === selectedCharacter?.id ? { ...c, [item.key]: val } : c));
                      } else {
                        setNewChar(prev => ({ ...prev, [item.key]: val }));
                      }
                    }}
                    placeholder={item.placeholder}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4 px-1 py-1">
              {/* Removed Location Interval slider from here */}
            </div>

            <button 
              onClick={() => {
                if (isEdit) {
                  setCharacterSubPage('details');
                } else {
                  if (!newChar.name) {
                    alert('請輸入角色姓名');
                    return;
                  }
                  const char: Character = {
                    id: Date.now().toString(),
                    name: newChar.name || '無名',
                    gender: newChar.gender || '未知',
                    age: newChar.age || '未知',
                    personality: newChar.personality || '普通',
                    habits: newChar.habits || '無',
                    signature: newChar.signature || '',
                    settings: newChar.settings || '',
                    avatar: newChar.avatar || getRandomAnimalEmoji(),
                    favorability: Number(newChar.favorability) || 0,
                    messages: [],
                    memos: [],
                    minResponseTime: newChar.minResponseTime || 3,
                    maxResponseTime: newChar.maxResponseTime || 35,
                    maxMessagesPerTurn: newChar.maxMessagesPerTurn || 3,
                    chatBackground: newChar.chatBackground || '',
                    myBubbleCss: newChar.myBubbleCss || '',
                    theirBubbleCss: newChar.theirBubbleCss || '',
                    charNickname: newChar.charNickname || '',
                    userNickname: newChar.userNickname || '',
                    relationship: newChar.relationship || '',
                    location: newChar.location || '',
                    locationInterval: newChar.locationInterval || 1,
                    walletBalance: 300
                  };
                  setCharacters(prev => [...prev, char]);
                  setNewChar({
                    name: '', gender: '', age: '', personality: '', habits: '', signature: '', settings: '', avatar: getRandomAnimalEmoji(), favorability: 0,
                    minResponseTime: 3, maxResponseTime: 35, maxMessagesPerTurn: 3,
                    chatBackground: '', myBubbleCss: '', theirBubbleCss: '',
                    charNickname: '', userNickname: '', relationship: '', location: '', locationInterval: 1
                  });
                  setCharacterSubPage('list');
                }
              }}
              className="w-full py-4 bg-[#007AFF] text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform mt-4"
            >
              {isEdit ? "更新完成" : "完成製作"}
            </button>
          </div>
        </div>
      );
    }

    if (characterSubPage === 'details' && selectedCharacter) {
      const char = characters.find(c => c.id === selectedCharacter.id) || selectedCharacter;
      return (
        <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto pb-20`}>
          <div className={`px-4 pt-16 pb-3 flex items-center justify-between sticky top-0 z-10 ${isDarkMode ? 'bg-black' : 'bg-[#f2f2f7]'}`}>
            <button onClick={() => setCharacterSubPage('list')} className="text-[#007AFF] flex items-center gap-0.5 font-medium"><ChevronLeft size={20} />返回</button>
            <h2 className="font-bold">角色簡介</h2>
            <button onClick={() => setCharacterSubPage('edit')} className="text-[#007AFF] font-medium px-2">修改</button>
          </div>

          <div className="flex flex-col items-center mt-6 px-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl mb-4">
              <AvatarImage src={char.avatar} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{char.name}</h3>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-[#FF2D55]/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Heart size={14} className="fill-[#FF2D55] text-[#FF2D55]" />
                <span className="text-sm font-bold text-[#FF2D55]">{char.favorability}</span>
              </div>
              <span className="text-xs opacity-40">好感度</span>
            </div>

            <div className={`w-full ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-2xl p-6 shadow-sm space-y-6 mb-10`}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">性別</label>
                  <p className="font-medium">{char.gender}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">年齡</label>
                  <p className="font-medium">{char.age} 歲</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">妳對他的暱稱</label>
                  <p className="font-medium">{char.charNickname || '無'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">他對妳的暱稱</label>
                  <p className="font-medium">{char.userNickname || '無'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">妳與他的關係</label>
                  <p className="font-medium">{char.relationship || '無'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">出沒地點</label>
                  <p className="font-medium">{char.location || '未知'}</p>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">個性簽名</label>
                <div className="flex items-center gap-2">
                  <input 
                    className={`flex-1 text-sm font-medium leading-relaxed italic border-b border-dashed ${isDarkMode ? 'bg-transparent border-white/20 text-white' : 'bg-transparent border-black/10 text-black'} outline-none`}
                    value={char.signature}
                    onChange={(e) => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, signature: e.target.value } : c))}
                    placeholder="點擊修改個性簽名..."
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">管理與監視</label>
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      setSelectedCharacter(char);
                      setCharacterSubPage('peeper');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#5856D6]/10 text-[#5856D6] rounded-xl font-bold text-sm active:scale-95 transition-transform"
                  >
                    <Eye size={18} />
                    偷窺者模式
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">個性</label>
                <p className="font-medium leading-relaxed">{char.personality}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">習性</label>
                <p className="font-medium leading-relaxed">{char.habits}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold opacity-30 uppercase block mb-1">基本設定</label>
                <p className="font-medium leading-relaxed text-sm opacity-80">{char.settings}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (characterSubPage === 'peeper' && selectedCharacter) {
      const char = characters.find(c => c.id === selectedCharacter.id) || selectedCharacter;
      return (
        <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-y-auto pb-20`}>
          <Header title="偷窺者模式" onBack={() => setCharacterSubPage('details')} />
          <div className="p-6 space-y-6">
            <div className={`p-6 rounded-[32px] ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} shadow-xl border ${isDarkMode ? 'border-white/5' : 'border-neutral-100'} flex flex-col items-center gap-4 text-center`}>
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#5856D6] shadow-lg">
                <AvatarImage src={char.avatar} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-black text-xl">{char.name} 的隱私錢包</h4>
                <p className="text-xs opacity-40 mt-1 uppercase tracking-tighter">Authorized Access Only</p>
              </div>
              <div className="py-8 w-full">
                <div className="text-5xl font-black text-[#5856D6] tracking-tighter drop-shadow-sm">
                  ${char.walletBalance !== undefined ? char.walletBalance : 300}
                </div>
                <div className="text-[10px] font-bold opacity-30 mt-2 uppercase tracking-[0.2em]">Current Balance</div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'} border flex items-start gap-3`}>
              <div className="text-red-500 mt-0.5"><Info size={16} /></div>
              <p className="text-[11px] leading-relaxed opacity-60">
                警告：偷窺者模式僅供監視角色財務狀況之用。任何未經授權的修改可能會導致角色關係破裂或 AI 意識崩潰。
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white'} border ${isDarkMode ? 'border-white/5' : 'border-neutral-100'}`}>
                <div className="text-[10px] font-bold opacity-30 uppercase mb-1">今日收入</div>
                <div className="text-lg font-bold text-green-500">+$0</div>
              </div>
              <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white'} border ${isDarkMode ? 'border-white/5' : 'border-neutral-100'}`}>
                <div className="text-[10px] font-bold opacity-30 uppercase mb-1">今日支出</div>
                <div className="text-lg font-bold text-red-500">-$0</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} relative`}>
        <div className={`px-4 pt-16 pb-3 flex items-center justify-between sticky top-0 z-10 ${isDarkMode ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-md`}>
          <div className="flex items-center gap-2">
            {!isSelectionMode ? (
              <button 
                onClick={() => setCharacterSubPage('add')} 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-[#007AFF] active:scale-90 transition-transform ${isDarkMode ? 'bg-white/10' : 'bg-neutral-100'}`}
              >
                <Plus size={24} />
              </button>
            ) : (
              <button 
                onClick={() => {
                  if (selectedCharIds.size === characters.length) {
                    setSelectedCharIds(new Set());
                  } else {
                    setSelectedCharIds(new Set(characters.map(c => c.id)));
                  }
                }}
                className="text-[#007AFF] font-medium text-sm"
              >
                {selectedCharIds.size === characters.length ? '取消全選' : '全選'}
              </button>
            )}
          </div>
          <h2 className="text-lg font-bold">AI 夥伴</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setIsSelectionMode(!isSelectionMode);
                setSelectedCharIds(new Set());
              }} 
              className="text-[#007AFF] font-medium px-2"
            >
              {isSelectionMode ? '取消' : '選取'}
            </button>
            {!isSelectionMode && (
              <button onClick={goHome} className="text-[#007AFF] font-medium px-2">關閉</button>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {!isSelectionMode && (
            <div className="relative">
              <div className={`absolute inset-y-0 left-3 flex items-center text-neutral-400`}><Search size={16} /></div>
              <input className={`w-full ${isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-white text-black'} rounded-xl py-3 pl-10 pr-4 text-sm outline-none shadow-sm border ${isDarkMode ? 'border-transparent' : 'border-neutral-100'}`} placeholder="搜尋角色檔案" />
            </div>
          )}

          <div className={`flex flex-col gap-3 ${isSelectionMode ? 'pb-32' : 'pb-20'}`}>
            {characters.map(char => {
              const isSelected = selectedCharIds.has(char.id);
              return (
                <motion.div 
                  key={char.id} 
                  layoutId={`char-${char.id}`}
                  onClick={() => {
                    if (isSelectionMode) {
                      const next = new Set(selectedCharIds);
                      if (next.has(char.id)) next.delete(char.id);
                      else next.add(char.id);
                      setSelectedCharIds(next);
                    } else {
                      setSelectedCharacter(char);
                      setCharacterSubPage('details');
                    }
                  }}
                  className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-[24px] p-4 flex items-center gap-4 shadow-sm border ${isSelectionMode && selectedCharIds.has(char.id) ? 'border-[#007AFF] bg-[#007AFF]/5' : (isDarkMode ? 'border-white/5' : 'border-neutral-100')} group overflow-hidden relative transition-all active:scale-98`}
                >
                  {isSelectionMode && (
                    <div className="absolute top-2 left-2 size-5 rounded-full border-2 border-[#007AFF] flex items-center justify-center p-0.5 z-10 bg-inherit">
                      {isSelected && <div className="w-full h-full bg-[#007AFF] rounded-full" />}
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                      <AvatarImage src={char.avatar} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center gap-1 bg-[#FF2D55]/10 px-1.5 py-0.5 rounded-full">
                      <Heart size={8} className="fill-[#FF2D55] text-[#FF2D55]" />
                      <span className="text-[9px] text-[#FF2D55] font-bold">{char.favorability}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg truncate">{char.name}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#007AFF]/10 text-[#007AFF] font-medium shrink-0">{char.gender}</span>
                    </div>
                    <p className={`text-xs opacity-60 line-clamp-2 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {char.signature || "這個角色還沒有個性簽名..."}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {isConfirmingDelete && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-[28px] p-6 w-full max-w-xs shadow-2xl space-y-4`}
              >
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold">確定要刪除嗎？</h3>
                  <p className="text-xs opacity-50">刪除後將無法原復這 {selectedCharIds.size} 個角色夥伴。</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => {
                      setCharacters(prev => prev.filter(c => !selectedCharIds.has(c.id)));
                      setSelectedCharIds(new Set());
                      setIsSelectionMode(false);
                      setIsConfirmingDelete(false);
                    }}
                    className="w-full py-3 bg-[#FF2D55] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#FF2D55]/20 active:scale-95 transition-transform"
                  >
                    確認刪除
                  </button>
                  <button 
                    onClick={() => setIsConfirmingDelete(false)}
                    className={`w-full py-3 ${isDarkMode ? 'bg-white/10' : 'bg-neutral-100'} rounded-xl font-bold text-sm active:scale-95 transition-transform`}
                  >
                    取消
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Toolbar */}
        <AnimatePresence>
          {isSelectionMode && selectedCharIds.size > 0 && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-6 left-4 right-4 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl border border-neutral-200 dark:border-[#38383a] rounded-3xl p-4 shadow-2xl z-20 flex items-center justify-between"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold opacity-40">已選取</span>
                <span className="text-lg font-black text-[#007AFF]">{selectedCharIds.size} <span className="text-sm font-medium opacity-60">個角色</span></span>
              </div>
              <button 
                onClick={() => setIsConfirmingDelete(true)}
                className="bg-[#FF2D55] text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-[#FF2D55]/20 active:scale-95 transition-transform flex items-center gap-2"
              >
                <Trash2 size={16} />
                刪除
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderWheelApp = () => {
    const handleSpin = () => {
      if (wheelSpins <= 0 || isSpinning) return;
      setIsSpinning(true);
      
      const segments = 7;
      const spinCount = 5 + Math.floor(Math.random() * 5); // 5-10 spins
      const targetIndex = Math.floor(Math.random() * segments);
      const degreePerSegment = 360 / segments;
      
      const targetRotation = wheelRotation + spinCount * 360 + (segments - targetIndex) * degreePerSegment;
      
      setWheelRotation(targetRotation);

      setTimeout(() => {
        const reward = wheelRewards[targetIndex];
        setWalletBalance(prev => prev + reward);
        setWheelSpins(prev => prev - 1);
        setIsSpinning(false);
      }, 4000);
    };

    return (
      <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'} overflow-hidden pb-20`}>
        <Header title="每日轉盤" onBack={goHome} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
          <div className="text-center space-y-2">
            <div className="inline-block px-3 py-1 bg-orange-500 text-white text-[10px] font-black rounded-full mb-2 animate-pulse">LUCKY EVENT</div>
            <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Daily Jewel Spin</h3>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="text-center">
                <p className="text-[10px] opacity-40 uppercase font-black">今日剩餘</p>
                <p className="text-xl font-black text-orange-500">{wheelSpins} <span className="text-xs">次</span></p>
              </div>
              <div className="w-px h-8 bg-neutral-500/20" />
              <div className="text-center">
                <p className="text-[10px] opacity-40 uppercase font-black">錢包餘額</p>
                <p className="text-xl font-black text-[#5856D6]">${walletBalance}</p>
              </div>
            </div>
          </div>

          <div className="relative w-72 h-72 flex items-center justify-center">
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-20 text-orange-500 drop-shadow-lg">
              <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-current" />
            </div>

            <motion.div 
              className="w-full h-full rounded-full border-8 border-[#1c1c1e] shadow-2xl relative overflow-hidden bg-[#1c1c1e]"
              animate={{ rotate: wheelRotation }}
              transition={{ duration: 4, ease: [0.15, 0, 0, 1] }}
            >
              {wheelRewards.map((reward, i) => (
                <div 
                  key={i}
                  className="absolute top-0 left-0 w-full h-full origin-center"
                  style={{ transform: `rotate(${(360/7) * i}deg)` }}
                >
                  <div 
                    className={`absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-1/2 origin-bottom flex flex-col items-center pt-8 ${i % 2 === 0 ? 'text-white' : 'text-orange-300'}`}
                    style={{ 
                      clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                      backgroundColor: i % 2 === 0 ? '#2c2c2e' : '#3a3a3c'
                    }}
                  >
                    <span className="text-lg font-black tracking-tighter">${reward}</span>
                    <Coins size={16} className="mt-1 opacity-60" />
                  </div>
                </div>
              ))}
              <div className="absolute inset-0 m-auto w-12 h-12 bg-[#1c1c1e] border-4 border-[#3a3a3c] rounded-full z-10 flex items-center justify-center shadow-inner">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
              </div>
            </motion.div>
          </div>

          <div className="w-full space-y-4">
            <button 
              onClick={handleSpin}
              disabled={isSpinning || wheelSpins <= 0}
              className={`w-full py-5 rounded-[24px] font-black text-xl tracking-tighter uppercase transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95
                ${isSpinning || wheelSpins <= 0 
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' 
                  : 'bg-orange-500 text-white shadow-orange-500/30 hover:bg-orange-600'}`}
            >
              {isSpinning ? (
                <>旋轉中 <RotateCw size={24} className="animate-spin" /></>
              ) : (
                <>立即抽獎 <Disc size={24} /></>
              )}
            </button>
            <p className="text-[10px] text-center opacity-30 font-bold uppercase tracking-widest leading-relaxed">
              公平公正開獎 • 每日 00:00 自動刷新次數<br />
              格位金幣額度亦會每日隨機調整
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderAppContent = () => {
    switch (activeApp) {
      case 'messages': {
        if (!selectedChatId) {
          return (
            <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
              <div className={`px-4 pt-16 pb-3 flex items-center justify-between border-b ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-100'}`}>
                <h2 className="text-2xl font-bold">訊息</h2>
                <button onClick={goHome} className="text-[#007AFF] font-medium">關閉</button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {/* System AI Chat Room */}
                {!isSystemChatHidden && (
                  <div className="relative overflow-hidden border-b border-neutral-100/10">
                    <motion.div 
                      drag="x"
                      dragConstraints={{ left: -80, right: 0 }}
                      dragElastic={0.1}
                      onClick={() => setSelectedChatId('system')}
                      className={`relative z-10 px-4 py-4 flex items-center gap-4 transition-colors ${isDarkMode ? 'bg-black active:bg-neutral-800' : 'bg-white active:bg-neutral-50'} border-b ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-50'}`}
                    >
                      <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                        <Bot size={32} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold">AI 助手</h3>
                          <span className="text-xs opacity-40">現在</span>
                        </div>
                        <p className="text-sm opacity-60 truncate">
                          {messages.length > 0 ? messages[messages.length - 1].text : "哈囉！有什麼我可以幫您的嗎？"}
                        </p>
                      </div>
                    </motion.div>
                    <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center bg-[#FF3B30] text-white">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setMessages([]);
                          setSystemMemos([]);
                          setIsSystemChatHidden(true);
                        }}
                        className="flex flex-col items-center gap-1"
                      >
                        <Trash2 size={20} />
                        <span className="text-[10px] font-bold">刪除</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Character Chat Rooms */}
                {characters.filter(c => !c.isChatHidden).map(char => (
                  <div key={char.id} className="relative overflow-hidden border-b border-neutral-100/10">
                    <motion.div 
                      drag="x"
                      dragConstraints={{ left: -80, right: 0 }}
                      dragElastic={0.1}
                      onClick={() => setSelectedChatId(char.id)}
                      className={`relative z-10 px-4 py-4 flex items-center gap-4 transition-colors ${isDarkMode ? 'bg-black active:bg-neutral-800' : 'bg-white active:bg-neutral-50'} border-b ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-50'}`}
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-neutral-100/10">
                        <AvatarImage src={char.avatar} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold">{char.name}</h3>
                          <span className="text-xs opacity-40">現在</span>
                        </div>
                        <p className="text-sm opacity-60 truncate">
                          {char.messages.length > 0 ? char.messages[char.messages.length - 1].text : "點擊開始聊天"}
                        </p>
                      </div>
                    </motion.div>
                    <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center bg-[#FF3B30] text-white">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, messages: [], memos: [], isChatHidden: true } : c));
                        }}
                        className="flex flex-col items-center gap-1"
                      >
                        <Trash2 size={20} />
                        <span className="text-[10px] font-bold">刪除</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // Move constant calculations up to be shared
        const isSystem = selectedChatId === 'system';
        const char = characters.find(c => c.id === selectedChatId);

        if (isChatConfigOpen && char) {
          return (
            <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'}`}>
              <Header title={`${char.name} 聊天設定`} onBack={() => setIsChatConfigOpen(false)} />
              <div className="p-4 space-y-6 overflow-y-auto">
                <div className="flex flex-col items-center gap-4 py-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <AvatarImage src={char.avatar} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{char.name}</h3>
                    <p className="text-xs opacity-40 mt-1">{char.signature}</p>
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} rounded-2xl p-5 space-y-6 shadow-sm border ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-100'}`}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold opacity-60 uppercase tracking-widest px-1">
                      <span>回覆速度調整</span>
                      <Sparkles size={14} />
                    </div>
                    
                    <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>最快回覆時間</span>
                      <span className="text-[#007AFF] font-bold">{char.minResponseTime}s</span>
                    </div>
                    <input 
                      type="range" min="1" max="30" 
                      value={char.minResponseTime} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, minResponseTime: val } : c));
                      }}
                      className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#007AFF]"
                    />
                    </div>

                    <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>最慢回覆時間</span>
                      <span className="text-[#007AFF] font-bold">{char.maxResponseTime}s</span>
                    </div>
                    <input 
                      type="range" min="31" max="60" 
                      value={char.maxResponseTime} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, maxResponseTime: val } : c));
                      }}
                      className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#007AFF]"
                    />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-neutral-100/10">
                    <div className="flex justify-between items-center text-sm font-bold opacity-60 uppercase tracking-widest px-1">
                      <span>訊息連續傳送上限</span>
                      <MessageCircle size={14} />
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span>一次最多可傳幾條</span>
                      <span className="text-[#007AFF] font-bold">{char.maxMessagesPerTurn} 條</span>
                    </div>
                    <input 
                      type="range" min="1" max="8" 
                      value={char.maxMessagesPerTurn} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, maxMessagesPerTurn: val } : c));
                      }}
                      className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#007AFF]"
                    />
                    <p className="text-[10px] opacity-40 text-center italic mt-2">設定越高，角色一次傳來的短句就越多</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-neutral-100/10">
                    <div className="flex justify-between items-center text-sm font-bold opacity-60 uppercase tracking-widest px-1">
                      <span>所在地更換頻率</span>
                      <MapPin size={14} />
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span>改變間隔</span>
                      <span className="text-[#FF9500] font-bold">{char.locationInterval || 1} 小時</span>
                    </div>
                    <input 
                      type="range" min="1" max="24" step="1"
                      value={char.locationInterval || 1}
                      onChange={(e) => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, locationInterval: parseInt(e.target.value) } : c))}
                      className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#FF9500]"
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-neutral-100/10">
                    <div className="flex justify-between items-center text-sm font-bold opacity-60 uppercase tracking-widest px-1">
                      <span>聊天室美化</span>
                      <Sparkles size={14} />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-medium">聊天背景圖</label>
                      <div className="flex gap-2">
                        <input 
                          className={`flex-1 ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-neutral-50 border-neutral-200'} border rounded-lg px-3 py-2 text-xs`}
                          placeholder="輸入圖片 URL"
                          value={char.chatBackground || ''}
                          onChange={(e) => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, chatBackground: e.target.value } : c))}
                        />
                        <button 
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => handleImageUpload(e as any, (url) => {
                              setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, chatBackground: url } : c));
                            });
                            input.click();
                          }}
                          className="bg-[#007AFF] text-white text-[10px] px-3 rounded-lg font-bold"
                        >
                          上傳
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium">我的氣泡 CSS 代碼</label>
                      <textarea 
                        className={`w-full ${isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200 text-black'} border rounded-lg px-3 py-2 text-[10px] font-mono h-20 outline-none`}
                        placeholder="例如: background: linear-gradient(45deg, #007AFF, #5856D6); border-radius: 20px 20px 0 20px;"
                        value={char.myBubbleCss || ''}
                        onChange={(e) => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, myBubbleCss: e.target.value } : c))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium">對方的氣泡 CSS 代碼</label>
                      <textarea 
                        className={`w-full ${isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200 text-black'} border rounded-lg px-3 py-2 text-[10px] font-mono h-20 outline-none`}
                        placeholder="例如: background: white; color: black; border: 2px solid #EEE;"
                        value={char.theirBubbleCss || ''}
                        onChange={(e) => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, theirBubbleCss: e.target.value } : c))}
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      <p className="text-[10px] font-bold opacity-30 text-center uppercase tracking-widest">— 氣泡樣式預設 —</p>
                      <div className="grid grid-cols-2 gap-2">
                        {BUBBLE_PRESETS.map((p, idx) => (
                          <div key={idx} className={`${isDarkMode ? 'bg-white/5' : 'bg-neutral-100'} p-2 rounded-xl flex flex-col gap-2`}>
                            <div className="text-[10px] font-bold text-center opacity-60">{p.name}</div>
                            <div className="grid grid-cols-2 gap-1">
                              <button 
                                onClick={() => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, myBubbleCss: p.css } : c))}
                                className="bg-[#007AFF] text-white text-[8px] py-1 rounded-md font-bold active:scale-95 transition-transform"
                              >
                                套用我
                              </button>
                              <button 
                                onClick={() => setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, theirBubbleCss: p.css } : c))}
                                className="bg-[#AF52DE] text-white text-[8px] py-1 rounded-md font-bold active:scale-95 transition-transform"
                              >
                                套用他
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setIsChatConfigOpen(false)}
                  className="w-full py-4 bg-[#007AFF] text-white rounded-2xl font-bold shadow-lg shadow-[#007AFF]/20 active:scale-95 transition-transform"
                >
                  確認修改
                </button>
              </div>
            </div>
          );
        }

        if (!isSystem && !char) { setSelectedChatId(null); return null; }

        const chatName = isSystem ? "AI 助手" : char!.name;
        const chatAvatar = isSystem ? null : char!.avatar;
        const chatMessages = isSystem ? messages : char!.messages;

        // Dynamic status logic
        const getStatus = () => {
          if (isSystem) return "在線";
          const statuses = ["在線", "忙碌", "吃飯中", "睡覺中", "玩遊戲中", "發呆中"];
          return statuses[Math.floor((Date.now() / 3600000 + parseInt(char!.id.slice(-2))) % statuses.length)];
        };
        const status = getStatus();

        const getLocation = () => {
          if (isSystem) return "";
          const locString = char?.location || '未知地點';
          const interval = (char?.locationInterval || 1) * 3600000; // hours to ms
          const locs = locString.split(/[，,、\s]+/).filter(l => l.trim().length > 0);
          if (locs.length <= 1) return locString;
          // Change location based on time using the user-defined interval
          return locs[Math.floor((Date.now() / interval + parseInt(char!.id.slice(-2))) % locs.length)];
        };
        const location = getLocation();

        return (
          <div className={`flex-1 flex flex-col h-full ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} relative`}>
            <div className={`px-4 pt-16 pb-3 border-b ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-100'} flex items-center justify-between sticky top-0 bg-inherit z-10`}>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedChatId(null)} className="text-[#007AFF] flex items-center gap-0.5 font-medium shrink-0">
                  <ChevronLeft size={20} />
                  返回
                </button>
                <div className="flex items-center ml-2 gap-2">
                  {isSystem ? (
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px]"><Bot size={22} /></div>
                  ) : (
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-100 shadow-sm relative">
                      <AvatarImage src={chatAvatar!} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold truncate max-w-[120px]">{chatName}</span>
                    {!isSystem && (
                      <div className="flex flex-col">
                        <span className="text-[9px] opacity-50 flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${status === '在線' ? 'bg-green-500' : 'bg-orange-500'}`} />
                          {status}
                        </span>
                        <span className="text-[9px] opacity-40">{location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-[#007AFF] active:scale-90 transition-transform"><Phone size={20} /></button>
                {!isSystem && (
                  <button 
                    onClick={() => setIsTransferModalOpen(true)}
                    className="text-[#FF9500] active:scale-90 transition-transform"
                  >
                    <WalletIcon size={20} />
                  </button>
                )}
                <button 
                  onClick={() => !isSystem && setIsChatConfigOpen(true)}
                  className={`text-[#007AFF] transition-opacity ${isSystem ? 'opacity-20 cursor-not-allowed' : 'opacity-100'}`}
                >
                  <Info size={20} />
                </button>
              </div>
            </div>

            {/* Transfer Modal */}
            <AnimatePresence>
              {isTransferModalOpen && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                    className={`${isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-white text-black'} w-full rounded-3xl p-6 shadow-2xl space-y-6`}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#FF9500] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#FF9500]/20">
                        <WalletIcon size={32} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold">轉帳給 {chatName}</h3>
                      <p className="text-sm opacity-50 mt-1">錢包餘額：${walletBalance}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold opacity-40 uppercase px-1">輸入金額</label>
                      <input 
                        type="number"
                        placeholder="0"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className={`w-full text-2xl font-bold text-center py-4 rounded-2xl outline-none border-2 transition-colors ${isDarkMode ? 'bg-black/40 border-white/5 focus:border-[#FF9500]' : 'bg-neutral-50 border-neutral-100 focus:border-[#FF9500]'}`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => { setIsTransferModalOpen(false); setTransferAmount(''); }}
                        className={`py-3 rounded-xl font-bold ${isDarkMode ? 'bg-white/5 text-white' : 'bg-neutral-100 text-black'} active:scale-95 transition-transform`}
                      >
                        取消
                      </button>
                      <button 
                        disabled={!transferAmount || parseInt(transferAmount) <= 0 || parseInt(transferAmount) > walletBalance}
                        onClick={() => {
                          const amount = parseInt(transferAmount);
                          setWalletBalance(prev => prev - amount);
                          setCharacters(prev => prev.map(c => c.id === char!.id ? { ...c, favorability: (c.favorability || 0) + Math.ceil(amount / 100) } : c));
                          
                          // Add a fake system message about transfer
                          const transferMsg: Message = { role: 'user', text: `[系統通知] 成功轉帳 $${amount} 給 ${chatName}` };
                          setCharacters(prev => prev.map(c => c.id === char!.id ? { ...c, messages: [...c.messages, transferMsg] } : c));
                          
                          setIsTransferModalOpen(false);
                          setTransferAmount('');
                        }}
                        className={`py-3 rounded-xl font-bold bg-[#FF9500] text-white shadow-lg shadow-[#FF9500]/20 active:scale-95 transition-transform disabled:opacity-20 disabled:cursor-not-allowed`}
                      >
                        確認轉帳
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/10 relative" 
              style={char?.chatBackground ? { backgroundImage: `url(${char.chatBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              onClick={() => setIsEmojiPickerOpen(false)}
            >
              {char?.chatBackground && <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] pointer-events-none" />}
              <div className="relative z-1">
                {chatMessages.length === 0 && (
                  <div className={`text-center py-10 opacity-40 text-sm ${char?.chatBackground ? 'text-white' : ''}`}>與 {chatName} 開始對話吧！</div>
                )}
                <div className="space-y-4">
                  {chatMessages.map((m, i) => {
                    const isSticker = m.text.startsWith('[貼圖] ');
                    const stickerUrl = isSticker ? m.text.replace('[貼圖] ', '') : null;
                    
                    // Custom CSS logic
                    let customStyle: React.CSSProperties = {};
                    if (m.role === 'user' && char?.myBubbleCss) {
                      try {
                        const styleParts = char.myBubbleCss.split(';').filter(p => p.includes(':'));
                        styleParts.forEach(part => {
                          const [key, value] = part.split(':').map(s => s.trim());
                          const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase()) as any;
                          customStyle[camelKey] = value;
                        });
                      } catch (e) { console.error("Bubble CSS Error", e); }
                    } else if (m.role === 'model' && char?.theirBubbleCss) {
                      try {
                        const styleParts = char.theirBubbleCss.split(';').filter(p => p.includes(':'));
                        styleParts.forEach(part => {
                          const [key, value] = part.split(':').map(s => s.trim());
                          const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase()) as any;
                          customStyle[camelKey] = value;
                        });
                      } catch (e) { console.error("Bubble CSS Error", e); }
                    }

                    return (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {isSticker ? (
                          <div className={`max-w-[150px] p-1 rounded-xl transition-transform active:scale-95 ${m.role === 'user' ? 'bg-[#007AFF]/10' : ''}`}>
                            <img src={stickerUrl!} className="w-full h-auto rounded-lg object-contain" alt="Sticker" />
                          </div>
                        ) : (
                          <div 
                            style={customStyle}
                            className={`max-w-[80%] px-4 py-2 rounded-[20px] text-[15px] shadow-sm ${Object.keys(customStyle).length > 0 ? '' : (m.role === 'user' ? 'bg-[#007AFF] text-white rounded-tr-none' : (isDarkMode ? 'bg-[#1c1c1e] text-white border border-[#38383a] rounded-tl-none' : 'bg-neutral-100 text-black rounded-tl-none'))}`}
                          >
                            {m.text}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {typingChatId === selectedChatId && <div className="text-[10px] text-neutral-400 ml-2 animate-pulse mb-4">{chatName} 正在輸入...</div>}
              <div ref={chatEndRef} />
            </div>

            {/* Emoji/Sticker Picker */}
            <AnimatePresence>
              {isEmojiPickerOpen && (
                <motion.div
                  initial={{ y: 200, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 200, opacity: 0 }}
                  className={`absolute bottom-[80px] left-4 right-4 ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'} border ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-100'} rounded-3xl p-4 shadow-xl z-20 flex flex-col gap-4 max-h-[350px]`}
                >
                  <div className="flex items-center gap-4 border-b border-neutral-100/10 pb-2">
                    <button 
                      onClick={() => setEmojiPickerTab('stickers')}
                      className={`text-xs font-bold uppercase tracking-widest transition-opacity ${emojiPickerTab === 'stickers' ? 'opacity-100 underline decoration-2 underline-offset-4 decoration-[#007AFF]' : 'opacity-30 hover:opacity-50'}`}
                    >
                      表情與貼圖
                    </button>
                    <button 
                      onClick={() => setEmojiPickerTab('nudge')}
                      className={`text-xs font-bold uppercase tracking-widest transition-opacity ${emojiPickerTab === 'nudge' ? 'opacity-100 underline decoration-2 underline-offset-4 decoration-[#007AFF]' : 'opacity-30 hover:opacity-50'}`}
                    >
                      拍一拍
                    </button>
                    <button 
                      onClick={() => setEmojiPickerTab('memo')}
                      className={`text-xs font-bold uppercase tracking-widest transition-opacity ${emojiPickerTab === 'memo' ? 'opacity-100 underline decoration-2 underline-offset-4 decoration-[#007AFF]' : 'opacity-30 hover:opacity-50'}`}
                    >
                      備忘錄
                    </button>
                    <div className="flex-1" />
                    {emojiPickerTab === 'stickers' && (
                      <button 
                        onClick={() => stickerInputRef.current?.click()}
                        className="text-[10px] bg-[#007AFF]/10 text-[#007AFF] px-2 py-1 rounded-full font-bold active:scale-90 transition-transform"
                      >
                        + 新增貼圖
                      </button>
                    )}
                    <input 
                      type="file" 
                      hidden 
                      ref={stickerInputRef} 
                      accept="image/*" 
                      onChange={e => handleImageUpload(e, (url) => setStickers(prev => [url, ...prev]))} 
                    />
                  </div>
                  
                  <div className="flex-1 overflow-y-auto min-h-[200px]">
                    {emojiPickerTab === 'stickers' ? (
                      <div>
                        <p className="text-[10px] font-bold opacity-30 mb-2">我的貼圖</p>
                        {stickers.length === 0 ? (
                          <div className="text-center py-8 opacity-30 text-xs">尚無貼圖，點擊上方按鈕新增</div>
                        ) : (
                          <div className="grid grid-cols-4 gap-2">
                            {stickers.map((s, idx) => (
                              <button 
                                key={idx} 
                                onClick={() => {
                                  if (isSystem) {
                                    setInput("");
                                    const stickerMsg: Message = { role: 'user', text: `[貼圖] ${s}` };
                                    setMessages(prev => [...prev, stickerMsg]);
                                  } else {
                                    setInput("");
                                    const stickerMsg: Message = { role: 'user', text: `[貼圖] ${s}` };
                                    setCharacters(prev => prev.map(c => c.id === char!.id ? { ...c, messages: [...c.messages, stickerMsg] } : c));
                                  }
                                  setIsEmojiPickerOpen(false);
                                }}
                                className="aspect-square rounded-lg overflow-hidden bg-neutral-100 hover:scale-105 transition-transform"
                              >
                                <img src={s} className="w-full h-full object-contain p-1" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : emojiPickerTab === 'nudge' ? (
                      <div className="flex flex-col gap-4 py-4">
                        <div className="text-center space-y-2">
                          <p className="text-sm font-medium opacity-70">你想拍拍 {chatName} 的哪裡？</p>
                          <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-black/40' : 'bg-neutral-50'} border border-neutral-100/10`}>
                            <div className="flex items-center gap-2">
                              <span className="text-xs opacity-40 shrink-0">拍一拍他的...</span>
                              <input 
                                type="text"
                                value={nudgeInput}
                                onChange={(e) => setNudgeInput(e.target.value)}
                                placeholder="頭、肩膀、肚子..."
                                className="flex-1 bg-transparent border-none outline-none text-sm font-bold"
                                onKeyDown={(e) => e.key === 'Enter' && sendNudge(char!)}
                              />
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => sendNudge(char!)}
                          disabled={isSystem}
                          className="w-full py-3 bg-[#007AFF] text-white rounded-xl font-bold active:scale-95 transition-transform disabled:opacity-20 shadow-lg shadow-[#007AFF]/20"
                        >
                          發送拍一拍
                        </button>
                        <div className="text-[10px] text-center opacity-30 px-6">
                        就像微信的拍一拍功能一樣，讓對方知道你在找他。
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 py-2 h-full">
                        <div className="flex items-center gap-2">
                          <input 
                            className={`flex-1 ${isDarkMode ? 'bg-black/40 text-white' : 'bg-neutral-50 text-black'} border-none outline-none px-4 py-3 rounded-xl text-sm font-medium`}
                            placeholder="新增備忘錄..."
                            value={memoInput}
                            onChange={(e) => setMemoInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addMemo(selectedChatId!)}
                          />
                          <button 
                            onClick={() => addMemo(selectedChatId!)}
                            className="w-10 h-10 bg-[#34C759] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[#34C759]/20 active:scale-90 transition-transform"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 pb-10">
                          {(isSystem ? systemMemos : (char?.memos || [])).length === 0 ? (
                            <div className="text-center py-10 opacity-30 text-xs">尚無備忘錄</div>
                          ) : (
                            (isSystem ? systemMemos : (char?.memos || [])).map(m => (
                              <div key={m.id} className="relative overflow-hidden rounded-xl">
                                <motion.div 
                                  drag="x"
                                  dragConstraints={{ left: -60, right: 0 }}
                                  dragElastic={0.1}
                                  className={`relative z-10 flex items-center gap-3 p-3 ${isDarkMode ? 'bg-[#2c2c2e]' : 'bg-neutral-50'} rounded-xl group`}
                                >
                                  <button 
                                    onClick={() => toggleMemo(selectedChatId!, m.id)}
                                    className={`shrink-0 transition-colors ${m.completed ? 'text-[#34C759]' : 'text-neutral-300'}`}
                                  >
                                    {m.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                  </button>
                                  <span className={`text-sm flex-1 ${m.completed ? 'line-through opacity-30' : ''}`}>
                                    {m.text}
                                  </span>
                                </motion.div>
                                <div className="absolute inset-y-0 right-0 w-[60px] bg-[#FF3B30] flex items-center justify-center text-white">
                                  <button onClick={() => deleteMemo(selectedChatId!, m.id)} className="p-2">
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`p-4 flex gap-2 items-center border-t ${isDarkMode ? 'border-[#38383a]' : 'border-neutral-100'}`}>
              <button 
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isEmojiPickerOpen ? 'bg-[#007AFF] text-white' : (isDarkMode ? 'text-neutral-400 hover:bg-white/5' : 'text-neutral-500 hover:bg-neutral-100')}`}
              >
                <Smile size={24} />
              </button>
              <input 
                className={`flex-1 ${isDarkMode ? 'bg-[#1c1c1e] text-white border-[#38383a]' : 'bg-[#F1F3F5] text-black border-transparent'} border rounded-full px-4 py-2 text-sm outline-none`} 
                placeholder="iMessage" 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onFocus={() => setIsEmojiPickerOpen(false)}
                onKeyPress={e => e.key === 'Enter' && (isSystem ? handleSendMessage() : handleCharacterChat(char!, input))} 
              />
              <button 
                onClick={() => isSystem ? handleSendMessage() : handleCharacterChat(char!, input)} 
                className="w-9 h-9 rounded-full bg-[#007AFF] flex items-center justify-center text-white active:scale-90 transition-transform"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        );
      }
      case 'kitchen': return <KitchenApp 
        isDarkMode={isDarkMode} 
        goHome={goHome} 
        warehouseItems={warehouseItems}
        setWarehouseItems={setWarehouseItems}
        characters={characters}
        setCharacters={setCharacters}
      />;
      case 'diary': return <DiaryApp 
        isDarkMode={isDarkMode} 
        goHome={goHome} 
        characters={characters}
        userProfile={userProfile}
        diaryEntries={diaryEntries}
        setDiaryEntries={setDiaryEntries}
        aiSettings={aiSettings}
      />;
      case 'settings': return renderSettings();
      case 'characters': return renderCharacters();
      case 'wheel': return renderWheelApp();
      case 'fishing': return <FishingApp 
        isDarkMode={isDarkMode} 
        goHome={goHome} 
        onCatchFish={(id) => {
          setWarehouseItems(prev => {
            const existing = prev.find(i => i.id === id);
            if (existing) return prev.map(i => i.id === id ? { ...i, amount: i.amount + 1 } : i);
            return [...prev, { id, amount: 1 }];
          });
        }} 
        onCatchTrash={(coins) => setWalletBalance(prev => prev + coins)} 
      />;
      case 'garden': return <GardenApp 
        patches={gardenPatches}
        isDarkMode={isDarkMode}
        goHome={goHome}
        onUnlockPatch={onUnlockPatch}
        onPlant={onPlant}
        onWater={onWater}
        onHarvest={onHarvest}
      />;
      case 'warehouse': return <WarehouseApp 
        warehouseItems={warehouseItems} 
        isDarkMode={isDarkMode} 
        goHome={goHome} 
      />;
      case 'dex': return <DexApp 
        isDarkMode={isDarkMode} 
        goHome={goHome} 
      />;
      default: return (
        <div className={`flex-1 flex flex-col items-center justify-center pt-20 ${isDarkMode ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'}`}>
          <div className="animate-bounce mb-4"><Smartphone size={48} className="text-[#007AFF]" /></div>
          <h2 className="text-xl font-bold capitalize">{appNames[activeApp || ''] || activeApp}</h2>
          <p className="text-xs opacity-50 mt-2">App 已啟動</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center p-4 font-sans text-neutral-800">
      <div className="relative w-full max-w-[375px] h-[812px] bg-black rounded-[55px] border-[12px] border-neutral-900 shadow-2xl overflow-hidden flex flex-col">
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-11 px-6 flex justify-between items-end pb-1.5 z-[100] pointer-events-none">
          <span className="text-[14px] font-semibold text-white">{currentTime.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-3xl" />
          <div className="flex gap-1.5 items-center text-white"><Signal size={16} /> <Wifi size={16} /> <Battery size={20} /></div>
        </div>

        <AnimatePresence mode="wait">
          {screenState === ScreenState.Locked && (
            <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -812 }} 
              className="relative flex-1 flex flex-col items-center bg-cover bg-center" 
              style={{ 
                backgroundColor: lockWallpaper === "grey-cross" ? "#2c2c2e" : "transparent",
                backgroundImage: lockWallpaper === "grey-cross" 
                  ? `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19 15h2v10h-2zM15 19h10v2h-10z' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E")` 
                  : `url("${lockWallpaper}")` 
              }}
            >
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10 mt-16 text-center text-white"><Lock size={20} className="mx-auto mb-2 opacity-80" />
                <h1 className="text-7xl font-thin tracking-tighter mb-1">{currentTime.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })}</h1>
                <p className="text-xl font-medium opacity-90">{currentTime.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'long' })}</p></div>
              <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center z-10">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setScreenState(ScreenState.Home)} 
                  className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 text-white shadow-lg"><Unlock size={28} /></motion.button>
                <p className="mt-4 text-white/60 text-sm font-medium animate-pulse">向上輕掃解鎖</p></div>
            </motion.div>
          )}

          {screenState === ScreenState.Home && (
            <motion.div 
              key="home" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0, scale: 1.1 }} 
              className="relative flex-1 flex flex-col bg-cover bg-center select-none" 
              style={{ 
                backgroundColor: homeWallpaper === "grey-cross" ? "#1c1c1e" : "transparent",
                backgroundImage: homeWallpaper === "grey-cross" 
                  ? `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19 15h2v10h-2zM15 19h10v2h-10z' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E")` 
                  : `url("${homeWallpaper}")` 
              }}
              onPointerDown={(e) => {
                if (isJiggling) {
                  // If clicking background (not an app), stop jiggling
                  if (e.target === e.currentTarget) setIsJiggling(false);
                } else {
                  handleHomePointerDown();
                }
              }}
              onPointerUp={handleHomePointerUp}
              onPointerLeave={handleHomePointerUp}
            >
              <div className="absolute inset-0 bg-black/5" />
              
              {/* App Grid */}
              <div 
                className="relative z-10 p-6 pt-24 flex-1"
                onPointerUp={() => {
                  if (longPressTimer.current) {
                    clearTimeout(longPressTimer.current);
                  }
                }}
              >
                <div 
                  className="grid grid-cols-4 gap-x-4 gap-y-8 auto-rows-max"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <AnimatePresence mode="popLayout">
                    {installedApps.map((id, index) => (
                      <motion.div
                        key={id}
                        layout
                        layoutId={id}
                        drag={isJiggling}
                        dragListener={isJiggling}
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.9}
                        whileDrag={{ 
                          scale: 1.1, 
                          zIndex: 50,
                          transition: { duration: 0.1 } 
                        }}
                        onDrag={(_, info) => {
                          if (!isJiggling) return;
                          
                          // Simplified 2D grid reordering logic
                          // We calculate the target index based on drag position
                          // 4 columns, roughly 80px width per column, 100px height per row
                          const col = Math.min(3, Math.max(0, Math.floor((info.point.x - 24) / 80)));
                          const row = Math.max(0, Math.floor((info.point.y - 120) / 110));
                          
                          // Convert col/row to index
                          // If profile-widget is at top, it takes 4 slots
                          let targetIndex = row * 4 + col;
                          
                          // Limit targetIndex to array bounds
                          targetIndex = Math.min(installedApps.length - 1, Math.max(0, targetIndex));
                          
                          if (targetIndex !== index) {
                            const newList = [...installedApps];
                            const [movedItem] = newList.splice(index, 1);
                            newList.splice(targetIndex, 0, movedItem);
                            setInstalledApps(newList);
                          }
                        }}
                        onDragEnd={(_, info) => {
                          if (!isJiggling) return;
                          // Check if dragged to dock (bottom of screen)
                          // Screen height is 812, dock is at bottom ~700
                          if (info.point.y > 680 && dockApps.length < 4) {
                            setInstalledApps(prev => prev.filter(a => a !== id));
                            setDockApps(prev => [...prev, id]);
                          }
                        }}
                        className="touch-none"
                      >
                        <AppIcon 
                          id={id} 
                          label={appNames[id]} 
                          color={getIconColor(id)} 
                          icon={getIconElement(id)} 
                          isDarkMode={isDarkMode}
                          isJiggling={isJiggling}
                          customSrc={customIcons[id]} 
                          onClick={() => openApp(id)} 
                          onRemove={() => removeApp(id)}
                        />
                      </motion.div>
                    ))}
                    {/* Add App Button */}
                    {isJiggling && (
                      <motion.div 
                        key="add-btn"
                        layout
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="flex flex-col items-center gap-1"
                      >
                        <button 
                          onClick={(e) => { e.stopPropagation(); setIsAddingApp(true); }}
                          className="w-[62px] h-[62px] rounded-[15px] bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white active:scale-90 transition-transform"
                        >
                          <Plus size={32} />
                        </button>
                        <span className="text-[11px] font-medium text-white">加入</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Stop Jiggle Button if active */}
              {isJiggling && (
                <div className="absolute top-14 right-6 z-[200]">
                  <button onClick={() => setIsJiggling(false)} className="bg-white/20 backdrop-blur-xl px-3 py-1 rounded-full text-white text-xs font-bold border border-white/20 active:opacity-50">完成</button>
                </div>
              )}

              {/* Add App Modal */}
              <AnimatePresence>
                {isAddingApp && (
                  <motion.div 
                    initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md z-[300] flex flex-col pt-20 px-6 rounded-t-[40px]"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-bold text-white">App 資料庫</h2>
                      <button onClick={() => setIsAddingApp(false)} className="text-[#007AFF] font-bold">取消</button>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      {(Object.keys(appNames) as AppId[]).filter(id => !installedApps.includes(id) && !dockApps.includes(id)).map(id => (
                        <div key={id} onClick={() => addApp(id)} className="flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-all">
                          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 text-white overflow-hidden shadow-lg">
                            {customIcons[id] ? <img src={customIcons[id]} className="w-full h-full object-cover" /> : (
                              <div className="flex flex-col items-center">
                                {id === 'store' && <ShoppingBag size={28} />}
                                {id === 'phone' && <Phone size={28} />}
                                {id === 'messages' && <MessageCircle size={28} />}
                                {id === 'diary' && <Book size={28} />}
                                {id === 'kitchen' && <UtensilsCrossed size={28} />}
                                {id === 'wallet' && <WalletIcon size={28} />}
                                {id === 'garden' && <Leaf size={28} />}
                                {id === 'photos' && <Mail size={28} />}
                                {id === 'characters' && <Users size={28} />}
                                {id === 'warehouse' && <Archive size={28} />}
                                {id === 'fishing' && <Fish size={28} />}
                                {id === 'wheel' && <Disc size={28} />}
                                {id === 'dex' && <BookOpen size={28} />}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-white/80">{appNames[id] || id}</span>
                        </div>
                      ))}
                    </div>
                    {(installedApps.length + dockApps.length) === 6 && (
                      <div className="mt-20 text-center text-white/40 text-sm">所有 App 都已加入主畫面</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Dock */}
              <div className={`absolute bottom-6 left-3 right-3 h-[90px] ${isDarkMode ? 'bg-black/30' : 'bg-white/20'} backdrop-blur-3xl rounded-[35px] flex items-center justify-center p-2 border border-white/20 gap-3 z-30`}>
                <div 
                  className="flex items-center gap-3"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <AnimatePresence mode="popLayout">
                    {dockApps.map((id, index) => (
                      <motion.div 
                        key={id} 
                        layout
                        layoutId={id}
                        drag={isJiggling}
                        dragListener={isJiggling}
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.9}
                        whileDrag={{ 
                          scale: 1.2, 
                          zIndex: 50,
                          transition: { duration: 0.1 }
                        }}
                        onDrag={(_, info) => {
                          if (!isJiggling) return;
                          
                          // Dock reordering logic (horizontal)
                          // Dock items are roughly 60px wide + 12px gap
                          const targetIndex = Math.min(dockApps.length - 1, Math.max(0, Math.floor((info.point.x - 40) / 75)));
                          
                          if (targetIndex !== index) {
                            const newList = [...dockApps];
                            const [movedItem] = newList.splice(index, 1);
                            newList.splice(targetIndex, 0, movedItem);
                            setDockApps(newList);
                          }
                        }}
                        onDragEnd={(_, info) => {
                          if (!isJiggling) return;
                          if (info.point.y < 600) {
                            setInstalledApps(prev => [...prev, id]);
                            setDockApps(prev => prev.filter(a => a !== id));
                          }
                        }}
                        className="touch-none"
                      >
                        <AppIcon 
                          id={id} 
                          label="" 
                          color={getIconColor(id)} 
                          icon={getIconElement(id)} 
                          isDarkMode={isDarkMode}
                          isJiggling={isJiggling}
                          customSrc={customIcons[id]} 
                          onClick={() => openApp(id)} 
                          onRemove={() => removeDockApp(id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {screenState === ScreenState.AppOpen && (
            <motion.div key="app" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="flex-1 flex flex-col bg-white z-50 rounded-t-[40px] overflow-hidden">
              {renderAppContent()}
              <div onClick={goHome} className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-black/10 rounded-full z-[100] cursor-pointer hover:bg-black/20" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Navigation Indicator Overlay for Home Screen */}
        {screenState === ScreenState.Home && (
          <div onClick={goHome} className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-white/40 rounded-full z-[100] cursor-pointer hover:bg-white/60 transition-colors" />
        )}
      </div>
    </div>
  );
}

const ProfileInput = ({ label, value, isDark, onChange }: { label: string, value: string, isDark: boolean, onChange: (v: string) => void }) => (
  <div className="px-5 py-3 flex items-center"><span className="w-20 text-sm font-medium">{label}</span>
    <input className={`flex-1 text-sm outline-none bg-transparent ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} value={value} onChange={e => onChange(e.target.value)} placeholder={`請輸入${label}`} /></div>
);

const WallpaperThumb = ({ label, src, onClick }: { label: string, src: string, onClick: () => void }) => (
  <div className="flex flex-col items-center gap-2 text-black"><span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">{label}</span>
    <div className="w-24 h-48 bg-neutral-200 rounded-xl overflow-hidden border-2 border-white shadow-sm relative group cursor-pointer" onClick={onClick}>
      <img src={src} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><Plus /></div></div></div>
);

const SettingsRow = ({ icon, iconBg, label, onClick }: { icon: React.ReactNode, iconBg: string, label: string, onClick: () => void }) => (
  <div onClick={onClick} className="px-5 py-3 flex items-center gap-3 cursor-pointer active:bg-neutral-800/10 transition-colors">
    <div className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center" style={{ backgroundColor: iconBg }}>{icon}</div>
    <span className="flex-1 font-medium text-sm">{label}</span><ChevronRight className="text-neutral-400" size={16} /></div>
);

interface AppIconProps {
  id: AppId;
  label: string;
  color: string;
  icon: React.ReactNode;
  isDarkMode: boolean;
  isJiggling?: boolean;
  customSrc?: string;
  onClick: () => void;
  onRemove: () => void;
}

const AppIcon = ({ id, label, color, icon, isDarkMode, isJiggling, customSrc, onClick, onRemove }: AppIconProps) => (
  <div className={`flex flex-col items-center relative ${label === "" ? "" : "gap-1"}`}>
    <motion.button 
      animate={isJiggling ? { rotate: [0, -1, 1, -1, 0] } : {}}
      transition={isJiggling ? { repeat: Infinity, duration: 0.2 } : {}}
      whileTap={{ scale: 0.9 }} 
      onClick={isJiggling ? undefined : onClick} 
      className={`${label === "" ? "w-[60px] h-[60px]" : "w-[62px] h-[62px]"} rounded-[15px] flex items-center justify-center shadow-lg overflow-hidden border border-white/30 backdrop-blur-md bg-white/20`}
    >
      {customSrc ? (
        <img src={customSrc} className="w-full h-full object-cover" />
      ) : (
        <div className={isDarkMode ? "text-white" : "text-black"}>
          {React.cloneElement(icon as React.ReactElement, { size: label === "" ? 28 : 30 })}
        </div>
      )}
    </motion.button>
    {label !== "" && <span className="text-[11px] font-medium text-white drop-shadow-md truncate w-16 text-center">{label}</span>}

    {isJiggling && (
      <button 
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center text-black font-bold text-xs shadow-sm z-20"
      >
        <Plus size={14} className="rotate-45" />
      </button>
    )}
  </div>
);


