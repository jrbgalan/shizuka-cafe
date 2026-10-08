import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, X, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import ZenImage from "@/components/ZenImage";

export default function Cart() {
  const { items, updateQty, removeItem, subtotal, discount, shipping, total, promo, applyPromo, removePromo, clear, closeCart } = useCart();
  const { format } = useCurrency();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    closeCart();
  }, [closeCart]);

  const apply = () => {
    const res = applyPromo(code);
    setMsg(res);
    if (res.ok) setCode("");
  };

  return (
    <section className="bg-zen-paper pt-24 pb-28 lg:pb-0">
      <div className="mx-auto max-w-[1100px] px-6 py-16 md:px-10 md:py-22">
        <h1 className="font-heading text-5xl text-zen-charcoal md:text-6xl">Your cart</h1>
        <p className="mt-3 font-jp text-sm tracking-[0.3em] text-zen-muted">お客様のカート</p>

        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <p className="font-heading text-2xl text-zen-charcoal">Your cart is quiet.</p>
            <p className="mt-3 text-zen-muted">Browse the roastery and add a bag or two.</p>
            <Link to="/shop" className="mt-8 label-eyebrow link-underline text-zen-charcoal">Visit the roastery →</Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Items */}
            <div className="lg:col-span-2">
              <ul className="divide-y divide-zen-hairline border-y border-zen-hairline">
                {items.map((i) => {
                  const key = `${i.id}|${i.grind}|${i.size}`;
                  return (
                    <li key={key} className="flex gap-5 py-6">
                      <ZenImage label={i.imageLabel} alt={i.name} aspect="aspect-square" className="w-24 shrink-0" />
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-4">
                          <div>
                            <h3 className="font-heading text-xl text-zen-charcoal">{i.name}</h3>
                            <p className="mt-1 text-xs text-zen-muted">{i.grind} · {i.size}</p>
                          </div>
                          <button onClick={() => removeItem(key)} aria-label="Remove" className="text-zen-muted hover:text-zen-charcoal"><X className="h-4 w-4" strokeWidth={1.25} /></button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-4">
                          <div className="flex items-center gap-3 border border-zen-hairline px-2 py-1">
                            <button onClick={() => updateQty(key, i.qty - 1)} aria-label="Decrease"><Minus className="h-3 w-3" strokeWidth={1.5} /></button>
                            <span className="w-6 text-center text-sm">{i.qty}</span>
                            <button onClick={() => updateQty(key, i.qty + 1)} aria-label="Increase"><Plus className="h-3 w-3" strokeWidth={1.5} /></button>
                          </div>
                          <span className="font-heading text-lg">{format(i.price * i.qty)}</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 flex justify-between">
                <button onClick={clear} className="label-eyebrow link-underline text-zen-muted">Empty cart</button>
                <Link to="/shop" className="label-eyebrow link-underline text-zen-charcoal">Continue shopping →</Link>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="border border-zen-hairline p-6">
                <h2 className="font-heading text-2xl">Summary</h2>

                {/* Promo */}
                {!promo ? (
                  <div className="mt-5">
                    <label className="label-eyebrow">Promo code</label>
                    <div className="mt-2 flex gap-2">
                      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="WELCOME10" className="flex-1 border border-zen-hairline bg-transparent px-3 py-2 text-sm focus:border-zen-charcoal focus:outline-none" />
                      <button onClick={apply} className="border border-zen-charcoal px-4 text-xs uppercase tracking-[0.2em] hover:bg-zen-charcoal hover:text-zen-paper">Apply</button>
                    </div>
                    {msg && <p className={`mt-2 text-xs ${msg.ok ? "text-zen-sage" : "text-red-700"}`}>{msg.label}</p>}
                  </div>
                ) : (
                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="text-zen-sage">{promo.code} — {promo.label}</span>
                    <button onClick={removePromo} className="text-zen-muted underline">remove</button>
                  </div>
                )}

                <div className="mt-6 space-y-2 border-t border-zen-hairline pt-5 text-sm">
                  <div className="flex justify-between text-zen-muted"><span>Subtotal</span><span className="text-zen-charcoal">{format(subtotal)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-zen-sage"><span>Discount</span><span>−{format(discount)}</span></div>}
                  <div className="flex justify-between text-zen-muted"><span>Shipping</span><span className="text-zen-charcoal">{shipping === 0 ? "Free" : format(shipping)}</span></div>
                  <div className="flex justify-between font-heading text-xl text-zen-charcoal pt-2"><span>Total</span><span>{format(total)}</span></div>
                </div>

                <Link to="/checkout" className="mt-6 flex items-center justify-center gap-2 bg-zen-charcoal py-3.5 text-xs uppercase tracking-[0.25em] text-zen-paper hover:bg-zen-espresso transition-colors">
                  Checkout <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
                <p className="mt-4 text-xs text-zen-muted">Free shipping over {format(1500)}. Mock payment at checkout.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky checkout bar */}
      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zen-hairline bg-zen-paper p-4 lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-zen-muted">Total</p>
              <p className="font-heading text-xl text-zen-charcoal">{format(total)}</p>
            </div>
            <Link to="/checkout" className="flex items-center gap-2 bg-zen-charcoal px-6 py-3.5 text-xs uppercase tracking-[0.25em] text-zen-paper">
              Checkout <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}