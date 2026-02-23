import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera le iniziali da una o più stringhe (nome, cognome, ecc.)
 * @param fallback - Carattere di fallback se nessuna stringa è valida (default: "U")
 * @param strings - Le stringhe da cui estrarre le iniziali
 * @returns Le iniziali in maiuscolo
 */
export function getInitials(fallback: string = "U", ...strings: (string | undefined | null)[]): string {
  const initials = strings
    .filter((s): s is string => !!s && s.trim().length > 0)
    .map((s) => s.trim()[0])
    .join("")
    .toUpperCase();

  return initials || fallback;
}

/**
 * Formatta un numero come valuta italiana (€)
 * @param amount - L'importo da formattare
 * @returns Stringa formattata (es. "1.234,50")
 */
export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return "0,00";
  return amount.toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Formatta una data in formato italiano
 * @param dateString - La stringa della data da formattare
 * @param withTime - Se true, include ora e minuti (default: false)
 * @returns Stringa formattata (es. "23 febbraio 2026" o "23 febbraio 2026, 14:30")
 */
export function formatDate(dateString: string | undefined | null, withTime: boolean = false): string {
  if (!dateString) return "";

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  if (withTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return new Date(dateString).toLocaleDateString("it-IT", options);
}
