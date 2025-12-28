
import React, { useState, useRef } from 'react';
import { Upload, Camera, Trash2, Plus, Sparkles, X, ChevronRight, Check, ShoppingBag } from 'lucide-react';
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

  const updateOutfitDescription = (id: string, desc: string) => {
    setOutfits(prev => prev.map(o => o.id === id ? { ...o, description: desc } : o));
  };

  const removeOutfit = (id: string) => {
    setOutfits(prev => prev.filter(o => o.id !== id));
    if (selectedOutfitId === id) setSelectedOutfitId(null);
  };

  const handleTryOn = async () => {
    const selectedOutfit = outfits.find(o => o.id === selectedOutfitId);
    if (!userImage || !selectedOutfit) {
      setError("Please upload your photo and select an outfit.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const gemini = GeminiService.getInstance();
      const result = await gemini.generateTryOn(
        userImage,
        selectedOutfit.image,
        selectedOutfit.description || "Apply this outfit naturally."
      );
      if (result) {
        setResultImage(result);
      } else {
        setError("Could not generate try-on. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during the try-on process.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="px-6 py-8 space-y-10 animate-fade-in">
      {/* Step 1: User Identity */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Step 01</span>
            <h2 className="text-2xl font-semibold tracking-tight">Your Profile</h2>
          </div>
          {userImage && (
            <button 
              onClick={() => setUserImage(null)}
              className="text-xs font-medium text-gray-500 underline"
            >
              Reset
            </button>
          )}
        </div>
        
        {!userImage ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-gray-100 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400">
              <Camera size={28} strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-800">Upload your photo</p>
              <p className="text-sm text-gray-500">Selfie or full-body works best</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleUserImageUpload} 
            />
          </div>
        ) : (
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
            <img src={userImage} alt="User" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        )}
      </section>

      {/* Step 2: Outfit Collection */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Step 02</span>
            <h2 className="text-2xl font-semibold tracking-tight">Select Outfit</h2>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x">
          <button 
            onClick={() => outfitInputRef.current?.click()}
            className="flex-shrink-0 w-32 aspect-[3/4] rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all"
          >
            <Plus size={32} />
            <input 
              type="file" 
              ref={outfitInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleOutfitUpload} 
            />
          </button>
          
          {outfits.map((outfit) => (
            <div 
              key={outfit.id}
              onClick={() => setSelectedOutfitId(outfit.id)}
              className={`flex-shrink-0 w-32 aspect-[3/4] rounded-xl relative overflow-hidden cursor-pointer transition-all snap-start ${
                selectedOutfitId === outfit.id ? 'ring-2 ring-black ring-offset-2' : 'ring-1 ring-gray-200'
              }`}
            >
              <img src={outfit.image} alt="Outfit" className="w-full h-full object-cover" />
              <button 
                onClick={(e) => { e.stopPropagation(); removeOutfit(outfit.id); }}
                className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full text-red-500 hover:bg-white"
              >
                <Trash2 size={14} />
              </button>
              {selectedOutfitId === outfit.id && (
                <div className="absolute bottom-2 right-2 bg-black text-white p-1 rounded-full">
                  <Check size={12} />
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedOutfitId && (
          <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-slide-up">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Instructions</label>
            <textarea 
              value={outfits.find(o => o.id === selectedOutfitId)?.description || ''}
              onChange={(e) => updateOutfitDescription(selectedOutfitId, e.target.value)}
              placeholder="e.g., 'Try only the shirt', 'Tuck in the pants'"
              className="w-full p-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-1 focus:ring-black min-h-[80px] resize-none"
            />
          </div>
        )}
      </section>

      {/* Action CTA */}
      <div className="pt-4">
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <button 
          onClick={handleTryOn}
          disabled={isProcessing || !userImage || !selectedOutfitId}
          className={`w-full py-5 rounded-full flex items-center justify-center gap-3 transition-all font-bold tracking-widest uppercase text-sm ${
            isProcessing || !userImage || !selectedOutfitId
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-black text-white shadow-xl hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Magic Try-On
            </>
          )}
        </button>
      </div>

      {/* Result Modal */}
      {resultImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="relative w-full max-w-sm">
            {/* Convenienly placed Close Button on front of image */}
            <button 
              onClick={() => setResultImage(null)}
              className="absolute -top-4 -right-4 z-[110] bg-white text-black p-3 hover:bg-gray-100 rounded-full shadow-xl transition-transform active:scale-90"
            >
              <X size={24} />
            </button>
            
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative bg-gray-900 ring-1 ring-white/20">
              <img src={resultImage} alt="Try-On Result" className="w-full h-full object-contain" />
            </div>

            <div className="mt-8 flex gap-4 w-full">
              <button 
                className="flex-1 py-4 rounded-full bg-white text-black font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = resultImage;
                  link.download = 'vtry-outfit.png';
                  link.click();
                }}
              >
                Download
              </button>
              <button className="p-4 rounded-full bg-white/10 text-white backdrop-blur border border-white/20 hover:bg-white/20 transition-colors">
                <ShoppingBag size={20} />
              </button>
            </div>
          </div>
          
          <p className="mt-8 text-gray-400 text-sm italic text-center max-w-[200px]">
            AI generated for your style visualization.
          </p>
        </div>
      )}
    </div>
  );
};

export default TryOnExperience;
