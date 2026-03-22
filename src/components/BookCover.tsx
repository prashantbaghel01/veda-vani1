import React from 'react';

interface BookCoverProps {
  title: string;
  className?: string;
}

const BookCover: React.FC<BookCoverProps> = ({ title, className = "" }) => {
  return (
    <div 
      className={`relative w-full h-full rounded-[20px] shadow-2xl flex flex-col items-center justify-center p-8 text-center overflow-hidden group transition-transform duration-300 ease-in-out hover:scale-[1.05] ${className}`}
      style={{
        backgroundImage: "url('/books/frame.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(0,0,0,0.35)',
        backgroundBlendMode: 'multiply',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 0 100px rgba(0,0,0,0.5)',
      }}
    >
      {/* Royal Inner Border */}
      <div className="absolute inset-4 border-2 border-[#d4af37]/20 rounded-xl pointer-events-none"></div>

      {/* Book Title */}
      <h3 
        className="font-serif text-[#d4af37] text-xl md:text-2xl font-black leading-tight tracking-tight z-10 uppercase italic px-4"
        style={{
          textShadow: `
            0 0 6px rgba(212,175,55,0.6),
            0 0 12px rgba(212,175,55,0.4)
          `
        }}
      >
        {title}
      </h3>
      
      {/* Spine Detail */}
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-black/30 blur-[1px] border-r border-white/5"></div>
      
      {/* Leather Texture Overlay (Subtle) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mandala-bg mix-blend-overlay"></div>
    </div>
  );
};

export default BookCover;
