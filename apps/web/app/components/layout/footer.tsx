import { Heart, Mail, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { ContactDialog } from "~/components/contact/contact-dialog";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-content-bg/50 border-t border-content-bg-secondary mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:order-2">
          <ContactDialog>
            <button
              type="button"
              className="text-content-text-secondary hover:text-content-text-primary transition-colors duration-200 flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Contact
            </button>
          </ContactDialog>
          <a
            href="https://www.paypal.com/donate/?business=coteflakes@gmail.com&item_name=BIP+Support"
            target="_blank"
            rel="noopener noreferrer"
            className="text-content-text-secondary hover:text-content-text-primary transition-colors duration-200 flex items-center gap-2"
          >
            <Heart className="h-4 w-4 text-red-500" />
            Support
          </a>
          <Link
            to="/about"
            className="text-content-text-secondary hover:text-content-text-primary transition-colors duration-200"
          >
            About
          </Link>
          <Link
            to="/terms"
            className="text-content-text-secondary hover:text-content-text-primary transition-colors duration-200"
          >
            Terms
          </Link>
          <Link
            to="/privacy"
            className="text-content-text-secondary hover:text-content-text-primary transition-colors duration-200"
          >
            Privacy
          </Link>
          <Link
            to="/mcp-info"
            className="text-content-text-secondary hover:text-content-text-primary transition-colors duration-200 flex items-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" />
            MCP
            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-brand-secondary/20 text-brand-secondary rounded">
              beta
            </span>
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <div className="text-center md:text-left">
            <p className="text-content-text-secondary text-sm">
              &copy; {currentYear} Biscuits Internet Project. All rights reserved.
            </p>
            <p className="text-content-text-tertiary text-xs mt-1">Unofficial fan site for the Disco Biscuits</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
