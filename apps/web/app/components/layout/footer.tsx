import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { ContactDialog } from "~/components/contact/contact-dialog";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-content-bg/50 border-t border-content-bg-secondary mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <ContactDialog>
            <button type="button" className="text-content-text-secondary hover:text-content-text-primary transition-colors duration-200 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact
            </button>
          </ContactDialog>
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
