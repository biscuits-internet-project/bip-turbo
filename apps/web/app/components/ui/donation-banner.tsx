import { Heart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

interface DonationBannerProps {
  className?: string;
}

const COOKIE_NAME = "bip_donation_banner_dismissed";
const COOKIE_EXPIRY_DAYS = 60;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  // Using document.cookie for simple cookie setting (Cookie Store API not widely supported)
  // biome-ignore lint/suspicious/noDocumentCookie: Simple cookie setting, Cookie Store API not widely supported
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export function DonationBanner({ className }: DonationBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const isDismissed = getCookie(COOKIE_NAME) === "true";
    setIsVisible(!isDismissed);
    setIsLoaded(true);
  }, []);

  const handleDismiss = () => {
    setCookie(COOKIE_NAME, "true", COOKIE_EXPIRY_DAYS);
    setIsVisible(false);
  };

  // Don't render until we've checked the cookie to avoid flash
  if (!isLoaded || !isVisible) return null;

  return (
    <div
      className={cn(
        "relative bg-gradient-to-r from-brand-primary/10 via-brand-secondary/10 to-brand-primary/10",
        "border border-brand-primary/20 rounded-lg",
        "text-sm",
        className,
      )}
    >
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 hover:bg-brand-primary/10 rounded transition-colors z-10"
        aria-label="Dismiss banner"
      >
        <X className="h-3.5 w-3.5 text-content-text-tertiary" />
      </button>

      <a
        href="https://www.paypal.com/donate/?business=coteflakes@gmail.com&item_name=BIP+Support"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 px-4 py-2.5 md:py-2 pl-10 hover:bg-brand-primary/5 transition-colors rounded-lg"
      >
        <Heart className="h-4 w-4 text-red-500 flex-shrink-0" />
        <span className="text-content-text-secondary">
          Consider <span className="font-medium text-content-text-primary">donating</span> to keep the BIP ad-free
        </span>
      </a>
    </div>
  );
}
