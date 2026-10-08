import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ZenImage from "@/components/ZenImage";
import ZoomImage from "@/components/ZoomImage";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import ExperienceCard from "@/components/ExperienceCard";
import ProductCard from "@/components/ProductCard";
import Newsletter from "@/components/Newsletter";
import { experiences, testimonials, gallery, values } from "@/data/content";
import { products } from "@/data/products";
import { menuItems } from "@/data/menu";
import { useCurrency } from "@/context/CurrencyContext";

function HeroLogo() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // The big centered logo scales down and lifts as you scroll — the visual
  // handoff to the header logo (which fades in over the same distance).
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.55]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen min-h-[640px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <ZenImage
          label="Morning sunlight through cafe window with plants and coffee"
          alt="Coffee brew setup and tranquil green plants in morning sun"
          aspect="h-full"
          className="h-full w-full"
          overlay
          priority
        />
      </div>
      <div className="absolute inset-0 bg-zen-espresso/25" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-zen-paper">
        <motion.p
          className="label-eyebrow text-zen-paper/80"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        >
          Café & Zakka & Coffee Roastery
        </motion.p>

        <motion.div
          style={reduce ? undefined : { scale, y, opacity }}
          className="mt-6"
        >
          <motion.h1
            className="font-heading text-7xl leading-none text-zen-paper md:text-[10rem]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          >
            Shizuka
          </motion.h1>
          <motion.p
            className="mt-4 font-jp text-lg tracking-[0.5em] text-zen-paper/85 md:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.6 }}
          >
            静か · 珈琲
          </motion.p>
        </motion.div>

        <motion.p
          className="mt-10 max-w-md text-zen-paper/85"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.8 }}
        >
          A quiet specialty coffee cafe and roastery. Single-origin beans, brewed slowly, in a room made for lingering.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 1 }}
        >
          <Link to="/shop" className="flex items-center gap-2 bg-zen-paper px-7 py-3.5 text-xs uppercase tracking-[0.25em] text-zen-charcoal transition-colors hover:bg-zen-clay hover:text-zen-paper">
            Shop the roastery <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <Link to="/reservations" className="flex items-center gap-2 border border-zen-paper/70 px-7 py-3.5 text-xs uppercase tracking-[0.25em] text-zen-paper transition-colors hover:bg-zen-paper hover:text-zen-charcoal">
            Reserve a seat
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zen-paper/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <p className="label-eyebrow text-zen-paper/70">Scroll</p>
      </motion.div>
    </section>
  );
}

