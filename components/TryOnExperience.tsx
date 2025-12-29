
import React, { useState, useRef } from 'react';
import { Upload, Camera, Trash2, Plus, Sparkles, X, Check, Share2, Download } from 'lucide-react';
import { OutfitItem } from '../types';
import { GeminiService } from '../services/geminiService';

const TryOnExperience: React.FC = () => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [outfits, setOutfits] = useState<OutfitItem[]>([]);
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const outfitInputRef = useRef<HTMLInputElement>(null);

  const handleUserImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUserImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleOutfitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newItem: OutfitItem = {
          id: Math.random().toString(36).substr(2, 9),
          image: reader.result as string,
          description: '',
        };
        setOutfits(prev => [...prev, newItem]);
        setSelectedOutfitId(newItem.id);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = async () => {
    const selectedOutfit = outfits.find(o => o.id === selectedOutfitId);
    if (!userImage || !selectedOutfit) {
      setError("Add a photo and select an outfit first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const gemini = GeminiService.getInstance();
      const result = await gemini.generateTryOn(
        userImage,
        selectedOutfit.image,
        selectedOutfit.description || "Apply outfit naturally."
      );
      if (result) {
        setResultImage(result);
      } else {
        setError("Generation failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during process.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    if (!resultImage) return;
    
    try {
      const res = await fetch(resultImage);
      const blob = await res.blob();
      const file = new File([blob], 'outfy-result.png', { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'My Outfy Look',
          text: 'Check out this outfit I tried on Outfy!',
        });
      } else {
        const link = document.createElement('a');
        link.href = resultImage;
        link.download = 'outfy-result.png';
        link.click();
      }
    } catch (err) {
      console.error("Sharing failed", err);
    }
  };

  return (
    <div className="px-6 py-8 space-y-8 animate-fade-in pb-12">
      {/* Header Profile Section */}
      <section>
        <div className="flex justify-between items-end mb-4 px-1">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">01 IDENTITY</span>
            <h2 className="text-3xl font-bold tracking-tight">Your Frame</h2>
          </div>
          {userImage && (
            <button 
              onClick={() => setUserImage(null)}
              className="text-xs font-bold text-black uppercase tracking-widest border-b-2 border-black pb-0.5 active:opacity-50"
            >
              Change
            </button>
          )}
        </div>
        
        {!userImage ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[3/4] rounded-3xl border-2 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center gap-5 cursor-pointer active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
          >
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-black shadow-inner">
              <Camera size={32} strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900 text-lg">Upload Profile</p>
              <p className="text-sm text-gray-400">Frontal view works best</p>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUserImageUpload} />
          </div>
        ) : (
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
            <img src={userImage} alt="User" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent"></div>
          </div>
        )}
      </section>

      {/* Outfit Slider Section */}
      <section>
        <div className="flex justify-between items-end mb-4 px-1">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">02 WARDROBE</span>
            <h2 className="text-3xl font-bold tracking-tight">Select Item</h2>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-6 snap-x smooth-scroll px-1">
          <button 
            onClick={() => outfitInputRef.current?.click()}
            className="flex-shrink-0 w-36 aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center text-gray-400 active:scale-95 transition-all shadow-sm"
          >
            <Plus size={40} strokeWidth={1} />
            <span className="text-[10px] font-bold uppercase mt-2 tracking-widest">New</span>
            <input type="file" ref={outfitInputRef} className="hidden" accept="image/*" onChange={handleOutfitUpload} />
          </button>
          
          {outfits.map((outfit) => (
            <div 
              key={outfit.id}
              onClick={() => setSelectedOutfitId(outfit.id)}
              className={`flex-shrink-0 w-36 aspect-[3/4] rounded-2xl relative overflow-hidden cursor-pointer transition-all snap-start ${
                selectedOutfitId === outfit.id ? 'ring-4 ring-black scale-[1.02] shadow-xl' : 'ring-1 ring-gray-100 opacity-80'
              }`}
            >
              <img src={outfit.image} alt="Outfit" className="w-full h-full object-cover" />
              <button 
                onClick={(e) => { e.stopPropagation(); setOutfits(prev => prev.filter(o => o.id !== outfit.id)); }}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-red-500 shadow-sm active:scale-90"
              >
                <Trash2 size={14} />
              </button>
              {selectedOutfitId === outfit.id && (
                <div className="absolute bottom-3 right-3 bg-black text-white p-1.5 rounded-full animate-bounce">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Button moved here, under the slider */}
        <div className="mt-6 flex flex-col gap-3">
          {error && <p className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest bg-red-50 py-2 rounded-xl border border-red-100">{error}</p>}
          <button 
            onClick={handleTryOn}
            disabled={isProcessing || !userImage || !selectedOutfitId}
            className={`w-full py-5 rounded-full flex items-center justify-center gap-3 transition-all font-black tracking-[0.3em] uppercase text-xs shadow-xl active:scale-95 ${
              isProcessing || !userImage || !selectedOutfitId
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-black text-white'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Crafting Look...</span>
              </div>
            ) : (
              <>
                <Sparkles size={18} fill="white" />
                Generate Result
              </>
            )}
          </button>
        </div>
      </section>

      {/* Instruction Input */}
      {selectedOutfitId && (
        <div className="bg-white rounded-3xl p-5 shadow-[0_15px_40px_rgba(0,0,0,0.05)] border border-gray-50 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-black" />
            <label className="text-[10px] font-black text-black uppercase tracking-[0.2em]">Refine Appearance</label>
          </div>
          <textarea 
            value={outfits.find(o => o.id === selectedOutfitId)?.description || ''}
            onChange={(e) => setOutfits(prev => prev.map(o => o.id === selectedOutfitId ? { ...o, description: e.target.value } : o))}
            placeholder="e.g., 'Tucked in', 'Add sunglasses'..."
            className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-medium border-none focus:ring-1 focus:ring-black min-h-[90px] resize-none placeholder:text-gray-400"
          />
        </div>
      )}

      {/* Result Modal */}
      {resultImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="relative w-full max-w-sm">
            <button 
              onClick={() => setResultImage(null)}
              className="absolute -top-6 -right-2 z-[120] bg-white text-black p-4 rounded-full shadow-2xl active:scale-75 transition-transform"
            >
              <X size={28} strokeWidth={2.5} />
            </button>
            
            <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative bg-gray-900 ring-2 ring-white/10">
              <img src={resultImage} alt="Try-On Result" className="w-full h-full object-contain" />
              <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                 <button 
                  onClick={handleShare}
                  className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest active:scale-95 transition-all"
                 >
                   <Share2 size={16} /> Share
                 </button>
                 <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = resultImage;
                    link.download = 'outfy-result.png';
                    link.click();
                  }}
                  className="w-16 bg-white text-black rounded-2xl flex items-center justify-center active:scale-95"
                 >
                   <Download size={20} />
                 </button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center animate-slide-up">
            <p className="text-white font-bold tracking-[0.2em] uppercase text-[10px] mb-2">Style Visualization</p>
            <p className="text-gray-400 text-xs px-12 leading-relaxed font-medium italic">
              "Your style, reimagined with precision."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TryOnExperience;
