import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const times = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00"];
const sizes = [1, 2, 3, 4, 5, "6+"];

function Field({ label, children, error }) {
  return (
    <div>
      <label className="label-eyebrow">{label}</label>
      <div className="mt-3">{children}</div>
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}

const inputCls = "w-full border border-zen-hairline bg-transparent px-4 py-3 text-sm focus:border-zen-charcoal focus:outline-none";

export default function Reservations() {
  const [form, setForm] = useState({ date: "", time: "", size: 2, name: "", email: "", phone: "", notes: "" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.date) errs.date = "Please choose a date.";
    if (!form.time) errs.time = "Please choose a time.";
    if (!form.name.trim()) errs.name = "Your name, please.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "A valid email, please.";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setDone({ ...form, ref: `SZK-${Date.now().toString().slice(-6)}` });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (done) {
    return (
      <section className="bg-zen-paper pt-24">
        <div className="mx-auto max-w-2xl px-6 py-22 text-center md:py-30">
          <ScrollReveal>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-zen-clay text-zen-sage">
              <Check className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <p className="mt-8 label-eyebrow">Reserved</p>
            <h1 className="mt-4 font-heading text-5xl text-zen-charcoal">We'll see you then</h1>
            <p className="mt-3 font-jp text-sm tracking-[0.3em] text-zen-muted">ご予約ありがとうございます</p>
            <div className="mt-10 border border-zen-hairline p-8 text-left">
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <span className="text-zen-muted">Name</span><span className="text-zen-charcoal">{done.name}</span>
                <span className="text-zen-muted">Date</span><span className="text-zen-charcoal">{done.date}</span>
                <span className="text-zen-muted">Time</span><span className="text-zen-charcoal">{done.time}</span>
                <span className="text-zen-muted">Party</span><span className="text-zen-charcoal">{done.size} {done.size === 1 ? "guest" : "guests"}</span>
                <span className="text-zen-muted">Reference</span><span className="text-zen-charcoal">{done.ref}</span>
              </div>
              {done.notes && <p className="mt-5 border-t border-zen-hairline pt-4 text-sm text-zen-muted"><span className="label-eyebrow mr-2">Notes</span>{done.notes}</p>}
            </div>
            <p className="mt-8 text-sm text-zen-muted">A confirmation has been sent to {done.email}.</p>
            <button onClick={() => { setDone(null); setForm({ date: "", time: "", size: 2, name: "", email: "", phone: "", notes: "" }); }} className="mt-8 label-eyebrow link-underline text-zen-charcoal">Make another reservation →</button>
          </ScrollReveal>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Reservations" title="Reserve a seat" jp="ご予約" imageLabel="A quiet cafe table set for two in soft light" />
      <section className="bg-zen-paper">
        <div className="mx-auto max-w-2xl px-6 py-22 md:py-30">
          <ScrollReveal>
            <p className="text-zen-muted">Walk-ins are always welcome. The omakase bar and weekend brunch fill quickly — reserve to be sure of a seat.</p>
            <form onSubmit={submit} className="mt-10 space-y-8" noValidate>
              <Field label="Date" error={errors.date}>
                <input type="date" value={form.date} min={new Date().toISOString().split("T")[0]} onChange={(e) => set("date", e.target.value)} className={inputCls} />
              </Field>

              <Field label="Time" error={errors.time}>
                <div className="flex flex-wrap gap-2">
                  {times.map((t) => (
                    <button type="button" key={t} onClick={() => set("time", t)} className={cn("border px-4 py-2 text-sm transition-colors", form.time === t ? "border-zen-charcoal bg-zen-charcoal text-zen-paper" : "border-zen-hairline text-zen-muted hover:border-zen-charcoal")}>{t}</button>
                  ))}
                </div>
              </Field>

              <Field label="Party size">
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button type="button" key={s} onClick={() => set("size", s)} className={cn("border px-4 py-2 text-sm transition-colors", form.size === s ? "border-zen-charcoal bg-zen-charcoal text-zen-paper" : "border-zen-hairline text-zen-muted hover:border-zen-charcoal")}>{s}</button>
                  ))}
                </div>
              </Field>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <Field label="Name" error={errors.name}>
                  <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="Your name" />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} placeholder="you@example.com" />
                </Field>
              </div>

              <Field label="Phone (optional)">
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} placeholder="+63 ..." />
              </Field>

              <Field label="Special requests (optional)">
                <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={4} className={inputCls} placeholder="Omakase bar, anniversary, allergies…" />
              </Field>

              <button type="submit" className="w-full bg-zen-charcoal py-4 text-xs uppercase tracking-[0.25em] text-zen-paper hover:bg-zen-espresso transition-colors">
                Confirm reservation
              </button>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}