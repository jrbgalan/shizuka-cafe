import React, { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import { products, origins, roasts, processes } from "@/data/products";
import { cn } from "@/lib/utils";

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div>
      <p className="label-eyebrow">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={cn(
              "border px-3 py-1.5 text-xs uppercase tracking-[0.15em] transition-colors",
              value === o ? "border-zen-charcoal bg-zen-charcoal text-zen-paper" : "border-zen-hairline text-zen-muted hover:border-zen-charcoal hover:text-zen-charcoal"
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Shop() {
  const [origin, setOrigin] = useState("All");
  const [roast, setRoast] = useState("All");
  const [process, setProcess] = useState("All");
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      (origin === "All" || p.origin === origin) &&
      (roast === "All" || p.roast === roast) &&
      (process === "All" || p.process === process)
    );
    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
      default: list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [origin, roast, process, sort]);

  return (
    <>
      <PageHeader eyebrow="The roastery" title="Coffee beans" jp="珈琲豆" imageLabel="Coffee beans spilling onto a stone surface" />

      <section className="bg-zen-paper">
        <div className="mx-auto max-w-[1400px] px-6 py-22 md:px-10 md:py-30">
          {/* Filters */}
          <div className="grid grid-cols-1 gap-8 border-b border-zen-hairline pb-10 md:grid-cols-3">
            <FilterGroup label="Origin" options={origins} value={origin} onChange={setOrigin} />
            <FilterGroup label="Roast" options={roasts} value={roast} onChange={setRoast} />
            <FilterGroup label="Process" options={processes} value={process} onChange={setProcess} />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <p className="label-eyebrow">{filtered.length} {filtered.length === 1 ? "bean" : "beans"}</p>
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="label-eyebrow">Sort</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-zen-hairline bg-transparent px-3 py-2 text-sm focus:border-zen-charcoal focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price — low to high</option>
                <option value="price-desc">Price — high to low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <p className="mt-16 text-center text-zen-muted">No beans match those filters. Try widening the search.</p>
          ) : (
            <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}