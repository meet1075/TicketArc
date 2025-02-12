import React from 'react';
import { Play } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative h-[600px] mt-16">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/50" />
      </div>
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl font-bold mb-4">Experience Movies Like Never Before</h1>
          <p className="text-xl mb-8">Book your tickets now and get 50% off on your first booking!</p>
          <button className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
            <Play size={20} />
            <span>Browse Movies</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
