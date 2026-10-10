import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';

import { getPostBySlug, getRelatedPosts, posts } from '@/data/journal';
import ZenImage from '@/components/ZenImage';
import ZoomImage from '@/components/ZoomImage';
import JapanesePhotoFrame from '@/components/JapanesePhotoFrame';
import ScrollReveal from '@/components/ScrollReveal';

export default function JournalArticle() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Shizuka Café`;
      // In a real app, you would also update meta tags here
    }
  }, [post]);

  if (!post) {
    return (
      <section className="bg-zen-paper min-h-[70vh] flex items-center justify-center pt-32 pb-16 px-6">
        <div className="text-center max-w-md">
          <svg className="w-24 h-24 mx-auto text-zen-hairline mb-8" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="50" cy="50" r="40" strokeDasharray="200" strokeDashoffset="40" strokeLinecap="round" />
          </svg>
          <h1 className="font-heading text-4xl text-zen-charcoal mb-4">Story Not Found</h1>
          <p className="text-zen-muted mb-8">
            The page you're looking for has been moved or no longer exists.
          </p>
          <Link 
            to="/journal" 
            className="inline-block px-8 py-3 bg-zen-charcoal text-zen-paper hover:bg-zen-espresso transition-colors duration-300"
          >
            Return to Journal
          </Link>
        </div>
      </section>
    );
  }

  const relatedPosts = getRelatedPosts(post.id, post.category, 3);
  
  // Find prev/next posts based on date (assuming posts array is sorted by date in data file, or we just use index)
  const currentIndex = posts.findIndex(p => p.id === post.id);
  const prevPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null; // Older post
  const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : null; // Newer post

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={index} className="mb-8 text-zen-charcoal leading-relaxed text-lg">
            {block.content}
          </p>
        );
      case 'heading':
        return (
          <h2 key={index} className="font-heading text-3xl text-zen-charcoal mt-16 mb-6">
            {block.content}
          </h2>
        );
      case 'quote':
        return (
          <blockquote key={index} className="my-12 pl-6 border-l-2 border-zen-clay italic font-heading text-2xl md:text-3xl text-zen-charcoal leading-snug">
            "{block.content}"
          </blockquote>
        );
      case 'list':
        return (
          <ul key={index} className="mb-8 pl-6 space-y-3 text-zen-charcoal leading-relaxed text-lg list-disc marker:text-zen-clay">
            {block.items?.map((item, i) => (
              <li key={i} className="pl-2">{item}</li>
            ))}
          </ul>
        );
      case 'image':
        return (
          <figure key={index} className="my-12">
            <JapanesePhotoFrame aspect="aspect-[4/3] md:aspect-[16/9]">
              <ZenImage 
                alt={block.caption || 'Article image'}
                label={block.label}
                aspect="h-full"
                className="w-full h-full"
              />
            </JapanesePhotoFrame>
            {block.caption && (
              <figcaption className="text-center text-sm text-zen-muted mt-4">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <article className="bg-zen-paper pt-32 pb-16 md:pt-40 md:pb-24">
        {/* Article Header */}
        <header className="mx-auto max-w-[1000px] px-6 md:px-10 text-center mb-16 md:mb-24">
          <ScrollReveal>
            <div className="mb-6 inline-block">
              <Link to="/journal" className="label-eyebrow text-zen-clay hover:text-zen-charcoal transition-colors">
                {post.category}
              </Link>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-zen-charcoal mb-8 leading-tight max-w-4xl mx-auto">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-zen-muted">
              <div className="flex items-center space-x-2">
                {/* Fallback avatar if needed, using a simple circle for styling */}
                <div className="w-8 h-8 rounded-full bg-zen-surface border border-zen-hairline overflow-hidden flex items-center justify-center">
                  <span className="text-xs uppercase font-medium">{post.author.name.charAt(0)}</span>
                </div>
                <span>By {post.author.name}</span>
              </div>
              <span className="hidden md:inline text-zen-hairline">|</span>
              <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
              <span className="hidden md:inline text-zen-hairline">|</span>
              <span>{post.readTime}</span>
            </div>
          </ScrollReveal>
        </header>

        {/* Cover Image */}
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 mb-16 md:mb-24">
          <ScrollReveal delay={0.2}>
            <JapanesePhotoFrame aspect="aspect-[16/9] md:aspect-[2/1]">
              <ZenImage 
                alt={post.title}
                label={post.coverImageLabel}
                aspect="h-full"
                className="w-full h-full"
                priority={true}
              />
            </JapanesePhotoFrame>
          </ScrollReveal>
        </div>

        {/* Article Body */}
        <div className="mx-auto max-w-[680px] px-6 md:px-0">
          <ScrollReveal delay={0.3}>
            <div className="article-content">
              {post.content.map((block, index) => renderContentBlock(block, index))}
            </div>

            {/* Share and Tags */}
            <div className="mt-16 pt-8 border-t border-zen-hairline flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-zen-muted uppercase tracking-widest">Share</span>
                <button 
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full border border-zen-hairline flex items-center justify-center text-zen-charcoal hover:border-zen-clay transition-colors min-h-[44px] min-w-[44px]"
                  aria-label="Copy link"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
              <div className="fixed bottom-8 right-8 bg-zen-charcoal text-zen-paper px-6 py-3 shadow-lg z-50 rounded animate-fade-in">
                Link copied to clipboard
              </div>
            )}
          </ScrollReveal>
        </div>
      </article>

      {/* Prev / Next Navigation */}
      <section className="bg-zen-surface py-12 border-t border-b border-zen-hairline">
        <div className="mx-auto max-w-[1000px] px-6 flex flex-col sm:flex-row justify-between items-center gap-8">
          {prevPost ? (
            <Link to={`/journal/${prevPost.slug}`} className="group flex-1 max-w-[300px] text-center sm:text-left">
              <span className="block label-eyebrow text-zen-muted mb-2">← Older Story</span>
              <span className="font-heading text-xl text-zen-charcoal group-hover:text-zen-clay transition-colors line-clamp-2">
                {prevPost.title}
              </span>
            </Link>
          ) : <div className="flex-1"></div>}
          
          <Link to="/journal" className="w-12 h-12 flex items-center justify-center rounded-full border border-zen-hairline text-zen-muted hover:border-zen-charcoal hover:text-zen-charcoal transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </Link>

          {nextPost ? (
            <Link to={`/journal/${nextPost.slug}`} className="group flex-1 max-w-[300px] text-center sm:text-right">
              <span className="block label-eyebrow text-zen-muted mb-2">Newer Story →</span>
              <span className="font-heading text-xl text-zen-charcoal group-hover:text-zen-clay transition-colors line-clamp-2">
                {nextPost.title}
              </span>
            </Link>
          ) : <div className="flex-1"></div>}
        </div>
      </section>

      {/* Related Stories */}
      {relatedPosts.length > 0 && (
        <section className="bg-zen-paper py-20 md:py-32">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-5xl text-zen-charcoal">More from {post.category}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost.id} className="group h-full flex flex-col">
                    <Link to={`/journal/${relatedPost.slug}`} className="block mb-6">
                      <div className="rounded-2xl border border-zen-hairline/80 bg-zen-surface/60 p-1 shadow-2xs transition-all duration-500 group-hover:border-zen-clay/60">
                        <div className="overflow-hidden rounded-xl">
                          <ZoomImage 
                            label={relatedPost.coverImageLabel}
                            alt={relatedPost.title}
                            aspect="aspect-[4/3]"
                            className="w-full"
                          />
                        </div>
                      </div>
                    </Link>
                    <div className="flex-grow flex flex-col">
                      <div className="mb-3">
                        <span className="label-eyebrow text-zen-clay">{relatedPost.category}</span>
                      </div>
                      <Link to={`/journal/${relatedPost.slug}`}>
                        <h3 className="font-heading text-2xl text-zen-charcoal mb-3 group-hover:text-zen-clay transition-colors duration-300 line-clamp-2">
                          {relatedPost.title}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between text-xs text-zen-muted mt-auto pt-4 border-t border-zen-hairline">
                        <span>{format(new Date(relatedPost.date), 'MMM d, yyyy')}</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}
    </>
  );
}
