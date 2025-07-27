import { Header } from "./header";

export function HeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="px-4 py-6 sm:px-6 lg:px-8 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}