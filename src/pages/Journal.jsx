import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import { posts, categories, searchPosts } from '@/data/journal';
import ZoomImage from '@/components/ZoomImage';
import ScrollReveal from '@/components/ScrollReveal';
import Newsletter from '@/components/Newsletter';

const POSTS_PER_PAGE = 6;

export default function Journal() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    let result = posts;

    if (debouncedQuery) {
      result = searchPosts(debouncedQuery);
    } else if (activeCategory !== 'All') {
      result = posts.filter(post => post.category === activeCategory);
    }

    return result;
  }, [debouncedQuery, activeCategory]);

  const featuredPost = posts.find(post => post.featured);
  // Remove featured post from the general list if no filters are active to avoid duplication
  const displayPosts = (debouncedQuery || activeCategory !== 'All') 
    ? filteredPosts 
    : filteredPosts.filter(post => !post.featured);

  const visiblePosts = displayPosts.slice(0, visibleCount);
  const hasMore = visiblePosts.length < displayPosts.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + POSTS_PER_PAGE);
      setIsLoadingMore(false);
    }, 600); // Simulate network delay for skeleton
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-zen-paper pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 text-center">
          <ScrollReveal>
            <div className="mb-4 inline-flex items-center justify-center space-x-3 text-zen-muted">
              <span className="h-px w-8 bg-zen-hairline"></span>
              <span className="label-eyebrow">日記</span>
              <span className="h-px w-8 bg-zen-hairline"></span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl text-zen-charcoal mb-6 lowercase">
              journal
            </h1>
            <p className="max-w-xl mx-auto text-zen-muted md:text-lg">
              Stories from the roastery, brewing guides, and quiet moments.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Post (Only show if no search/filter) */}
      {!debouncedQuery && activeCategory === 'All' && featuredPost && (
        <section className="bg-zen-surface py-16 md:py-24 border-b border-zen-hairline">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
                <div className="md:col-span-7">
                  <Link to={`/journal/${featuredPost.slug}`} className="block group">
                    <ZoomImage 
                      label={featuredPost.coverImageLabel}
                      alt={featuredPost.title}
                      aspect="aspect-[4/3] md:aspect-[16/9]"
                      className="w-full"
                    />
                  </Link>
                </div>
                <div className="md:col-span-5 flex flex-col justify-center">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="label-eyebrow text-zen-clay">{featuredPost.category}</span>
                    <span className="w-1 h-1 rounded-full bg-zen-hairline"></span>
                    <span className="text-sm text-zen-muted">Featured</span>
                  </div>
                  <Link to={`/journal/${featuredPost.slug}`} className="group inline-block mb-6">
                    <h2 className="font-heading text-3xl md:text-5xl text-zen-charcoal mb-4 group-hover:text-zen-clay transition-colors duration-300">
                      {featuredPost.title}
                    </h2>
                    <p className="text-zen-muted leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                  </Link>
                  <div className="flex items-center justify-between text-sm text-zen-muted">
                    <div>
                      {format(new Date(featuredPost.date), 'MMMM d, yyyy')} • {featuredPost.readTime}
                    </div>
                    <Link to={`/journal/${featuredPost.slug}`} className="link-underline font-medium text-zen-charcoal">
                      Read more →
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <section className="bg-zen-paper py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          
          {/* Controls: Filter & Search */}
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
              {/* Filter Chips */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => { setActiveCategory(category); setVisibleCount(POSTS_PER_PAGE); }}
                    className={`px-4 py-2 rounded-full text-sm transition-colors duration-300 min-h-[44px] min-w-[44px] ${
                      activeCategory === category 
                        ? 'bg-zen-charcoal text-zen-paper' 
                        : 'bg-transparent border border-zen-hairline text-zen-charcoal hover:border-zen-clay'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="w-full md:w-auto relative">
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(POSTS_PER_PAGE); }}
                  className="w-full md:w-64 px-4 py-3 bg-transparent border-b border-zen-hairline focus:border-zen-charcoal outline-none transition-colors duration-300 text-zen-charcoal placeholder-zen-muted min-h-[44px]"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-zen-muted hover:text-zen-charcoal min-h-[44px] min-w-[44px]"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Posts Grid */}
          {visiblePosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {visiblePosts.map((post, index) => (
                <ScrollReveal key={post.id} delay={index % 3 * 0.1}>
                  <article className="group h-full flex flex-col">
                    <Link to={`/journal/${post.slug}`} className="block mb-6 overflow-hidden">
                      <ZoomImage 
                        label={post.coverImageLabel}
                        alt={post.title}
                        aspect="aspect-[4/3]"
                        className="w-full"
                      />
                    </Link>
                    <div className="flex-grow flex flex-col">
                      <div className="mb-3">
                        <span className="label-eyebrow text-zen-clay">{post.category}</span>
                      </div>
                      <Link to={`/journal/${post.slug}`}>
                        <h3 className="font-heading text-2xl text-zen-charcoal mb-3 group-hover:text-zen-clay transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-zen-muted text-sm mb-6 line-clamp-3 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-zen-muted mt-auto pt-4 border-t border-zen-hairline">
                        <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            /* Empty State */
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <svg className="w-24 h-24 text-zen-hairline mb-6" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50" strokeLinecap="round"/>
                  <path d="M15 40C20 20 40 15 60 20" strokeLinecap="round"/>
                </svg>
                <h3 className="font-heading text-2xl text-zen-charcoal mb-2">Nothing here yet</h3>
                <p className="text-zen-muted">A quiet page. Try adjusting your search or filter.</p>
              </div>
            </ScrollReveal>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="mt-20 text-center">
              {isLoadingMore ? (
                <div className="flex space-x-2 justify-center">
                  <span className="w-2 h-2 rounded-full bg-zen-clay animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-zen-clay animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-zen-clay animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              ) : (
                <button 
                  onClick={handleLoadMore}
                  className="px-8 py-3 border border-zen-charcoal text-zen-charcoal hover:bg-zen-charcoal hover:text-zen-paper transition-colors duration-300 min-h-[44px]"
                >
                  Load More
                </button>
              )}
            </div>
          )}

        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </>
  );
}
