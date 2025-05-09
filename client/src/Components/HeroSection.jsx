import React, { useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
      title: 'Experience Movies Like Never Before',
      subtitle: 'Book your tickets now and get 50% off on your first booking!'
    },
    {
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
      title: 'Premium Experience, Budget Prices',
      subtitle: 'Enjoy luxury seating at regular prices every Tuesday!'
    },
    {
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
      title: 'Family Package Available',
      subtitle: 'Get 20% off when booking for 4 or more people'
    },
    {
      image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
      title: 'Student Special Offer',
      subtitle: 'Show your student ID and get exclusive discounts!'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const scrollToSearch = () => {
    const searchSection = document.querySelector('.search-section');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] mt-16">
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${slide.image}")`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/50" />
          </div>
          <div className="relative container mx-auto px-8 md:px-20 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-[clamp(1.5rem,5vw,3rem)] font-bold mb-6 leading-tight">
                {slide.title}
              </h1>
              <p className="text-[clamp(1rem,3vw,1.25rem)] mb-8 leading-relaxed">
                {slide.subtitle}
              </p>
              <button 
                onClick={scrollToSearch}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg text-[clamp(0.875rem,2vw,1.125rem)] font-semibold transition-colors"
              >
                <Play size={20} />
                <span>Browse Movies</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 container mx-auto px-4 flex justify-between items-center pointer-events-none">
        <button 
          onClick={prevSlide}
          className="bg-black/50 hover:bg-black/75 text-white p-4 rounded-full transition-colors pointer-events-auto transform hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="bg-black/50 hover:bg-black/75 text-white p-4 rounded-full transition-colors pointer-events-auto transform hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-red-500 w-8' : 'bg-white/50 hover:bg-white/75'
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;