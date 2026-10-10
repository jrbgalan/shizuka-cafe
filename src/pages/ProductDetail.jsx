import React, { useState, useMemo, useRef } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Star, Minus, Plus, Heart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import ProductCard from "@/components/ProductCard";
import ZenImage from "@/components/ZenImage";
import JapanesePhotoFrame from "@/components/JapanesePhotoFrame";
import { getProductBySlug, products, grindOptions, sizeOptions } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";
import { getUnsplashImageUrl } from "@/lib/unsplash";

function Selector({ label, options, value, onChange }) {
  return (
    <div>
      <p className="label-eyebrow">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const val = typeof o === "string" ? o : o.label;
          const active = value === val;
          return (
            <button
              key={val}
              type="button"
              onClick={() => onChange(val)}
              className={cn(
                "border px-4 py-2 text-sm transition-colors",
                active ? "border-zen-charcoal bg-zen-charcoal text-zen-paper" : "border-zen-hairline text-zen-muted hover:border-zen-charcoal hover:text-zen-charcoal"
              )}
            >
              {val}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const { addItem, toggleWishlist, isWishlisted } = useCart();
  const { format } = useCurrency();

  const [grind, setGrind] = useState("Whole Bean");
  const [size, setSize] = useState("250g");
  const [qty, setQty] = useState(1);
  const [photoIndex, setPhotoIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const images = (product?.images && product.images.length > 0)
    ? product.images
    : [product?.image || getUnsplashImageUrl(product?.imageLabel)];

  const prevPhoto = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setPhotoIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const nextPhoto = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setPhotoIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) nextPhoto();
      else prevPhoto();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const sizePrice = useMemo(() => {
    const opt = sizeOptions.find((o) => o.label === size);
    return (product?.price || 0) + (opt?.price || 0);
  }, [size, product]);

  if (!product) return <Navigate to="/shop" replace />;

  const related = products.filter((p) => p.id !== product.id && p.origin === product.origin).slice(0, 3);
  const relatedFinal = related.length >= 3 ? related : products.filter((p) => p.id !== product.id).slice(0, 3);
  const wished = isWishlisted(product.id);

  return (
    <>
      <section className="bg-zen-paper pt-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <nav className="label-eyebrow">
            <Link to="/shop" className="link-underline text-zen-muted hover:text-zen-charcoal">Roastery</Link>
            <span className="mx-2">/</span>
            <span className="text-zen-charcoal">{product.name}</span>
          </nav>

          <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
            {/* Gallery with swipe and next/prev buttons */}
            <div className="flex flex-col gap-4">
              <JapanesePhotoFrame 
                aspect="aspect-[4/5]"
                className="select-none"
                innerClassName="relative"
              >
                <div 
                  className="relative h-full w-full overflow-hidden"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <ZenImage 
                    src={images[photoIndex]} 
                    label={`${product.name} angle ${photoIndex + 1}`} 
                    alt={product.name} 
                    aspect="h-full" 
                    className="h-full w-full"
                    priority 
                  />
                  {/* Subtle craft hairline edge */}
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/8 pointer-events-none" />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevPhoto}
                      aria-label="Previous photo"
                      className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-zen-paper/90 text-zen-charcoal backdrop-blur-xs transition-all duration-300 hover:bg-zen-charcoal hover:text-zen-paper z-20 shadow-xs"
                    >
                      <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      onClick={nextPhoto}
                      aria-label="Next photo"
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-zen-paper/90 text-zen-charcoal backdrop-blur-xs transition-all duration-300 hover:bg-zen-charcoal hover:text-zen-paper z-20 shadow-xs"
                    >
                      <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
                    </button>

                    {/* Mobile dots indicator */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-20 sm:hidden">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setPhotoIndex(i);
                          }}
                          aria-label={`Photo ${i + 1}`}
                          className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            photoIndex === i ? "w-4 bg-zen-paper" : "w-1.5 bg-zen-paper/50"
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}
                </div>
              </JapanesePhotoFrame>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPhotoIndex(i)}
                      className={cn(
                        "overflow-hidden rounded-xl transition-all duration-300 border-2",
                        photoIndex === i ? "border-zen-charcoal opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      <ZenImage src={img} label={`thumbnail ${i + 1}`} alt={`${product.name} thumbnail ${i + 1}`} aspect="aspect-square" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <p className="label-eyebrow">{product.origin} · {product.roast} roast · {product.process}</p>
              <h1 className="mt-4 font-heading text-5xl leading-none text-zen-charcoal md:text-6xl">{product.name}</h1>
              <p className="mt-3 font-jp text-sm tracking-[0.3em] text-zen-muted">{product.jp}</p>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={cn("h-4 w-4", s <= Math.round(product.rating) ? "fill-zen-clay text-zen-clay" : "text-zen-hairline")} strokeWidth={1.25} />
                  ))}
                </div>
                <span className="text-sm text-zen-muted">{product.rating} · {product.reviewsCount} reviews</span>
              </div>

              <p className="mt-6 text-zen-muted leading-relaxed">{product.description}</p>

              {/* Tasting notes */}
              <div className="mt-8 border-t border-zen-hairline pt-6">
                <p className="label-eyebrow">Tasting notes</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.tastingNotes.map((n) => (
                    <span key={n} className="border border-zen-hairline px-3 py-1.5 text-sm text-zen-charcoal">{n}</span>
                  ))}
                </div>
              </div>

              {/* Origin */}
              <div className="mt-6 border-t border-zen-hairline pt-6">
                <p className="label-eyebrow">Origin</p>
                <p className="mt-2 text-sm text-zen-muted">{product.origin}, {product.process} process. Roasted in small batches, the week we ship.</p>
              </div>

              {/* Selectors */}
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Selector label="Grind" options={grindOptions} value={grind} onChange={setGrind} />
                <Selector label="Size" options={sizeOptions} value={size} onChange={setSize} />
              </div>

              {/* Qty + price + add */}
              <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="label-eyebrow">Quantity</p>
                  <div className="mt-3 flex items-center gap-4 border border-zen-hairline px-3 py-2 w-fit">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease" className="text-zen-charcoal"><Minus className="h-4 w-4" strokeWidth={1.5} /></button>
                    <span className="w-8 text-center">{qty}</span>
                    <button onClick={() => setQty((q) => q + 1)} aria-label="Increase" className="text-zen-charcoal"><Plus className="h-4 w-4" strokeWidth={1.5} /></button>
                  </div>
                </div>
                <p className="font-heading text-3xl text-zen-charcoal">{format(sizePrice * qty)}</p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => addItem(product, { grind, size, qty, price: sizePrice })}
                  className="flex flex-1 items-center justify-center gap-2 bg-zen-charcoal py-4 text-xs uppercase tracking-[0.25em] text-zen-paper transition-colors hover:bg-zen-espresso"
                >
                  Add to cart <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={cn("flex items-center justify-center gap-2 border px-6 py-4 text-xs uppercase tracking-[0.25em] transition-colors", wished ? "border-red-700 text-red-700" : "border-zen-charcoal text-zen-charcoal hover:bg-zen-charcoal hover:text-zen-paper")}
                >
                  <Heart className="h-4 w-4" strokeWidth={1.25} fill={wished ? "currentColor" : "none"} /> {wished ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="bg-zen-surface">
        <div className="mx-auto max-w-[1400px] px-6 py-22 md:px-10 md:py-30">
          <h2 className="font-heading text-4xl text-zen-charcoal md:text-5xl">You might also like</h2>
          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {relatedFinal.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews (static) */}
      <section className="bg-zen-paper">
        <div className="mx-auto max-w-[1100px] px-6 py-22 md:px-10 md:py-30">
          <ScrollReveal>
            <h2 className="font-heading text-4xl text-zen-charcoal">From the cupping table</h2>
          </ScrollReveal>
          <div className="mt-12 space-y-10">
            {[
              { name: "Rin S.", text: "The jasmine note is real and present, not imagined. Best Yirgacheffe I've had this year." },
              { name: "David L.", text: "Brewed as a V60, the stone fruit came forward as it cooled. Will reorder." },
              { name: "Mika", text: "Beautifully roasted — even, no tipping. Shipped fresh." }
            ].map((r, i) => (
              <ScrollReveal key={r.name} delay={i * 0.08}>
                <blockquote className="border-l border-zen-clay pl-6">
                  <p className="font-heading text-xl italic text-zen-charcoal">"{r.text}"</p>
                  <footer className="mt-3 label-eyebrow">{r.name}</footer>
                </blockquote>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}