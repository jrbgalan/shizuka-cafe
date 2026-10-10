import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { faqs } from "@/data/content";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FAQ() {
  const [open, setOpen] = useState(faqs[0]?.id || null);

  return (
    <>
      <PageHeader eyebrow="Good to know" title="Frequently asked" jp="よくある質問" />
      <section className="bg-zen-paper">
        <div className="mx-auto max-w-3xl px-6 py-22 md:px-10 md:py-30">
          <div className="divide-y divide-zen-hairline border-y border-zen-hairline">
            {faqs.map((f) => (
              <div key={f.id}>
                <button onClick={() => setOpen(open === f.id ? null : f.id)} className="flex w-full items-center justify-between gap-4 py-6 text-left">
                  <span className="font-heading text-xl text-zen-charcoal">{f.q}</span>
                  <ChevronDown className={cn("h-5 w-5 shrink-0 text-zen-muted transition-transform duration-500", open === f.id && "rotate-180")} strokeWidth={1.25} />
                </button>
                <div className={cn("grid transition-all duration-500 ease-zen", open === f.id ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <p className="text-zen-muted">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}