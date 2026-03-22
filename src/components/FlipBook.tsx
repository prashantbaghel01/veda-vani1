import React, { forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { VedaPage, ContentBlock } from '../types';

interface PageProps {
  number: number;
  page: VedaPage;
}

const Page = forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  const { page, number } = props;

  const renderBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'quote':
        return (
          <div key={index} className="my-10 text-center relative px-6">
            <span className="absolute top-0 left-0 text-6xl text-primary/10 font-serif leading-none">"</span>
            <p className="font-serif italic text-2xl text-on-surface/90 leading-relaxed relative z-10">
              {block.content}
            </p>
            {block.author && (
              <p className="mt-4 text-xs font-label uppercase tracking-[0.2em] text-primary/60">
                — {block.author}
              </p>
            )}
          </div>
        );
      case 'teaching':
      case 'lesson':
      case 'reflection':
      case 'fact':
        return (
          <div key={index} className="my-8 p-8 bg-secondary/40 border border-outline/30 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 mandala-bg opacity-[0.03] -mr-8 -mt-8"></div>
            <h4 className="font-headline text-[10px] uppercase tracking-[0.3em] text-primary mb-3">
              {block.type}
            </h4>
            <p className="font-body text-base text-on-surface/80 leading-relaxed">
              {block.content}
            </p>
          </div>
        );
      default:
        return (
          <p key={index} className="my-6 font-body text-[17px] text-on-surface/90 leading-[1.8] first-letter:text-5xl first-letter:font-headline first-letter:mr-3 first-letter:float-left first-letter:text-primary first-letter:leading-none">
            {block.content}
          </p>
        );
    }
  };

  return (
    <div className="page bg-[#F8F1E5] p-10 md:p-16 shadow-inner h-full flex flex-col relative overflow-hidden" ref={ref}>
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] grain-texture"></div>
      
      {/* Decorative Border */}
      <div className="absolute inset-6 border border-primary/5 pointer-events-none rounded-lg"></div>

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="mb-10 text-center">
          <h3 className="font-label text-[10px] text-primary/40 uppercase tracking-[0.4em] mb-3">
            Bhagavad Gita
          </h3>
          <h2 className="font-headline text-3xl text-on-surface border-b border-primary/10 pb-6 inline-block tracking-tight">
            {page.title}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
          {page.blocks.map((block, idx) => renderBlock(block, idx))}
        </div>

        <div className="mt-10 pt-6 border-t border-primary/10 flex justify-between items-center font-label text-[10px] tracking-[0.3em] text-primary/30 uppercase">
          <span>Veda Vani</span>
          <span>{number}</span>
        </div>
      </div>
    </div>
  );
});

interface FlipBookProps {
  pages: VedaPage[];
}

const FlipBook: React.FC<FlipBookProps> = ({ pages }) => {
  return (
    <div className="flex items-center justify-center min-h-[80vh] py-12 px-4">
      <div className="relative max-w-5xl w-full aspect-[4/3] md:aspect-[1.4/1] shadow-2xl rounded-lg overflow-hidden border-8 border-primary/5">
        {/* @ts-ignore */}
        <HTMLFlipBook
          width={550}
          height={733}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          maxShadowOpacity={0.5}
          showCover={false}
          mobileScrollSupport={true}
          className="book-container"
        >
          {pages.map((page, index) => (
            <Page key={index} number={index + 1} page={page} />
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  );
};

export default FlipBook;
