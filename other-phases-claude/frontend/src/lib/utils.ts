import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import sanitizeHtml from "sanitize-html";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeInput(unsafeInput: string): string {
  return sanitizeHtml(unsafeInput, {
    allowedTags: [],
    allowedAttributes: {},
  });
}