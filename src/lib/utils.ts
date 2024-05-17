import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function isOnline(): Promise<boolean> {
  try {
    if (!self.navigator.onLine) //false is always reliable that no network. true might lie
      return false;
    const request = new URL(self.location.origin); // avoid CORS errors with a request to your own origin
    request.searchParams.set('rand', Date.now().toString()); // random value to prevent cached responses
    const response = await fetch(request.toString(), { method: 'HEAD' });
    return response.ok;
  }
  catch {
    return false;
  }
}