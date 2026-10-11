import React, { createContext, useContext, useMemo, useState, useEffect, ReactNode } from "react";
import { currencies } from "@/data/site";
import type { Currency } from "@/types";

export interface CurrencyContextValue {
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  current: Currency;
  format: (phpPrice: number) => string;
  currencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const STORAGE_KEY = "shizuka.currency";

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "PHP";
    } catch {
      return "PHP";
    }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, currency); } catch { /* ignore */ }
  }, [currency]);

  const current = useMemo<Currency>(
    () => (currencies.find((c) => c.code === currency) as Currency) || (currencies[0] as Currency),
    [currency]
  );

  // Convert a PHP price to the active currency and format it.
  const format = useMemo(() => {
    return (phpPrice: number): string => {
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

  const value = useMemo<CurrencyContextValue>(
    () => ({ currency, setCurrency, current, format, currencies }),
    [currency, current, format]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

