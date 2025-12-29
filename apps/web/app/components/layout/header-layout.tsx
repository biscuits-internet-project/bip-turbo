import { Footer } from "./footer";
import { Header } from "./header";

export function HeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="pt-16 flex-1">
        <div className="px-2 py-1 sm:px-6 lg:px-8 sm:py-4">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
