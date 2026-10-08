import { useState, useEffect } from "react";

/**
 * Custom hook to track real-time café hours and local clock
 * Timezone: Asia/Manila (PHT, UTC+8)
 */
export function useCafeTime() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Tick every second for smooth, accurate real-time clock
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format in Manila / Local Roastery time
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });

  const timeWithSecondsFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  const hour24Formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    hour: "numeric",
    minute: "numeric",
    hour12: false
  });

  const dayOfWeekFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    weekday: "long"
  });

  const formattedTime = timeFormatter.format(now);
  const timeWithSeconds = timeWithSecondsFormatter.format(now);
  const dayOfWeek = dayOfWeekFormatter.format(now);

  // Parse hour and minute in Manila timezone
  const parts = hour24Formatter.formatToParts(now);
  const hour = parseInt(parts.find(p => p.type === "hour")?.value || "0", 10);
  const minute = parseInt(parts.find(p => p.type === "minute")?.value || "0", 10);
  const currentTimeDec = hour + minute / 60;

  // Determine schedule by day
  let openTimeDec = 7.5; // 7:30 AM
  let closeTimeDec = 19.0; // 7:00 PM
  let todayHoursLabel = "7:30 AM – 7:00 PM";

  if (dayOfWeek === "Saturday") {
    openTimeDec = 8.0;
    closeTimeDec = 20.0;
    todayHoursLabel = "8:00 AM – 8:00 PM";
  } else if (dayOfWeek === "Sunday") {
    openTimeDec = 8.0;
    closeTimeDec = 18.0;
    todayHoursLabel = "8:00 AM – 6:00 PM";
  }

  const isOpen = currentTimeDec >= openTimeDec && currentTimeDec < closeTimeDec;
  const isClosingSoon = isOpen && (closeTimeDec - currentTimeDec <= 0.5); // Within 30 minutes of close

  let statusText = "Closed";
  let statusDetail = `Opens at ${openTimeDec === 7.5 ? "7:30 AM" : "8:00 AM"}`;

  if (isClosingSoon) {
    statusText = "Closing Soon";
    statusDetail = "Last orders 30m before close";
  } else if (isOpen) {
    statusText = "Open Now";
    const closeHourStr = closeTimeDec === 20 ? "8:00 PM" : closeTimeDec === 18 ? "6:00 PM" : "7:00 PM";
    statusDetail = `Until ${closeHourStr}`;
  }

  return {
    now,
    formattedTime,
    timeWithSeconds,
    dayOfWeek,
    isOpen,
    isClosingSoon,
    statusText,
    statusDetail,
    todayHoursLabel,
    timeZone: "PHT (GMT+8)"
  };
}

