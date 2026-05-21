import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  // clsx handles conditional class names; tailwind-merge resolves conflicting Tailwind utilities.
  return twMerge(clsx(inputs));
}
