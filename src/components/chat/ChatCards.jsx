import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Calendar, Check, Clock, ExternalLink, MapPin } from "lucide-react";
import { downloadBookingIcs } from "@/lib/chat/calendar";
import ZenImage from "@/components/ZenImage";
import MenuImage from "@/components/MenuImage";

/**
 * Menu Item Card
 */
export function MenuCard({ data, onSelectAction }) {
  if (!data) return null;

  return (
    <div className="mt-2.5 overflow-hidden rounded-xl border border-zen-hairline bg-zen-paper p-3.5 shadow-2xs transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-heading text-lg font-medium text-zen-charcoal truncate">
              {data.name}
            </h4>
            {data.jp && (
              <span className="font-jp text-xs text-zen-muted shrink-0">
                {data.jp}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-zen-muted leading-relaxed line-clamp-2">
            {data.description}
          </p>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="font-body text-sm font-medium text-zen-charcoal">
              ₱{data.price}
            </span>
            {data.dietary && data.dietary.length > 0 && (
              <div className="flex items-center gap-1">
                {data.dietary.map((d) => (
                  <span
                    key={d}
                    className="rounded-xs bg-zen-surface px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-zen-muted font-medium"
                  >
                    {d}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {(data.imageSrc || data.imageLabel) && (
          <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-zen-hairline/60">
            <MenuImage
              src={data.imageSrc || (data.imageLabel ? `/images/menu/${data.imageLabel}.webp` : undefined)}
              alt={data.name}
              name={data.name}
              japaneseName={data.jp}
              category={data.category || "Menu"}
              aspect="aspect-square"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-end border-t border-zen-hairline/40 pt-2.5">
        <Link
          to="/menu"
          className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-zen-charcoal hover:text-zen-clay transition-colors"
        >
          View Full Menu <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

/**
 * Hours Card
 */
export function HoursCard({ data }) {
  if (!data || !data.schedule) return null;

  return (
    <div className="mt-2.5 rounded-xl border border-zen-hairline bg-zen-paper p-3.5 shadow-2xs">
      <div className="flex items-center gap-2 pb-2 border-b border-zen-hairline/40">
        <Clock className="h-4 w-4 text-zen-clay" />
        <span className="label-eyebrow text-zen-charcoal">Hours of Operation</span>
      </div>
      <div className="mt-2.5 space-y-1.5 text-xs">
        {data.schedule.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center py-0.5">
            <span className="text-zen-muted">{item.day}</span>
            <span className="font-medium text-zen-charcoal">{item.time}</span>
          </div>
        ))}
      </div>
      {data.note && (
        <p className="mt-2.5 border-t border-zen-hairline/40 pt-2 text-[11px] text-zen-muted italic">
          {data.note}
        </p>
      )}
    </div>
  );
}

/**
 * Location Card
 */
export function LocationCard({ data }) {
  if (!data) return null;

  return (
    <div className="mt-2.5 rounded-xl border border-zen-hairline bg-zen-paper p-3.5 shadow-2xs">
      <div className="flex items-center gap-2 pb-2 border-b border-zen-hairline/40">
        <MapPin className="h-4 w-4 text-zen-clay" />
        <span className="label-eyebrow text-zen-charcoal">{data.name}</span>
      </div>
      <div className="mt-2.5 text-xs text-zen-charcoal">
        <p className="font-medium">{data.line1}</p>
        <p className="text-zen-muted">{data.city}, {data.region} {data.postcode}</p>
        {data.directionsHint && (
          <p className="mt-2 text-zen-muted/90 italic text-[11px]">
            {data.directionsHint}
          </p>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-zen-hairline/40 pt-2.5">
        <Link
          to="/visit"
          className="text-[11px] uppercase tracking-[0.16em] text-zen-muted hover:text-zen-charcoal transition-colors"
        >
          View Map & Directions
        </Link>
        <a
          href={data.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-zen-charcoal hover:text-zen-clay transition-colors"
        >
          Google Maps <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

/**
 * Roastery Product Card
 */
export function ProductCard({ data }) {
  if (!data) return null;

  return (
    <div className="mt-2.5 rounded-xl border border-zen-hairline bg-zen-paper p-3.5 shadow-2xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className="label-eyebrow text-zen-clay text-[10px]">
            {data.origin} · {data.roast}
          </span>
          <h4 className="mt-0.5 font-heading text-lg font-medium text-zen-charcoal truncate">
            {data.name}
          </h4>
          <p className="text-xs text-zen-muted">Process: {data.process}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {data.tastingNotes?.map((t, idx) => (
              <span
                key={idx}
                className="rounded-xs bg-zen-surface px-1.5 py-0.5 text-[10px] text-zen-charcoal"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="mt-2 text-sm font-medium text-zen-charcoal">
            ₱{data.price} <span className="text-[11px] text-zen-muted font-normal">/ 250g</span>
          </p>
        </div>

        {data.imageLabel && (
          <div className="w-16 h-20 shrink-0 rounded-lg overflow-hidden border border-zen-hairline/60">
            <ZenImage
              label={data.imageLabel}
              alt={data.name}
              aspect="aspect-[4/5]"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-end border-t border-zen-hairline/40 pt-2.5">
        <Link
          to={`/shop/${data.slug}`}
          className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-zen-charcoal hover:text-zen-clay transition-colors font-medium"
        >
          View in Roastery <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

/**
 * In-Chat Reservation Summary Card
 */
export function BookingSummaryCard({ data, onConfirm, onEdit }) {
  if (!data) return null;

  return (
    <div className="mt-2.5 rounded-xl border border-zen-hairline bg-zen-paper p-4 shadow-xs">
      <div className="flex items-center gap-2 pb-2.5 border-b border-zen-hairline">
        <Calendar className="h-4 w-4 text-zen-clay" />
        <span className="label-eyebrow text-zen-charcoal">Reservation Summary</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-y-2 text-xs">
        <span className="text-zen-muted">Guest Name:</span>
        <span className="font-medium text-zen-charcoal">{data.name || "Guest"}</span>

        <span className="text-zen-muted">Date:</span>
        <span className="font-medium text-zen-charcoal">{data.date}</span>

        <span className="text-zen-muted">Time:</span>
        <span className="font-medium text-zen-charcoal">{data.time}</span>

        <span className="text-zen-muted">Party Size:</span>
        <span className="font-medium text-zen-charcoal">
          {data.partySize} {data.partySize === 1 ? "guest" : "guests"}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 rounded-sm bg-zen-charcoal py-2 text-center text-xs font-medium uppercase tracking-[0.14em] text-zen-paper transition-colors hover:bg-zen-espresso min-h-[38px]"
        >
          Confirm Reservation
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-sm border border-zen-hairline px-3 py-2 text-xs text-zen-muted hover:text-zen-charcoal hover:border-zen-charcoal transition-colors min-h-[38px]"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

/**
 * Confirmed Reservation Card
 */
export function BookingConfirmedCard({ data }) {
  if (!data || !data.booking) return null;
  const { booking, reference } = data;

  return (
    <div className="mt-2.5 rounded-xl border border-zen-clay/60 bg-zen-paper p-4 shadow-xs">
      <div className="flex items-center gap-2 pb-2.5 border-b border-zen-hairline">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zen-sage text-zen-paper">
          <Check className="h-3 w-3 stroke-[2.5]" />
        </div>
        <span className="label-eyebrow text-zen-charcoal font-medium">Table Reserved</span>
      </div>

      <div className="mt-3 space-y-1 text-xs">
        <div className="flex justify-between py-1 border-b border-zen-hairline/30">
          <span className="text-zen-muted">Reference:</span>
          <span className="font-mono font-semibold text-zen-charcoal tracking-wider">{reference}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-zen-hairline/30">
          <span className="text-zen-muted">Name:</span>
          <span className="font-medium text-zen-charcoal">{booking.name}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-zen-hairline/30">
          <span className="text-zen-muted">Date & Time:</span>
          <span className="font-medium text-zen-charcoal">{booking.date} at {booking.time}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-zen-muted">Party:</span>
          <span className="font-medium text-zen-charcoal">{booking.partySize} {booking.partySize === 1 ? "guest" : "guests"}</span>
        </div>
      </div>

      <div className="mt-4 pt-2.5 border-t border-zen-hairline/60">
        <button
          type="button"
          onClick={() => downloadBookingIcs(booking, reference)}
          className="w-full flex items-center justify-center gap-2 rounded-sm border border-zen-hairline bg-zen-surface py-2 text-xs text-zen-charcoal hover:bg-zen-charcoal hover:text-zen-paper transition-colors font-medium min-h-[38px]"
        >
          <Calendar className="h-3.5 w-3.5" /> Add to Calendar (.ics)
        </button>
      </div>

      <p className="mt-3 text-[10px] text-zen-muted text-center italic">
        Demo only — no booking was actually made.
      </p>
    </div>
  );
}

/**
 * Universal Card Switcher
 */
export function ChatCard({ card, onConfirmBooking, onEditBooking }) {
  if (!card) return null;

  switch (card.type) {
    case "menu":
      return <MenuCard data={card.data} />;
    case "hours":
      return <HoursCard data={card.data} />;
    case "location":
      return <LocationCard data={card.data} />;
    case "product":
      return <ProductCard data={card.data} />;
    case "booking_summary":
      return (
        <BookingSummaryCard
          data={card.data}
          onConfirm={onConfirmBooking}
          onEdit={onEditBooking}
        />
      );
    case "booking_confirmed":
      return <BookingConfirmedCard data={card.data} />;
    default:
      return null;
  }
}

