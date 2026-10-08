import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Heart, User, MapPin, LogOut, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { getOrders } from "@/lib/orders";
import { products } from "@/data/products";
import ZenImage from "@/components/ZenImage";
import { cn } from "@/lib/utils";

export default function Account() {
  const { user, logout } = useAuth();
  const { wishlist, toggleWishlist } = useCart();
  const { format } = useCurrency();
  const [tab, setTab] = useState("orders");
  const [orders] = useState(() => getOrders());

  const wishedProducts = products.filter((p) => wishlist.includes(p.id));

  const tabs = [
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "profile", label: "Profile", icon: User },
    { id: "addresses", label: "Addresses", icon: MapPin }
  ];

  return (
    <section className="bg-zen-paper pt-24">
      <div className="mx-auto max-w-[1100px] px-6 py-16 md:px-10 md:py-22">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-heading text-4xl text-zen-charcoal md:text-5xl">Your account</h1>
            <p className="mt-3 font-jp text-sm tracking-[0.3em] text-zen-muted">アカウント</p>
          </div>
          <div className="text-sm text-zen-muted">
            <p>Signed in as</p>
            <p className="font-heading text-lg text-zen-charcoal">{user?.email || user?.full_name || "Member"}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex gap-2 overflow-x-auto border-b border-zen-hairline">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition-colors min-h-[44px] whitespace-nowrap",
                  tab === t.id ? "border-zen-charcoal text-zen-charcoal" : "border-transparent text-zen-muted hover:text-zen-charcoal"
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.25} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="mt-10">
          {tab === "orders" && (
            <div>
              {orders.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="font-heading text-2xl text-zen-charcoal">No orders yet</p>
                  <p className="mt-3 text-zen-muted">When you place an order, it will appear here.</p>
                  <Link to="/shop" className="mt-8 inline-block label-eyebrow link-underline text-zen-charcoal">
                    Visit the roastery →
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((o) => (
                    <div key={o.id} className="border border-zen-hairline p-5 md:p-6">
                      <div className="flex flex-wrap justify-between gap-4 border-b border-zen-hairline pb-4">
                        <div>
                          <p className="label-eyebrow">Order</p>
                          <p className="mt-1 font-heading text-lg text-zen-charcoal">{o.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="label-eyebrow">Date</p>
                          <p className="mt-1 text-sm">
                            {new Date(o.date).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="label-eyebrow">Total</p>
                          <p className="mt-1 font-heading text-lg">{format(o.total)}</p>
                        </div>
                        <div className="text-right">
                          <p className="label-eyebrow">Status</p>
                          <p className="mt-1 text-sm capitalize text-zen-sage">{o.status}</p>
                        </div>
                      </div>
                      <ul className="mt-4 flex flex-wrap gap-4">
                        {o.items.map((i) => {
                          const key = `${i.id}|${i.grind}|${i.size}`;
                          return (
                            <li key={key} className="flex items-center gap-3">
                              <ZenImage label={i.imageLabel} alt={i.name} aspect="aspect-square" className="w-12 shrink-0 rounded-lg border border-zen-hairline/70 shadow-2xs" />
                              <div>
                                <p className="text-sm">{i.name}</p>
                                <p className="text-xs text-zen-muted">{i.grind} · {i.size} · ×{i.qty}</p>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "wishlist" && (
            <div>
              {wishedProducts.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="font-heading text-2xl text-zen-charcoal">Your wishlist is quiet</p>
                  <p className="mt-3 text-zen-muted">Save beans you're curious about and find them here.</p>
                  <Link to="/shop" className="mt-8 inline-block label-eyebrow link-underline text-zen-charcoal">
                    Browse the roastery →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {wishedProducts.map((p) => (
                    <div key={p.id}>
                      <Link to={`/shop/${p.slug}`}>
                        <ZenImage label={p.imageLabel} alt={p.name} aspect="aspect-[4/5]" />
                      </Link>
                      <div className="mt-4 flex items-start justify-between gap-3">
                        <div>
                          <p className="label-eyebrow">{p.origin} · {p.roast}</p>
                          <Link to={`/shop/${p.slug}`}>
                            <h3 className="mt-1 font-heading text-lg text-zen-charcoal link-underline w-fit">{p.name}</h3>
                          </Link>
                        </div>
                        <span className="font-heading text-lg">{format(p.price)}</span>
                      </div>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="mt-3 label-eyebrow text-zen-muted hover:text-zen-charcoal link-underline"
                      >
                        Remove from wishlist
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "profile" && (
            <div className="max-w-md">
              <div className="space-y-4">
                <div>
                  <p className="label-eyebrow">Name</p>
                  <p className="mt-1 font-heading text-lg text-zen-charcoal">{user?.full_name || "Not set"}</p>
                </div>
                <div>
                  <p className="label-eyebrow">Email</p>
                  <p className="mt-1 text-sm text-zen-charcoal">{user?.email || "—"}</p>
                </div>
                <div>
                  <p className="label-eyebrow">Role</p>
                  <p className="mt-1 text-sm capitalize text-zen-charcoal">{user?.role || "user"}</p>
                </div>
              </div>
              {user?.role === "admin" && (
                <Link to="/admin" className="mt-8 inline-flex items-center gap-2 label-eyebrow link-underline text-zen-charcoal">
                  Admin dashboard <ArrowRight className="h-4 w-4" strokeWidth={1.25} />
                </Link>
              )}
              <button
                onClick={() => logout()}
                className="mt-8 flex items-center gap-2 border border-zen-charcoal px-6 py-3 text-xs uppercase tracking-[0.25em] text-zen-charcoal hover:bg-zen-charcoal hover:text-zen-paper transition-colors"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.25} /> Sign out
              </button>
            </div>
          )}

          {tab === "addresses" && (
            <div className="max-w-md">
              <p className="text-zen-muted">No saved addresses yet. Your shipping address is collected at checkout.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}