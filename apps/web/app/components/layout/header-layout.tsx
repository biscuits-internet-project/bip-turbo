import { Footer } from "./footer";
import { Header } from "./header";

export function HeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="pt-16 short:!pt-12 flex-1">
        {/* Phone-landscape viewports give back horizontal padding to the
            content — sm:px-6 / lg:px-8 wastes too much room on a rotated
            phone where every pixel of table real estate matters. */}
        <div className="px-3 py-1 sm:px-6 lg:px-8 sm:pt-2 sm:pb-4 short:!px-2 short:!py-1">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
