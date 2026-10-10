import React from "react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import ZoomImage from "@/components/ZoomImage";
import { site } from "@/data/site";
import { gallery } from "@/data/content";
import { MapPin, Clock, Car, Accessibility } from "lucide-react";
import ShizukaMap from "@/components/ShizukaMap";
import CafeLiveTime from "@/components/CafeLiveTime";

export default function Visit() {
  return (
    <>
      <PageHeader eyebrow="Come in" title="Visit us" jp="店舗情報" />

      {/* Interior gallery */}
      <section className="bg-zen-paper">
        <div className="mx-auto max-w-[1400px] px-6 py-22 md:px-10 md:py-30">
          <SectionHeading eyebrow="The room" title="Inside Shizuka" jp="店内" />
          <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.slice(0, 8).map((g, i) => (
              <ScrollReveal key={g.id} delay={(i % 4) * 0.06}>
                <ZoomImage label={g.label} alt={g.caption} aspect="aspect-[3/4]" zoom={1.1} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hours + location + seating */}
      <section id="hours-location" className="bg-zen-surface">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-6 py-22 md:grid-cols-3 md:px-10 md:py-30">
          <ScrollReveal>
            <Clock className="h-6 w-6 text-zen-clay" strokeWidth={1.25} />
            <h3 className="mt-5 font-heading text-2xl text-zen-charcoal">Opening hours</h3>
            
            {/* Real-time Live Roastery Clock & Status */}
            <div className="mt-5 mb-6">
              <CafeLiveTime variant="card" />
            </div>

            <div className="space-y-2">
              {site.hours.map((h) => (
                <div key={h.day} className="flex justify-between gap-4 text-sm">
                  <span className="text-zen-muted">{h.day}</span>
                  <span className="text-zen-charcoal">{h.time}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-zen-muted">Last orders thirty minutes before close.</p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <MapPin className="h-6 w-6 text-zen-clay" strokeWidth={1.25} />
            <h3 className="mt-5 font-heading text-2xl text-zen-charcoal">Find us</h3>
            <p className="mt-5 text-zen-muted">{site.address.line1}<br />{site.address.city}, {site.address.region}<br />{site.address.country} {site.address.postcode}</p>
            {/* Interactive Shop Location Map */}
            <div className="mt-6 w-full rounded-2xl border border-zen-hairline/80 bg-zen-surface/60 p-1 shadow-2xs">
              <div className="overflow-hidden rounded-xl">
                <ShizukaMap mode="shop" className="h-[320px] w-full" />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="space-y-10">
              <div>
                <h3 className="font-heading text-2xl text-zen-charcoal">Seating</h3>
                <p className="mt-3 text-sm text-zen-muted">22 seats — a long communal table, window counter, and a quiet corner for two. The omakase bar seats five.</p>
              </div>
              <div>
                <Car className="h-6 w-6 text-zen-clay" strokeWidth={1.25} />
                <h3 className="mt-5 font-heading text-2xl text-zen-charcoal">Parking & directions</h3>
                <p className="mt-3 text-sm text-zen-muted">Street parking along Lantern Lane. The nearest carpark is a 3-minute walk at Poblacion Multi-Purpose. We are a 5-minute walk from Ayala MRT.</p>
              </div>
              <div>
                <Accessibility className="h-6 w-6 text-zen-clay" strokeWidth={1.25} />
                <h3 className="mt-5 font-heading text-2xl text-zen-charcoal">Accessibility</h3>
                <p className="mt-3 text-sm text-zen-muted">Step-free entry, an accessible washroom, and low-glare lighting. Large-print menus available — just ask.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}