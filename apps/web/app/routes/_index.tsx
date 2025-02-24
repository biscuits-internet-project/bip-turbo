import { ArrowRight, Calendar, MapPin, Music, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="px-4 py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-transparent">
          Welcome to BIP 3.0
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your ultimate resource for the Disco Biscuits - shows, setlists, stats, and more.
        </p>
        <div className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search shows, songs, venues..."
            className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-3 text-lg"
          />
        </div>
      </div>

      {/* Quick access grid */}
      <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Link
          to="/shows"
          className="group p-6 rounded-lg border border-border bg-card hover:border-purple-500 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <Music className="h-6 w-6 text-purple-500" />
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-500 transition-colors" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Shows & Setlists</h2>
          <p className="text-muted-foreground">Browse through our comprehensive database of shows and setlists.</p>
        </Link>

        <Link
          to="/songs"
          className="group p-6 rounded-lg border border-border bg-card hover:border-purple-500 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <Music className="h-6 w-6 text-purple-500" />
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-500 transition-colors" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Song Database</h2>
          <p className="text-muted-foreground">Explore the complete catalog of Disco Biscuits songs.</p>
        </Link>

        <Link
          to="/venues"
          className="group p-6 rounded-lg border border-border bg-card hover:border-purple-500 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <MapPin className="h-6 w-6 text-purple-500" />
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-500 transition-colors" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Venues</h2>
          <p className="text-muted-foreground">Discover where the band has played throughout their history.</p>
        </Link>

        <Link
          to="/tour-dates"
          className="group p-6 rounded-lg border border-border bg-card hover:border-purple-500 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-6 w-6 text-purple-500" />
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-500 transition-colors" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Upcoming Shows</h2>
          <p className="text-muted-foreground">See where the band is playing next and plan your shows.</p>
        </Link>
      </div>

      {/* Stats section */}
      <div className="px-4 grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="p-4 text-center rounded-lg border border-border bg-card">
          <div className="text-3xl font-bold text-purple-500 mb-1">2,000+</div>
          <div className="text-sm text-muted-foreground">Shows</div>
        </div>
        <div className="p-4 text-center rounded-lg border border-border bg-card">
          <div className="text-3xl font-bold text-purple-500 mb-1">300+</div>
          <div className="text-sm text-muted-foreground">Songs</div>
        </div>
        <div className="p-4 text-center rounded-lg border border-border bg-card">
          <div className="text-3xl font-bold text-purple-500 mb-1">500+</div>
          <div className="text-sm text-muted-foreground">Venues</div>
        </div>
        <div className="p-4 text-center rounded-lg border border-border bg-card">
          <div className="text-3xl font-bold text-purple-500 mb-1">25+</div>
          <div className="text-sm text-muted-foreground">Years</div>
        </div>
      </div>
    </div>
  );
}
