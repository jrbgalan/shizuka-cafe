import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, Calendar, Users, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import { getOrders } from "@/lib/orders";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";

export default function Admin() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [tab, setTab] = useState("dashboard");
  const [orders] = useState(() => getOrders());

  const reservations = useMemo(
    () => [
      { id: "r1", name: "Aiko Tanaka", date: "2026-10-10", time: "10:00", party: 2, status: "confirmed" },
      { id: "r2", name: "Marco Diaz", date: "2026-10-12", time: "14:30", party: 4, status: "pending" },
      { id: "r3", name: "Soo-min Kim", date: "2026-10-15", time: "11:00", party: 3, status: "confirmed" }
    ],
    []
  );

  const users = useMemo(
    () => [
      { id: "u1", name: "John Romeo Galan", email: "hello@shizukacafe.com", role: "admin" },
      { id: "u2", name: "Aiko Tanaka", email: "aiko@example.com", role: "user" },
      { id: "u3", name: "Marco Diaz", email: "marco@example.com", role: "user" }
    ],
    []
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "reservations", label: "Reservations", icon: Calendar },
    { id: "users", label: "Users", icon: Users }
  ];

  const stats = [
    { label: "Revenue", value: format(totalRevenue), icon: TrendingUp },
    { label: "Orders", value: orders.length, icon: ShoppingCart },
    { label: "Products", value: products.length, icon: Package },
    { label: "Reservations", value: reservations.length, icon: Calendar }
  ];

  if (user?.role !== "admin") {
    return (
      <section className="bg-zen-paper pt-24">
        <div className="mx-auto max-w-[600px] px-6 py-22 text-center">
          <h1 className="font-heading text-4xl text-zen-charcoal">Access denied</h1>
          <p className="mt-4 text-zen-muted">You need admin access to view this page.</p>
          <Link to="/" className="mt-8 inline-block label-eyebrow link-underline text-zen-charcoal">
            ← Back home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-zen-paper pt-24">
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-22">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-heading text-4xl text-zen-charcoal md:text-5xl">Admin</h1>
            <p className="mt-3 font-jp text-sm tracking-[0.3em] text-zen-muted">管理画面</p>
          </div>
          <div className="text-sm text-zen-muted">
            <p>Signed in as</p>
            <p className="font-heading text-lg text-zen-charcoal">{user?.email || "Admin"}</p>
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

        {/* Content */}
        <div className="mt-10">
          {tab === "dashboard" && (
            <div>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {stats.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="border border-zen-hairline p-5">
                      <Icon className="h-5 w-5 text-zen-muted" strokeWidth={1.25} />
                      <p className="mt-3 label-eyebrow">{s.label}</p>
                      <p className="mt-1 font-heading text-2xl text-zen-charcoal">{s.value}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="border border-zen-hairline p-5">
                  <h2 className="font-heading text-xl">Recent orders</h2>
                  {orders.length === 0 ? (
                    <p className="mt-4 text-sm text-zen-muted">No orders yet.</p>
                  ) : (
                    <ul className="mt-4 space-y-3">
                      {orders.slice(0, 5).map((o) => (
                        <li key={o.id} className="flex justify-between text-sm">
                          <span className="text-zen-charcoal">{o.id}</span>
                          <span className="text-zen-muted">{format(o.total)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="border border-zen-hairline p-5">
                  <h2 className="font-heading text-xl">Upcoming reservations</h2>
                  <ul className="mt-4 space-y-3">
                    {reservations.slice(0, 5).map((r) => (
                      <li key={r.id} className="flex justify-between text-sm">
                        <span className="text-zen-charcoal">{r.name} · {r.date}</span>
                        <span className="text-zen-muted">{r.party} guests</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === "products" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zen-hairline text-left">
                    <th className="pb-3 pr-4 font-body font-normal text-zen-muted">Name</th>
                    <th className="pb-3 pr-4 font-body font-normal text-zen-muted">Origin</th>
                    <th className="pb-3 pr-4 font-body font-normal text-zen-muted">Roast</th>
                    <th className="pb-3 pr-4 font-body font-normal text-zen-muted">Price</th>
                    <th className="pb-3 pr-4 font-body font-normal text-zen-muted">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-zen-hairline/50">
                      <td className="py-3 pr-4 text-zen-charcoal">{p.name}</td>
                      <td className="py-3 pr-4 text-zen-muted">{p.origin}</td>
                      <td className="py-3 pr-4 text-zen-muted">{p.roast}</td>
                      <td className="py-3 pr-4 text-zen-charcoal">{format(p.price)}</td>
                      <td className="py-3 pr-4 text-zen-muted">{p.rating} ({p.reviewsCount})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "orders" && (
            <div>
              {orders.length === 0 ? (
                <p className="text-zen-muted">No orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zen-hairline text-left">
                        <th className="pb-3 pr-4 font-body font-normal text-zen-muted">Order</th>
                        <th className="pb-3 pr-4 font-body font-normal text-zen-muted">Date</th>
                        <th className="pb-3 pr-4 font-body font-normal text-zen-muted">Customer</th>
                        <th className="pb-3 pr-4 font-body font-normal text-zen-muted">Items</th>
                        <th className="pb-3 pr-4 font-body font-normal text-zen-muted">Total</th>
                        <th className="pb-3 pr-4 font-body font-normal text-zen-muted">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id} className="border-b border-zen-hairline/50">
                          <td className="py-3 pr-4 text-zen-charcoal">{o.id}</td>
                          <td className="py-3 pr-4 text-zen-muted">
                            {new Date(o.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                          </td>
                          <td className="py-3 pr-4 text-zen-charcoal">{o.customer.email}</td>
                          <td className="py-3 pr-4 text-zen-muted">{o.items.length}</td>
                          <td className="py-3 pr-4 text-zen-charcoal">{format(o.total)}</td>
                          <td className="py-3 pr-4 capitalize text-zen-sage">{o.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === "reservations" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zen-hairline text-left">
                    <th className="pb-3 pr-4 font-body font-normal text-zen-muted">Name</th>
                    <th className="pb-3 pr-4 font-body font-normal text-zen-muted">Date</th>
                    <th className="pb-3 pr-4 font-body font-normal text-zen-muted">Time</th>
                    <th className="pb-3 pr-4 font-body font-normal text-zen-muted">Party</th>
                    <th className="pb-3 pr-4 font-body font-normal text-zen-muted">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id} className="border-b border-zen-hairline/50">
                      <td className="py-3 pr-4 text-zen-charcoal">{r.name}</td>
                      <td className="py-3 pr-4 text-zen-muted">{r.date}</td>
                      <td className="py-3 pr-4 text-zen-muted">{r.time}</td>
                      <td className="py-3 pr-4 text-zen-muted">{r.party}</td>
                      <td className="py-3 pr-4 capitalize text-zen-sage">{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "users" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zen-hairline text-left">
                    <th className="pb-3 pr-4 font-body font-normal text-zen-muted">Name</th>
                    <th className="pb-3 pr-4 font-body font-normal text-zen-muted">Email</th>
                    <th className="pb-3 pr-4 font-body font-normal text-zen-muted">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-zen-hairline/50">
                      <td className="py-3 pr-4 text-zen-charcoal">{u.name}</td>
                      <td className="py-3 pr-4 text-zen-muted">{u.email}</td>
                      <td className="py-3 pr-4 capitalize text-zen-charcoal">{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-12">
          <Link to="/account" className="label-eyebrow link-underline text-zen-charcoal">
            ← Back to account
          </Link>
        </div>
      </div>
    </section>
  );
}