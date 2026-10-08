import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/lib/AuthContext";
import { addOrder } from "@/lib/orders";
import ZenImage from "@/components/ZenImage";
import ShizukaMap from "@/components/ShizukaMap";

export default function Checkout() {
  const { items, subtotal, discount, shipping, total, promo, clear, closeCart } = useCart();
  const { format } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    closeCart();
  }, [closeCart]);

  const [deliveryCoords, setDeliveryCoords] = useState([14.5515, 121.0494]); // Default to BGC
  const [deliveryMeta, setDeliveryMeta] = useState({ distanceKm: 4.2, estimatedMins: 32 });

  const [form, setForm] = useState({
    email: user?.email || "",
    firstName: user?.full_name?.split(" ")[0] || "",
    lastName: user?.full_name?.split(" ").slice(1).join(" ") || "",
    phone: "",
    address1: "",
    address2: "",
    city: "Taguig City",
    region: "Metro Manila",
    postal: "1634",
    country: "Philippines",
    payment: "card",
    notes: ""
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleDeliveryMapSelect = (data) => {
    if (data.coords) setDeliveryCoords(data.coords);
    if (data.distanceKm !== undefined) {
      setDeliveryMeta({ distanceKm: data.distanceKm, estimatedMins: data.estimatedMins });
    }
    if (data.city) {
      setForm((prev) => ({
        ...prev,
        city: data.city,
        region: "Metro Manila",
        address1: prev.address1 || data.address || ""
      }));
    }
  };

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.firstName) e.firstName = "Required";
    if (!form.lastName) e.lastName = "Required";
    if (!form.phone) e.phone = "Required";
    if (!form.address1) e.address1 = "Required";
    if (!form.city) e.city = "Required";
    if (!form.region) e.region = "Required";
    if (!form.postal) e.postal = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!validate() || items.length === 0) return;

    setSubmitting(true);
    // Simulate payment processing
    setTimeout(() => {
      const order = {
        id: `SHZ-${Date.now().toString(36).toUpperCase()}`,
        date: new Date().toISOString(),
        items: [...items],
        subtotal,
        discount,
        shipping,
        total,
        promo: promo?.code || null,
        customer: {
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone
        },
        shipping: {
          address1: form.address1,
          address2: form.address2,
          city: form.city,
          region: form.region,
          postal: form.postal,
          country: form.country
        },
        delivery: {
          coords: deliveryCoords,
          distanceKm: deliveryMeta.distanceKm,
          estimatedMins: deliveryMeta.estimatedMins
        },
        payment: form.payment,
        notes: form.notes,
        status: "confirmed"
      };
      addOrder(order);
      clear();
      navigate("/order-confirmation", { state: { order } });
    }, 1200);
  };

  if (items.length === 0) {
    return (
      <section className="bg-zen-paper pt-24">
        <div className="mx-auto max-w-[600px] px-6 py-22 text-center">
          <h1 className="font-heading text-4xl text-zen-charcoal">Your cart is empty</h1>
          <p className="mt-4 text-zen-muted">Add a bag or two before checking out.</p>
          <Link to="/shop" className="mt-8 inline-block label-eyebrow link-underline text-zen-charcoal">
            Visit the roastery →
          </Link>
        </div>
      </section>
    );
  }

  const inputClass =
    "w-full border border-zen-hairline bg-zen-paper px-4 py-3 text-sm focus:border-zen-charcoal focus:outline-none min-h-[44px]";
  const labelClass = "label-eyebrow mb-2 block";

  return (
    <section className="bg-zen-paper pt-24 pb-28 lg:pb-22">
      <div className="mx-auto max-w-[1100px] px-6 md:px-10">
        <h1 className="font-heading text-4xl text-zen-charcoal md:text-5xl">Checkout</h1>
        <p className="mt-3 font-jp text-sm tracking-[0.3em] text-zen-muted">お会計</p>

        <form id="checkout-form" onSubmit={handleSubmit} className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3" noValidate>
          {/* Form fields */}
          <div className="space-y-10 lg:col-span-2">
            {/* Contact */}
            <fieldset>
              <legend className="font-heading text-2xl text-zen-charcoal">Contact</legend>
              <div className="mt-5">
                <label htmlFor="email" className={labelClass}>Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputClass}
                />
                {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email}</p>}
              </div>
            </fieldset>

            {/* Shipping address */}
            <fieldset>
              <legend className="font-heading text-2xl text-zen-charcoal">Shipping address</legend>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className={labelClass}>First name</label>
                  <input id="firstName" type="text" value={form.firstName} onChange={set("firstName")} autoComplete="given-name" className={inputClass} />
                  {errors.firstName && <p className="mt-1 text-xs text-red-700">{errors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className={labelClass}>Last name</label>
                  <input id="lastName" type="text" value={form.lastName} onChange={set("lastName")} autoComplete="family-name" className={inputClass} />
                  {errors.lastName && <p className="mt-1 text-xs text-red-700">{errors.lastName}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="phone" className={labelClass}>Phone</label>
                  <input id="phone" type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" placeholder="+63 9XX XXX XXXX" className={inputClass} />
                  {errors.phone && <p className="mt-1 text-xs text-red-700">{errors.phone}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address1" className={labelClass}>Address</label>
                  <input id="address1" type="text" value={form.address1} onChange={set("address1")} autoComplete="address-line1" className={inputClass} />
                  {errors.address1 && <p className="mt-1 text-xs text-red-700">{errors.address1}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address2" className={labelClass}>Apartment, suite, etc. (optional)</label>
                  <input id="address2" type="text" value={form.address2} onChange={set("address2")} autoComplete="address-line2" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="city" className={labelClass}>City</label>
                  <input id="city" type="text" value={form.city} onChange={set("city")} autoComplete="address-level2" className={inputClass} />
                  {errors.city && <p className="mt-1 text-xs text-red-700">{errors.city}</p>}
                </div>
                <div>
                  <label htmlFor="region" className={labelClass}>Region / Province</label>
                  <input id="region" type="text" value={form.region} onChange={set("region")} autoComplete="address-level1" className={inputClass} />
                  {errors.region && <p className="mt-1 text-xs text-red-700">{errors.region}</p>}
                </div>
                <div>
                  <label htmlFor="postal" className={labelClass}>Postal code</label>
                  <input id="postal" type="text" value={form.postal} onChange={set("postal")} autoComplete="postal-code" className={inputClass} />
                  {errors.postal && <p className="mt-1 text-xs text-red-700">{errors.postal}</p>}
                </div>
                <div>
                  <label htmlFor="country" className={labelClass}>Country</label>
                  <select id="country" value={form.country} onChange={set("country")} autoComplete="country-name" className={inputClass}>
                    <option>Philippines</option>
                    <option>Japan</option>
                    <option>United States</option>
                    <option>South Korea</option>
                    <option>Australia</option>
                  </select>
                </div>

                {/* Interactive Delivery Location Map */}
                <div className="sm:col-span-2 mt-4 pt-6 border-t border-zen-hairline">
                  <div className="mb-3">
                    <p className="label-eyebrow text-zen-charcoal">Delivery location & courier route</p>
                    <p className="text-xs text-zen-muted mt-0.5">Select a delivery hub or tap/drag on the map to set your drop-off coordinates.</p>
                  </div>
                  <ShizukaMap
                    mode="delivery"
                    selectedCoords={deliveryCoords}
                    onLocationSelect={handleDeliveryMapSelect}
                    className="h-[280px] w-full"
                  />
                </div>
              </div>
            </fieldset>

            {/* Payment */}
            <fieldset>
              <legend className="font-heading text-2xl text-zen-charcoal">Payment</legend>
              <p className="mt-2 text-xs text-zen-muted">Mock payment — no real charge. This is a portfolio project.</p>
              <div className="mt-5 space-y-3">
                {[
                  { value: "card", label: "Credit / Debit Card", note: "Visa, Mastercard, JCB, Amex" },
                  { value: "gcash", label: "GCash", note: "Mobile wallet payment" },
                  { value: "cod", label: "Cash on Delivery", note: "Pay when your order arrives" }
                ].map((p) => (
                  <label
                    key={p.value}
                    className={`flex cursor-pointer items-center gap-3 border p-4 transition-colors ${
                      form.payment === p.value ? "border-zen-charcoal bg-zen-surface" : "border-zen-hairline"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={p.value}
                      checked={form.payment === p.value}
                      onChange={set("payment")}
                      className="h-4 w-4 accent-zen-charcoal"
                    />
                    <div>
                      <span className="text-sm text-zen-charcoal">{p.label}</span>
                      <span className="block text-xs text-zen-muted">{p.note}</span>
                    </div>
                  </label>
                ))}
              </div>
              {form.payment === "card" && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="cardNumber" className={labelClass}>Card number</label>
                    <input id="cardNumber" type="text" placeholder="0000 0000 0000 0000" className={inputClass} inputMode="numeric" />
                  </div>
                  <div>
                    <label htmlFor="cardExpiry" className={labelClass}>Expiry</label>
                    <input id="cardExpiry" type="text" placeholder="MM / YY" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="cardCvc" className={labelClass}>CVC</label>
                    <input id="cardCvc" type="text" placeholder="123" className={inputClass} inputMode="numeric" />
                  </div>
                </div>
              )}
            </fieldset>

            {/* Notes */}
            <fieldset>
              <legend className="font-heading text-2xl text-zen-charcoal">Order notes (optional)</legend>
              <textarea
                id="notes"
                value={form.notes}
                onChange={set("notes")}
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="Anything we should know?"
              />
            </fieldset>
          </div>

          {/* Summary — desktop sidebar */}
          <div className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-24 border border-zen-hairline p-6">
              <h2 className="font-heading text-2xl">Order summary</h2>
              <ul className="mt-5 space-y-4">
                {items.map((i) => {
                  const key = `${i.id}|${i.grind}|${i.size}`;
                  return (
                    <li key={key} className="flex gap-3">
                      <ZenImage label={i.imageLabel} alt={i.name} aspect="aspect-square" className="w-16 shrink-0 rounded-xl border border-zen-hairline/70 shadow-2xs" />
                      <div className="flex-1">
                        <p className="font-heading text-sm leading-tight">{i.name}</p>
                        <p className="text-xs text-zen-muted">{i.grind} · {i.size} · ×{i.qty}</p>
                        <p className="mt-1 text-sm">{format(i.price * i.qty)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-5 space-y-2 border-t border-zen-hairline pt-5 text-sm">
                <div className="flex justify-between text-zen-muted"><span>Subtotal</span><span className="text-zen-charcoal">{format(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-zen-sage"><span>Discount</span><span>−{format(discount)}</span></div>}
                <div className="flex justify-between text-zen-muted"><span>Shipping</span><span className="text-zen-charcoal">{shipping === 0 ? "Free" : format(shipping)}</span></div>
                <div className="flex justify-between font-heading text-xl text-zen-charcoal pt-2"><span>Total</span><span>{format(total)}</span></div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center gap-2 bg-zen-charcoal py-3.5 text-xs uppercase tracking-[0.25em] text-zen-paper hover:bg-zen-espresso transition-colors disabled:opacity-50"
              >
                {submitting ? "Processing..." : <>Place order <ArrowRight className="h-4 w-4" strokeWidth={1.5} /></>}
              </button>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-zen-muted">
                <Lock className="h-3 w-3" /> Secure checkout
              </p>
            </div>
          </div>
        </form>

        {/* Mobile sticky bar */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zen-hairline bg-zen-paper p-4 lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-zen-muted">Total</p>
              <p className="font-heading text-xl text-zen-charcoal">{format(total)}</p>
            </div>
            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className="flex items-center gap-2 bg-zen-charcoal px-6 py-3.5 text-xs uppercase tracking-[0.25em] text-zen-paper disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Place order"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}