function FeaturedMenu() {
  const { format } = useCurrency();
  const picks = ["m1", "m7", "m14", "bf-1"]
    .map((id) => menuItems.find((m) => m.id === id || m.slug === id))
    .filter(Boolean);
  return (
    <section className="bg-zen-paper">
      <div className="mx-auto max-w-[1400px] px-6 py-22 md:px-10 md:py-30">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="From the counter" title="A few things we pour" jp="メニューより" />
          <Link to="/menu" className="label-eyebrow link-underline text-zen-charcoal self-start md:self-end">The full menu →</Link>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {picks.map((m, i) => (
            <ScrollReveal key={m.id} delay={i * 0.08}>
              <div>
                <ZoomImage label={m.imageLabel} alt={m.name} aspect="aspect-[4/5]" zoom={1.08} />
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-xl text-zen-charcoal">{m.name}</h3>
                    <p className="font-jp text-xs tracking-widest text-zen-muted">{m.jp}</p>
                  </div>
                  <span className="font-heading text-lg">{format(m.price)}</span>
                </div>
                <p className="mt-2 text-sm text-zen-muted">{m.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedBeans() {
  const featured = products.filter((p) => p.featured).slice(0, 4);
  return (
    <section className="bg-zen-surface">
      <div className="mx-auto max-w-[1400px] px-6 py-22 md:px-10 md:py-30">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="The roastery" title="This season's beans" jp="珈琲豆" />
          <Link to="/shop" className="label-eyebrow link-underline text-zen-charcoal self-start md:self-end">All beans →</Link>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryStrip() {
  return (
    <section className="bg-zen-paper">
      <div className="mx-auto max-w-[1400px] px-6 py-22 md:px-10 md:py-30">
        <SectionHeading eyebrow="The room" title="A space for stillness" jp="空間" align="center" className="mx-auto max-w-2xl" />
        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
          {gallery.map((g, i) => (
            <ScrollReveal key={g.id} delay={(i % 4) * 0.06}>
              <ZoomImage label={g.label} alt={g.caption} aspect="aspect-[3/4]" zoom={1.1} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(null);

  const prev = () => {
    setCurrent((prevIdx) => (prevIdx > 0 ? prevIdx - 1 : testimonials.length - 1));
  };

  const next = () => {
    setCurrent((prevIdx) => (prevIdx < testimonials.length - 1 ? prevIdx + 1 : 0));
  };

  // Automatic review rotation every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prevIdx) => (prevIdx < testimonials.length - 1 ? prevIdx + 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) next();
    else if (diff < -40) prev();
    touchStartX.current = null;
  };

  const t = testimonials[current];

  return (
    <section 
      className="bg-zen-espresso text-zen-paper overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mx-auto max-w-[1200px] px-6 py-22 md:px-10 md:py-30 text-center">
        <SectionHeading eyebrow="Kind words" title="From the table" jp="お客様の声" align="center" className="mx-auto max-w-2xl text-zen-paper" />
        
        {/* Carousel Slide Area with Fade Animation */}
        <div className="relative mt-12 md:mt-16 min-h-[220px] md:min-h-[190px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              className="max-w-3xl mx-auto px-4"
            >
              <p className="font-heading text-2xl md:text-4xl italic leading-relaxed text-zen-paper/95">
                "{t.quote}"
              </p>
              <footer className="mt-8">
                <p className="text-base font-medium text-zen-paper tracking-wide">{t.name}</p>
                <p className="label-eyebrow text-zen-clay mt-1">{t.role}</p>
              </footer>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls: Chevrons & Dots */}
        <div className="mt-12 flex items-center justify-center gap-6">
          <button
            onClick={prev}
            aria-label="Previous review"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zen-paper/20 text-zen-paper/70 hover:border-zen-paper hover:text-zen-paper transition-colors min-h-[44px] min-w-[44px]"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {testimonials.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to review ${idx + 1}`}
                className="h-6 flex items-center justify-center px-1"
              >
                <span
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    current === idx ? "w-6 bg-zen-clay" : "w-2 bg-zen-paper/30 hover:bg-zen-paper/60"
                  )}
                />
              </button>
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next review"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zen-paper/20 text-zen-paper/70 hover:border-zen-paper hover:text-zen-paper transition-colors min-h-[44px] min-w-[44px]"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}

function Values() {
  return (
    <section className="bg-zen-paper">
      <div className="mx-auto max-w-[1400px] px-6 py-22 md:px-10 md:py-30">
        <SectionHeading eyebrow="Our way" title="What we hold" jp="信念" />
        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <ScrollReveal key={v.id} delay={i * 0.08}>
              <div className="border-t border-zen-hairline pt-6">
                <p className="font-jp text-sm tracking-[0.3em] text-zen-muted">{v.jp}</p>
                <h3 className="mt-2 font-heading text-2xl text-zen-charcoal">{v.title}</h3>
                <p className="mt-3 text-sm text-zen-muted">{v.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroLogo />

      {/* Intro story — ma */}
      <section className="bg-zen-paper">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-6 py-22 md:grid-cols-12 md:px-10 md:py-30">
          <div className="md:col-span-5">
            <ScrollReveal>
              <p className="label-eyebrow">Our story</p>
              <h2 className="mt-4 font-heading text-4xl leading-[1.05] text-zen-charcoal md:text-6xl">
                The space between
              </h2>
              <p className="mt-3 font-jp text-sm tracking-[0.3em] text-zen-muted">間 — ma</p>
            </ScrollReveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <ScrollReveal delay={0.1}>
              <div className="space-y-5 text-zen-muted">
                <p>Shizuka began with a simple idea: that a cup of coffee deserves the same quiet attention as a tea ceremony. We roast in small batches behind the counter, brew one cup at a time, and let the room do the rest.</p>
                <p>The Japanese idea of <em>ma</em> — the negative space, the pause, the interval — guides everything. We leave room around the cup, around the conversation, around the morning. Nothing here is in a hurry.</p>
                <Link to="/about" className="inline-block label-eyebrow link-underline text-zen-charcoal pt-2">Read our story →</Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <FeaturedMenu />

      {/* The Experience */}
      <section className="bg-zen-surface">
        <div className="mx-auto max-w-[1400px] px-6 py-22 md:px-10 md:py-30">
          <SectionHeading eyebrow="The experience" title="Three ways to be here" jp="体験" align="center" className="mx-auto max-w-2xl" />
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {experiences.map((e, i) => (
              <ExperienceCard key={e.id} experience={e} index={i} />
            ))}
          </div>
        </div>
      </section>

      <FeaturedBeans />

      {/* Seasonal specials */}
      <section className="bg-zen-paper">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-6 py-22 md:grid-cols-2 md:items-center md:px-10 md:py-30">
          <ScrollReveal>
            <ZenImage label="A sakura latte and a yuzu pastry in soft spring light" alt="Seasonal spring menu" aspect="aspect-[4/5]" className="w-full" />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div>
              <p className="label-eyebrow">Seasonal</p>
              <h2 className="mt-4 font-heading text-4xl text-zen-charcoal md:text-5xl">Spring, in a cup</h2>
              <p className="mt-5 text-zen-muted">For a few weeks each spring we pour the sakura latte — salted cherry blossom, steamed milk, a whisper of white chocolate — beside a yuzu pastry. Quiet, fleeting, here for the season.</p>
              <Link to="/menu" className="mt-8 inline-flex items-center gap-2 label-eyebrow link-underline text-zen-charcoal">
                See the seasonal menu <ArrowRight className="h-4 w-4" strokeWidth={1.25} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Values />
      <GalleryStrip />
      <Testimonials />
      <Newsletter />
    </>
  );
}