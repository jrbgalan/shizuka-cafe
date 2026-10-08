import type { BookingDraft } from "./types";

/**
 * Creates and triggers a client-side download of a .ics calendar file
 * for the confirmed Shizuka Café reservation.
 */
export function downloadBookingIcs(booking: BookingDraft, reference: string): void {
  try {
    // Attempt parsing date & time
    const now = new Date();
    let startDate = new Date();

    // Check if booking.date has a parsable date string or fallback to tomorrow
    const parsed = new Date(booking.date);
    if (!isNaN(parsed.getTime())) {
      startDate = parsed;
    } else {
      // Default to tomorrow if label like "Tomorrow" was stored
      startDate.setDate(startDate.getDate() + 1);
    }

    if (booking.time) {
      const [h, m] = booking.time.split(":");
      const hours = parseInt(h, 10);
      const mins = parseInt(m || "0", 10);
      if (!isNaN(hours)) {
        startDate.setHours(hours, mins, 0, 0);
      }
    }

    // Reservation duration: 90 minutes (1.5 hours)
    const endDate = new Date(startDate.getTime() + 90 * 60 * 1000);

    const pad = (n: number) => String(n).padStart(2, "0");
    const formatIcsDate = (d: Date) =>
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    const nowFormatted =
      `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Shizuka Cafe//Reservation//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:shizuka-${reference}@shizukacafe.com`,
      `DTSTAMP:${nowFormatted}`,
      `DTSTART:${formatIcsDate(startDate)}`,
      `DTEND:${formatIcsDate(endDate)}`,
      `SUMMARY:Reservation at Shizuka Café (${booking.name})`,
      `DESCRIPTION:Table for ${booking.partySize} ${booking.partySize === 1 ? "guest" : "guests"}. Reference: ${reference}. (Demo reservation)`,
      "LOCATION:12 Lantern Lane, Poblacion, Makati City, Metro Manila, Philippines",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `shizuka-reservation-${reference}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Failed to generate .ics calendar event", err);
  }
}

