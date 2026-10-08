import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { getLatestOrder } from "@/lib/orders";
import ZenImage from "@/components/ZenImage";
import ShizukaMap from "@/components/ShizukaMap";

export default function OrderConfirmation() {
  const location = useLocation();
  const { format } = useCurrency();
  const [order, setOrder] = useState(location.state?.order || null);

  useEffect(() => {
    if (!order) {
      const latest = getLatestOrder();
      if (latest) setOrder(latest);
    }
  }, [order]);

  if (!order) {
    return (
      <section className="bg-zen-paper pt-24">
        <div className="mx-auto max-w-[600px] px-6 py-22 text-center">
          <h1 className="font-heading text-4xl text-zen-charcoal">No order found</h1>
          <p className="mt-4 text-zen-muted">We couldn't find a recent order.</p>
          <Link to="/shop" className="mt-8 inline-block label-eyebrow link-underline text-zen-charcoal">
            Visit the roastery →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-zen-paper pt-24">
      <div className="mx-auto max-w-[700px] px-6 py-16 md:py-22">
        {/* Success header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zen-sage/20"
          >
            <Check className="h-8 w-8 text-zen-sage" strokeWidth={1.5} />
          </motion.div>
          <h1 className="mt-6 font-heading text-4xl text-zen-charcoal md:text-5xl">Thank you</h1>
          <p className="mt-3 font-jp text-sm tracking-[0.3em] text-zen-muted">ご注文ありがとうございます</p>
          <p className="mt-5 text-zen-muted">
            Your order is confirmed. A receipt is on its way to {order.customer.email}.
          </p>
        </div>

        {/* Order details */}
        <div className="mt-12 border border-zen-hairline p-6 md:p-8">
          <div className="flex flex-wrap justify-between gap-4 border-b border-zen-hairline pb-5">
            <div>
              <p className="label-eyebrow">Order number</p>
              <p className="mt-1 font-heading text-xl text-zen-charcoal">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="label-eyebrow">Date</p>
              <p className="mt-1 text-sm">
                {new Date(order.date).toLocaleDateString("en-PH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
            </div>
          </div>

          {/* Items */}
          <ul className="mt-5 space-y-4">
            {order.items.map((i) => {
              const key = `${i.id}|${i.grind}|${i.size}`;
              return (
                <li key={key} className="flex gap-4">
                  <ZenImage label={i.imageLabel} alt={i.name} aspect="aspect-square" className="w-16 shrink-0" />
                  <div className="flex flex-1 items-center justify-between gap-4">
                    <div>
                      <p className="font-heading text-sm">{i.name}</p>
                      <p className="text-xs text-zen-muted">{i.grind} · {i.size} · ×{i.qty}</p>
                    </div>
                    <span className="text-sm">{format(i.price * i.qty)}</span>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Totals */}
          <div className="mt-5 space-y-2 border-t border-zen-hairline pt-5 text-sm">
            <div className="flex justify-between text-zen-muted"><span>Subtotal</span><span className="text-zen-charcoal">{format(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-zen-sage"><span>Discount</span><span>−{format(order.discount)}</span></div>}
            <div className="flex justify-between text-zen-muted"><span>Shipping</span><span className="text-zen-charcoal">{order.shipping === 0 ? "Free" : format(order.shipping)}</span></div>
            <div className="flex justify-between font-heading text-xl text-zen-charcoal pt-2"><span>Total</span><span>{format(order.total)}</span></div>
          </div>
        </div>

        {/* Shipping address */}
        <div className="mt-6 border border-zen-hairline p-6 md:p-8">
          <p className="label-eyebrow">Shipping to</p>
          <p className="mt-2 text-sm text-zen-charcoal">
            {order.customer.firstName} {order.customer.lastName}<br />
            {order.shipping.address1}
            {order.shipping.address2 ? `, ${order.shipping.address2}` : ""}<br />
            {order.shipping.city}, {order.shipping.region} {order.shipping.postal}<br />
            {order.shipping.country}
          </p>
        </div>

        {/* Live Delivery Courier Routing Map */}
        <div className="mt-6 border border-zen-hairline p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="label-eyebrow text-zen-charcoal">Live Delivery Routing</p>
              <p className="text-xs text-zen-muted mt-1">Dispatched from Shizuka Roastery (Poblacion) to your delivery pin.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-zen-sage/15 text-zen-sage px-2.5 py-1 text-xs uppercase tracking-wider font-medium rounded-xs">
              <span className="h-2 w-2 rounded-full bg-zen-sage animate-pulse" /> In Transit
            </span>
          </div>
          <div className="aspect-[16/9] w-full overflow-hidden border border-zen-hairline">
            <ShizukaMap
              mode="tracking"
              selectedCoords={order.delivery?.coords || [14.5515, 121.0494]}
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Next steps */}
        <div className="mt-6 border border-zen-hairline p-6 md:p-8">
          <p className="label-eyebrow">What happens next</p>
          <ol className="mt-3 space-y-3 text-sm text-zen-muted">
            <li>1. We roast and pack your beans within 1–2 business days.</li>
            <li>2. You'll receive a tracking link by email once your order ships.</li>
            <li>3. Delivery takes 2–5 business days within the Philippines.</li>
          </ol>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/shop"
            className="flex items-center justify-center gap-2 bg-zen-charcoal px-7 py-3.5 text-xs uppercase tracking-[0.25em] text-zen-paper hover:bg-zen-espresso transition-colors"
          >
            Continue shopping <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <Link
            to="/account"
            className="flex items-center justify-center gap-2 border border-zen-charcoal px-7 py-3.5 text-xs uppercase tracking-[0.25em] text-zen-charcoal hover:bg-zen-charcoal hover:text-zen-paper transition-colors"
          >
            View your orders
          </Link>
        </div>
      </div>
    </section>
  );
}