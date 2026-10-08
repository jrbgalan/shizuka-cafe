import React from "react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import ZenImage from "@/components/ZenImage";
import Newsletter from "@/components/Newsletter";
import { values, timeline } from "@/data/content";

export default function About() {
  return (
    <>
      <PageHeader eyebrow="Our story" title="A quiet practice" jp="私たちの物語" imageLabel="A calm empty cafe interior in morning light" />

      {/* Philosophy */}
      <section className="bg-zen-paper">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-6 py-22 md:grid-cols-12 md:px-10 md:py-30">
          <div className="md:col-span-5">
            <ScrollReveal>
              <p className="label-eyebrow">Philosophy</p>
              <h2 className="mt-4 font-heading text-4xl leading-[1.05] text-zen-charcoal md:text-6xl">Slow, on purpose</h2>
              <p className="mt-3 font-jp text-sm tracking-[0.3em] text-zen-muted">ゆっくり</p>
            </ScrollReveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <ScrollReveal delay={0.1}>
              <div className="space-y-5 text-zen-muted">
                <p>We are not a fast cafe. We never set out to be. Each cup is brewed to order, each bag roasted in a small batch, each guest given the time to settle in.</p>
                <p>We believe coffee is better when nothing is rushed — the harvest, the roast, the pour, the conversation that follows. The wait is not a cost. It is the product.</p>
                <p>From the cherry on the branch to the cup in your hand, we try to leave room at every step. For the farmer. For the bean. For you.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-zen-surface">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-6 py-22 md:grid-cols-2 md:items-center md:px-10 md:py-30">
          <ScrollReveal>
            <div className="rounded-2xl border border-zen-hairline/80 bg-zen-surface/60 p-1.5 shadow-2xs">
              <div className="overflow-hidden rounded-xl">
                <ZenImage label="A tranquil bonsai tree in warm morning window light" alt="Zen bonsai plant and tea craft" aspect="aspect-[4/5]" className="w-full" />
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div>
              <p className="label-eyebrow">The founder</p>
              <h2 className="mt-4 font-heading text-4xl text-zen-charcoal md:text-5xl">Hana Mori</h2>
              <p className="mt-3 font-jp text-sm tracking-[0.3em] text-zen-muted">森 華</p>
              <div className="mt-6 space-y-5 text-zen-muted">
                <p>Hana trained as a tea ceremony instructor in Kyoto before falling for specialty coffee on a trip to Melbourne. Shizuka is the marriage of those two educations — the precision of the ceremony, the generosity of the cafe.</p>
                <p>"I wanted a room where you could hear the kettle," she says. "Where the loudest thing is the pour. Everything else can wait."</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-zen-paper">
        <div className="mx-auto max-w-[1400px] px-6 py-22 md:px-10 md:py-30">
          <SectionHeading eyebrow="The years" title="How we got here" jp="歩み" />
          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-4">
            {timeline.map((t, i) => (
              <ScrollReveal key={t.year} delay={i * 0.08}>
                <div className="border-t border-zen-hairline pt-6">
                  <p className="font-heading text-3xl text-zen-clay">{t.year}</p>
                  <h3 className="mt-3 font-heading text-xl text-zen-charcoal">{t.title}</h3>
                  <p className="mt-2 text-sm text-zen-muted">{t.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-zen-surface">
        <div className="mx-auto max-w-[1400px] px-6 py-22 md:px-10 md:py-30">
          <SectionHeading eyebrow="What we hold" title="Four small commitments" jp="信念" />
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

      <Newsletter />
    </>
  );
}