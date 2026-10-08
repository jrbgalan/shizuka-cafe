import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import ZenImage from "@/components/ZenImage";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, subtotal, discount, total, promo, applyPromo, removePromo } = useCart();
  const { format } = useCurrency();
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState(null);

  // Automatically close cart drawer on any route change (e.g. clicking /cart or /checkout)
  useEffect(() => {
    if (isOpen) {
      closeCart();
    }
  }, [location.pathname, location.search]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  const handleApply = () => {
    const res = applyPromo(code);
    setMsg(res);
    if (res.ok) setCode("");
  };

  const goTo = (path) => {
    closeCart();
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-zen-espresso/40 backdrop-blur-xs cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              closeCart();
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              closeCart();
            }}
            aria-label="Close cart overlay"
          />
          <motion.aside
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col bg-zen-paper paper-grain"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex items-center justify-between border-b border-zen-hairline px-6 py-5">
              <h2 className="font-heading text-2xl">Your cup</h2>
              <button onClick={closeCart} aria-label="Close cart" className="text-zen-charcoal hover:opacity-60 min-h-[36px] min-w-[36px] flex items-center justify-center">
                <X className="h-5 w-5" strokeWidth={1.25} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-heading text-2xl text-zen-charcoal">Nothing here yet.</p>
                  <p className="mt-3 text-sm text-zen-muted">The shelf is quiet. Browse the roastery.</p>
                  <button type="button" onClick={() => goTo("/shop")} className="mt-8 label-eyebrow link-underline text-zen-charcoal">
                    Visit the roastery →
                  </button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((i) => {
                    const key = `${i.id}|${i.grind}|${i.size}`;
                    return (
                      <li key={key} className="flex gap-4">
                        <ZenImage label={i.imageLabel} alt={i.name} aspect="aspect-square" className="w-20 shrink-0 rounded-xl border border-zen-hairline/70 shadow-2xs" />
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-3">
                            <div>
                              <p className="font-heading text-lg leading-tight">{i.name}</p>
                              <p className="mt-0.5 text-xs text-zen-muted">{i.grind} · {i.size}</p>
                            </div>
                            <button onClick={() => removeItem(key)} aria-label="Remove" className="text-zen-muted hover:text-zen-charcoal">
                              <X className="h-4 w-4" strokeWidth={1.25} />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center gap-3 border border-zen-hairline px-2 py-1">
                              <button onClick={() => updateQty(key, i.qty - 1)} aria-label="Decrease" className="text-zen-charcoal"><Minus className="h-3 w-3" strokeWidth={1.5} /></button>
                              <span className="w-5 text-center text-sm">{i.qty}</span>
                              <button onClick={() => updateQty(key, i.qty + 1)} aria-label="Increase" className="text-zen-charcoal"><Plus className="h-3 w-3" strokeWidth={1.5} /></button>
                            </div>
                            <span className="text-sm">{format(i.price * i.qty)}</span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-zen-hairline px-6 py-5">
                {/* Promo */}
                {!promo ? (
                  <div className="mb-5">
                    <label className="label-eyebrow">Promo code</label>
                    <div className="mt-2 flex gap-2">
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="WELCOME10"
                        className="flex-1 border border-zen-hairline bg-transparent px-3 py-2 text-sm focus:border-zen-charcoal focus:outline-none"
                      />
                      <button onClick={handleApply} className="border border-zen-charcoal px-4 text-xs uppercase tracking-[0.2em] text-zen-charcoal hover:bg-zen-charcoal hover:text-zen-paper transition-colors">
                        Apply
                      </button>
                    </div>
                    {msg && <p className={`mt-2 text-xs ${msg.ok ? "text-zen-sage" : "text-red-700"}`}>{msg.label}</p>}
                  </div>
                ) : (
                  <div className="mb-5 flex items-center justify-between text-sm">
                    <span className="text-zen-sage">Code {promo.code} — {promo.label}</span>
                    <button onClick={removePromo} className="text-zen-muted underline">remove</button>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-zen-muted"><span>Subtotal</span><span className="text-zen-charcoal">{format(subtotal)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-zen-sage"><span>Discount</span><span>−{format(discount)}</span></div>}
                  <div className="flex justify-between font-heading text-lg text-zen-charcoal"><span>Total</span><span>{format(total)}</span></div>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => goTo("/checkout")}
                    className="flex items-center justify-center gap-2 bg-zen-charcoal py-3.5 text-xs uppercase tracking-[0.25em] text-zen-paper hover:bg-zen-espresso transition-colors w-full min-h-[44px]"
                  >
                    Checkout <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo("/cart")}
                    className="text-center label-eyebrow link-underline text-zen-muted py-2 w-full min-h-[44px] flex items-center justify-center"
                  >
                    View full cart
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}