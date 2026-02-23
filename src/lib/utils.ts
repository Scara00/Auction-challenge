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
