import React from "react";
import { legalContent } from "@/data/legal";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";

// Renders a legal/policy page from the legalContent data.
// Accepts `slug` as a prop (set in the route element) or reads it from URL params.
export default function LegalPage({ slug }) {
  const content = legalContent[slug];

  if (!content) {
    return (
      <section className="bg-zen-paper pt-24">
        <div className="mx-auto max-w-[600px] px-6 py-22 text-center">
          <h1 className="font-heading text-4xl text-zen-charcoal">Policy not found</h1>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={content.title}
        jp="規約"
      />
      <section className="bg-zen-paper">
        <div className="mx-auto max-w-[800px] px-6 py-16 md:px-10 md:py-22">
          <p className="text-sm text-zen-muted">Last updated: {content.lastUpdated}</p>
          <p className="mt-6 font-heading text-2xl leading-relaxed text-zen-charcoal">
            {content.intro}
          </p>

          <div className="mt-12 space-y-10">
            {content.sections.map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.04}>
                <div>
                  <h2 className="font-heading text-xl text-zen-charcoal">{s.heading}</h2>
                  <div className="mt-3 space-y-3">
                    {s.body.map((p, j) => (
                      <p key={j} className="text-sm leading-relaxed text-zen-muted">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}