import React, { useMemo, useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import ZoomImage from "@/components/ZoomImage";
import MenuImage from "@/components/MenuImage";
import MenuItemDialog from "@/components/MenuItemDialog";
import { menuCategories, menuItems, dietaryIcons, getAvailabilityInfo } from "@/data/menu";
import { useCurrency } from "@/context/CurrencyContext";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal, Star, X, Calendar } from "lucide-react";

export default function Menu() {
  const { format } = useCurrency();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [maxPrice, setMaxPrice] = useState(600);
  const [sortBy, setSortBy] = useState("recommended"); // recommended | price-asc | price-desc | rating
  const [selectedItem, setSelectedItem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search query by 250ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Dietary filter toggle helper
  const toggleDietary = (code) => {
    setSelectedDietary((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setSelectedDietary([]);
    setMaxPrice(600);
    setSortBy("recommended");
    setActiveCategory("all");
  };

  const hasActiveFilters =
    debouncedQuery.trim() !== "" ||
    selectedDietary.length > 0 ||
    maxPrice < 600 ||
    sortBy !== "recommended" ||
    activeCategory !== "all";

  // Filter & Sort Items
  const filteredItems = useMemo(() => {
    return menuItems
      .filter((item) => {
        // Category filter
        const inCategory =
          activeCategory === "all" || item.category === activeCategory;

        // Search query filter (matches name, japaneseName, description, or ingredients)
        const q = debouncedQuery.trim().toLowerCase();
        const inSearch =
          !q ||
          item.name.toLowerCase().includes(q) ||
          (item.japaneseName && item.japaneseName.toLowerCase().includes(q)) ||
          item.description.toLowerCase().includes(q) ||
          item.ingredients.some((ing) => ing.toLowerCase().includes(q));

        // Dietary filters (all selected must match)
        const inDietary =
          selectedDietary.length === 0 ||
          selectedDietary.every((d) => item.dietary.includes(d));

        // Price filter
        const inPrice = item.price <= maxPrice;

        return inCategory && inSearch && inDietary && inPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        // Default "recommended": signature dishes first, then highest rating
        if (a.isSignature && !b.isSignature) return -1;
        if (!a.isSignature && b.isSignature) return 1;
        return b.rating - a.rating;
      });
  }, [activeCategory, debouncedQuery, selectedDietary, maxPrice, sortBy]);

  const activeCategoryObj = menuCategories.find((c) => c.id === activeCategory) || menuCategories[0];

  return (
    <>
      <PageHeader
        eyebrow="The counter"
        title="Menu"
        jp="お品書き"
      />

      <section className="bg-zen-paper">
        <div className="mx-auto max-w-[1400px] px-6 pt-7 pb-16 md:px-10 md:pt-12 md:pb-24">
          
          {/* Sticky Category Tabs Bar */}
          <div className="sticky top-20 z-30 bg-zen-paper/95 backdrop-blur-md border-b border-zen-hairline py-4 -mx-6 px-6 md:-mx-10 md:px-10 transition-all">
            <div className="flex items-center justify-between gap-4">
              {/* Horizontally scrollable category pills on mobile */}
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1">
                {menuCategories.map((c) => {
                  const isActive = activeCategory === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveCategory(c.id)}
                      className={cn(
                        "flex items-baseline gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap min-h-[38px]",
                        isActive
                          ? "bg-zen-charcoal text-zen-paper shadow-2xs font-medium"
                          : "border border-zen-hairline/80 bg-zen-paper text-zen-muted hover:border-zen-charcoal hover:text-zen-charcoal"
                      )}
                    >
                      <span className="font-heading text-sm sm:text-base">{c.label}</span>
                      <span className={cn("font-jp text-[10px]", isActive ? "text-zen-paper/80" : "text-zen-muted")}>
                        {c.jp}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Toggle Filters Mobile/Desktop Button */}
              <button
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
                aria-label="Toggle filters"
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-colors shrink-0 min-h-[38px]",
                  showFilters || selectedDietary.length > 0 || maxPrice < 600
                    ? "border-zen-charcoal bg-zen-surface text-zen-charcoal font-medium"
                    : "border-zen-hairline text-zen-muted hover:text-zen-charcoal hover:border-zen-charcoal"
                )}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Filters</span>
                {(selectedDietary.length > 0 || maxPrice < 600) && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zen-charcoal text-[9px] text-zen-paper">
                    {selectedDietary.length + (maxPrice < 600 ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Category Header + Hours Callout */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zen-hairline/40 pb-4">
            <div>
              <div className="flex items-baseline gap-2.5">
                <h2 className="font-heading text-3xl sm:text-4xl text-zen-charcoal">
                  {activeCategoryObj.label}
                </h2>
                <span className="font-jp text-sm tracking-widest text-zen-muted">
                  {activeCategoryObj.jp}
                </span>
              </div>
              <p className="text-xs text-zen-muted mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-zen-clay" />
                Serving Hours: <span className="font-medium text-zen-charcoal">{activeCategoryObj.hours}</span>
              </p>
            </div>

            <span className="text-xs text-zen-muted">
              Showing {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Filter Bar / Controls (Expandable Drawer/Section) */}
          <div
            className={cn(
              "grid transition-all duration-400 ease-zen overflow-hidden",
              showFilters ? "grid-rows-[1fr] mt-6 border-b border-zen-hairline pb-6" : "grid-rows-[0fr]"
            )}
          >
            <div className="min-h-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                {/* Search Input */}
                <div className="md:col-span-5">
                  <label className="label-eyebrow text-zen-muted text-[10px] mb-2 block">
                    Search Dish or Ingredient
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zen-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Try 'salmon', 'matcha', 'shokupan'..."
                      className="w-full rounded-lg border border-zen-hairline bg-zen-surface/40 py-2.5 pl-10 pr-9 text-xs sm:text-sm text-zen-charcoal placeholder:text-zen-muted focus:border-zen-charcoal focus:bg-zen-paper focus:outline-none transition-colors"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zen-muted hover:text-zen-charcoal"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sort Option */}
                <div className="md:col-span-3">
                  <label className="label-eyebrow text-zen-muted text-[10px] mb-2 block">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort dishes"
                    className="w-full rounded-lg border border-zen-hairline bg-zen-surface/40 py-2.5 px-3 text-xs sm:text-sm text-zen-charcoal focus:border-zen-charcoal focus:bg-zen-paper focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="recommended">Recommended (Signatures first)</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* Price Slider */}
                <div className="md:col-span-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="label-eyebrow text-zen-muted text-[10px]">
                      Max Price:
                    </label>
                    <span className="text-xs font-medium text-zen-charcoal font-heading">
                      {format(maxPrice)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="600"
                    step="20"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    aria-label="Maximum price filter"
                    className="w-full accent-zen-charcoal cursor-pointer"
                  />
                </div>
              </div>

              {/* Dietary Filter Buttons */}
              <div>
                <label className="label-eyebrow text-zen-muted text-[10px] mb-2.5 block">
                  Dietary Preferences
                </label>
                <div className="flex flex-wrap gap-2">
                  {["vegetarian", "vegan", "dairy-free", "spicy"].map((code) => {
                    const icon = dietaryIcons[code];
                    const isSelected = selectedDietary.includes(code);
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => toggleDietary(code)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors min-h-[34px]",
                          isSelected
                            ? "bg-zen-charcoal text-zen-paper border border-zen-charcoal font-medium"
                            : "border border-zen-hairline bg-zen-paper text-zen-muted hover:border-zen-charcoal hover:text-zen-charcoal"
                        )}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: isSelected ? "#F5F1EA" : icon.color }}
                        />
                        {icon.label}
                      </button>
                    );
                  })}

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="text-xs text-zen-clay hover:text-zen-charcoal hover:underline ml-2 py-1.5 self-center"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="my-24 text-center max-w-md mx-auto">
              <svg viewBox="0 0 100 100" className="h-16 w-16 mx-auto text-zen-hairline mb-4">
                <circle
                  cx="50"
                  cy="52"
                  r="34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="205 30"
                />
              </svg>
              <h3 className="font-heading text-2xl text-zen-charcoal mb-2">
                A Quiet Plate
              </h3>
              <p className="text-sm text-zen-muted leading-relaxed">
                Nothing matches that quiet craving right now. Perhaps adjust your filters or search for another wholesome ingredient?
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-6 inline-block rounded-sm bg-zen-charcoal px-6 py-2.5 text-xs uppercase tracking-[0.14em] text-zen-paper hover:bg-zen-espresso transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item, index) => {
                const availability = getAvailabilityInfo(item.available);

                return (
                  <ScrollReveal key={item.id} delay={(index % 3) * 0.08}>
                    <div
                      onClick={() => setSelectedItem(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedItem(item);
                        }
                      }}
                      className="group cursor-pointer flex flex-col justify-between h-full rounded-2xl border border-transparent hover:border-zen-hairline/60 p-2.5 transition-all duration-300 hover:bg-zen-surface/30"
                    >
                      <div>
                        {/* Image Frame with Signature Badge */}
                        <div className="relative overflow-hidden rounded-xl">
                          <ZoomImage
                            aspect="aspect-[4/5]"
                            zoom={1.08}
                            className="w-full"
                          >
                            <MenuImage
                              src={item.image.src}
                              alt={item.image.alt}
                              name={item.name}
                              japaneseName={item.japaneseName}
                              category={item.category}
                              aspect="aspect-[4/5]"
                              className="w-full h-full"
                            />
                          </ZoomImage>

                          {/* Signature Badge */}
                          {item.isSignature && (
                            <span className="absolute top-3 left-3 z-10 rounded-full bg-zen-espresso/90 backdrop-blur-xs px-2.5 py-0.5 text-[9px] uppercase tracking-[0.16em] text-zen-paper font-medium">
                              Signature
                            </span>
                          )}

                          {/* Availability status tag over image */}
                          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-zen-paper/90 backdrop-blur-xs px-2.5 py-0.5 text-[10px] text-zen-charcoal shadow-2xs">
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                availability.isAvailable ? "bg-zen-sage" : "bg-zen-muted"
                              )}
                            />
                            <span className={cn(availability.isAvailable ? "font-medium" : "text-zen-muted")}>
                              {availability.label}
                            </span>
                          </div>
                        </div>

                        {/* Title, Japanese Name & Price */}
                        <div className="mt-4 flex items-baseline justify-between gap-3">
                          <div>
                            <h3 className="font-heading text-xl text-zen-charcoal group-hover:text-zen-clay transition-colors">
                              {item.name}
                            </h3>
                            {item.japaneseName && (
                              <p className="font-jp text-xs tracking-widest text-zen-muted mt-0.5">
                                {item.japaneseName}
                              </p>
                            )}
                          </div>
                          <span className="font-heading text-lg font-medium text-zen-charcoal shrink-0">
                            {format(item.price)}
                          </span>
                        </div>

                        {/* Star Rating with Accessible Text */}
                        <div
                          className="mt-2 flex items-center gap-1.5 text-xs"
                          aria-label={`Rated ${item.rating} out of 5 from ${item.reviewsCount} reviews`}
                        >
                          <div className="flex items-center text-amber-700">
                            <Star className="h-3 w-3 fill-current" />
                          </div>
                          <span className="font-medium text-zen-charcoal">{item.rating}</span>
                          <span className="text-zen-muted text-[11px]">({item.reviewsCount})</span>
                        </div>

                        {/* One-Line Description */}
                        <p className="mt-2 text-xs text-zen-muted line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Dietary Badges */}
                      {item.dietary?.length > 0 && (
                        <div className="mt-3.5 flex flex-wrap gap-1 pt-2 border-t border-zen-hairline/30">
                          {item.dietary.map((d) => {
                            const icon = dietaryIcons[d];
                            return (
                              <span
                                key={d}
                                title={icon?.label || d}
                                className="rounded-xs bg-zen-surface px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-zen-muted font-medium"
                              >
                                {icon?.short || d}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}

          {/* Reserve a Table CTA Block */}
          <div className="mt-24 rounded-2xl border border-zen-hairline bg-zen-surface/60 p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-xs">
            <Calendar className="h-8 w-8 mx-auto text-zen-clay mb-4 stroke-[1.25]" />
            <span className="label-eyebrow text-zen-muted text-[11px]">
              Dine With Us
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl text-zen-charcoal mt-2 mb-3">
              Reserve Your Table
            </h3>
            <p className="text-sm text-zen-muted max-w-xl mx-auto leading-relaxed">
              Walk-ins are warmly welcomed. For weekend brunch, Omakase counter seating, and dinner sets, reserving ahead ensures your place at our quiet table.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/reservations"
                className="rounded-sm bg-zen-charcoal px-8 py-3 text-xs uppercase tracking-[0.16em] text-zen-paper hover:bg-zen-espresso transition-colors font-medium min-h-[44px] flex items-center"
              >
                Reserve a Table
              </Link>
              <Link
                to="/visit"
                className="rounded-sm border border-zen-hairline bg-zen-paper px-8 py-3 text-xs uppercase tracking-[0.16em] text-zen-charcoal hover:bg-zen-surface transition-colors font-medium min-h-[44px] flex items-center"
              >
                Hours & Location
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Item Detail Modal Dialog */}
      <MenuItemDialog
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}