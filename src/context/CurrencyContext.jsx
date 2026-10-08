import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { currencies } from "@/data/site";

const CurrencyContext = createContext(null);

const STORAGE_KEY = "shizuka.currency";

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "PHP";
    } catch {
      return "PHP";
    }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, currency); } catch { /* ignore */ }
  }, [currency]);

  const current = useMemo(
    () => currencies.find((c) => c.code === currency) || currencies[0],
    [currency]
  );

  // Convert a PHP price to the active currency and format it.
  const format = useMemo(() => {
    return (phpPrice) => {
      const value = phpPrice * current.rate;
      // JPY/KRW have no minor units.
      const noDecimals = current.code === "JPY" || current.code === "KRW";
      const formatted = new Intl.NumberFormat(current.locale, {
        minimumFractionDigits: noDecimals ? 0 : 2,
        maximumFractionDigits: noDecimals ? 0 : 2
      }).format(value);
      return `${current.symbol}${formatted}`;
    };
  }, [current]);

  const value = useMemo(
    () => ({ currency, setCurrency, current, format, currencies }),
    [currency, current, format]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}