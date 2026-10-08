import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import { site } from "@/data/site";
import { faqs } from "@/data/content";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import ShizukaMap from "@/components/ShizukaMap";

const inputCls = "w-full border border-zen-hairline bg-transparent px-4 py-3 text-sm focus:border-zen-charcoal focus:outline-none";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = "Your name, please.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "A valid email, please.";
    if (!form.message.trim()) errs.message = "Please write a short message.";
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSent(true);
  };

  return (
    <>
      <PageHeader eyebrow="Say hello" title="Contact" jp="お問い合わせ" imageLabel="A quiet cafe counter with a small bell and a plant" />

      <section className="bg-zen-paper">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-6 py-22 md:grid-cols-2 md:px-10 md:py-30">
          {/* Form */}
          <ScrollReveal>
            <h2 className="font-heading text-4xl text-zen-charcoal">Write to us</h2>
            <p className="mt-3 text-zen-muted">We read everything and reply within two working days.</p>

            {sent ? (
              <div className="mt-10 border border-zen-hairline p-8 text-center">
                <p className="font-heading text-2xl text-zen-charcoal">Thank you.</p>
                <p className="mt-3 text-sm text-zen-muted">Your message is on its way. We'll be in touch soon.</p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="mt-6 label-eyebrow link-underline text-zen-charcoal">Write another →</button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-8 space-y-6" noValidate>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="label-eyebrow">Name</label>
                    <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls + " mt-2"} placeholder="Your name" />
                    {errors.name && <p className="mt-2 text-xs text-red-700">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="label-eyebrow">Email</label>
                    <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls + " mt-2"} placeholder="you@example.com" />
                    {errors.email && <p className="mt-2 text-xs text-red-700">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="label-eyebrow">Subject</label>
                  <input value={form.subject} onChange={(e) => set("subject", e.target.value)} className={inputCls + " mt-2"} placeholder="What's this about?" />
                </div>
                <div>
                  <label className="label-eyebrow">Message</label>
                  <textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={5} className={inputCls + " mt-2"} placeholder="How can we help?" />
                  {errors.message && <p className="mt-2 text-xs text-red-700">{errors.message}</p>}
                </div>
                <button type="submit" className="bg-zen-charcoal px-8 py-3.5 text-xs uppercase tracking-[0.25em] text-zen-paper hover:bg-zen-espresso transition-colors">Send message</button>
              </form>
            )}
          </ScrollReveal>

          {/* Details + FAQ preview */}
          <ScrollReveal delay={0.1}>
            <div className="space-y-10">
              <div>
                <h3 className="font-heading text-2xl text-zen-charcoal">The details</h3>
                <div className="mt-5 space-y-3 text-sm text-zen-muted">
                  <p>{site.address.line1}, {site.address.city}, {site.address.region}</p>
                  <p><a href={`tel:${site.phone}`} className="link-underline text-zen-charcoal">{site.phoneDisplay}</a></p>
                  <p><a href={`mailto:${site.email}`} className="link-underline text-zen-charcoal">{site.email}</a></p>
                </div>
                <div className="mt-5 flex gap-5">
                  {site.socials.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="label-eyebrow text-zen-muted hover:text-zen-charcoal link-underline">{s.label}</a>
                  ))}
                </div>

                {/* Interactive Roastery Location Map */}
                <div className="mt-8 w-full rounded-2xl border border-zen-hairline/80 bg-zen-surface/60 p-1 shadow-2xs">
                  <div className="overflow-hidden rounded-xl">
                    <ShizukaMap mode="shop" className="h-[280px] w-full" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-heading text-2xl text-zen-charcoal">Quick answers</h3>
                <div className="mt-5 divide-y divide-zen-hairline border-y border-zen-hairline">
                  {faqs.slice(0, 4).map((f) => (
                    <div key={f.id}>
                      <button onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)} className="flex w-full items-center justify-between py-4 text-left">
                        <span className="text-sm text-zen-charcoal">{f.q}</span>
                        <ChevronDown className={cn("h-4 w-4 text-zen-muted transition-transform", openFaq === f.id && "rotate-180")} strokeWidth={1.25} />
                      </button>
                      {openFaq === f.id && <p className="pb-4 text-sm text-zen-muted">{f.a}</p>}
                    </div>
                  ))}
                </div>
                <Link to="/faq" className="mt-5 inline-block label-eyebrow link-underline text-zen-charcoal">All FAQs →</Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}