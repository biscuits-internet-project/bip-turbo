import type React from "react";
import { publicLoader } from "~/lib/base-loaders";

// Define types for our data
interface Mix {
  url: string;
  name: string;
}

// Add a loader function
export const loader = publicLoader<void>(async () => {});

// Define metadata for the route
export function meta() {
  return [
    { title: "Running Mixes" },
    {
      name: "description",
      content: "A collection of Disco Biscuits running mixes for your workout pleasure.",
    },
  ];
}

const Mixes: React.FC = () => {
  const mixes: Mix[] = [
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20Air%20Song%20Running%20Mix.mp3",
      name: "Air Song Running Mix",
    },
    { url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20Best%20of%202008.mp3", name: "Best of 2008" },
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20Big%20Time%20Baby%20Running%20Mix.mp3",
      name: "Big Time Baby Running Mix",
    },
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20Caterpillar%20Running%20Mix.mp3",
      name: "Caterpillar Running Mix",
    },
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20Digital%20Loufa%20Running%20Mix.mp3",
      name: "Digital Loufa Running Mix",
    },
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20Everyone%20Get%20Down%20Running%20Mix.mp3",
      name: "Everyone Get Down Running Mix",
    },
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20HIIT%20Running%20Mix.mp3",
      name: "HIIT (High Intensity Interval Training) Running Mix",
    },
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20Interplanetary%20Running%20Mix.mp3",
      name: "Interplanetary Running Mix",
    },
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20Mirrorball_&_Glowsticks_vol1_mixed_by_HAL_Masa.mp3",
      name: "Mirrorball & Glowsticks Vol 1",
    },
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20Post%20Halloween%20PacNW%20Throwdown%20(Jam%20Compilation).mp3",
      name: "Post-Halloween PacNW Throwdown",
    },
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20Project%20Four%20Running%20Mix.mp3",
      name: "Project 4 Running Mix",
    },
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20Rageaholics%20Anonymous%20Mix.mp3",
      name: "Rageaholics Anonymous",
    },
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20Resurrection%20Running%20Mix.mp3",
      name: "Resurrection Running Mix",
    },
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20Snowmelt%20Running%20Mix.mp3",
      name: "Snowmelt Running Mix",
    },
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20Spring%202007%20Running%20Mix.mp3",
      name: "Spring 2007 Running Mix",
    },
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20Step%20Inside%20Running%20Mix.mp3",
      name: "Step Inside Running Mix",
    },
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20The%20Decade%20Running%20Mix.mp3",
      name: "The Decade Running Mix",
    },
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20The%20Recovery%20Running%20Mix.mp3",
      name: "The Recovery Running Mix",
    },
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20The%20Revival%20Running%20Mix.mp3",
      name: "The Revival Running Mix",
    },
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20Thirst%20Quencher%20Running%20Mix.mp3",
      name: "Thirst Quencher Running Mix",
    },
    {
      url: "http://runlikeh3ll.com/tdb/The%20Disco%20Biscuits%20-%20Treemaculates%20Bischedelica.mp3",
      name: "Treemaculates Bischedelic",
    },
  ];

  const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-content-bg rounded-lg shadow-md overflow-hidden mb-8">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-brand mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );

  const p = ({ children }: { children: React.ReactNode }) => (
    <p className="mb-4 text-content-text-secondary leading-relaxed">{children}</p>
  );

  return (
    <div className="">
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Running Mixes</h1>
        </div>

        <Card title="About These Mixes">
          <div className="space-y-4 text-content-text-primary">
            <p className="leading-relaxed">
              For many runners, long-form high-intensity music is the best way to get through a workout. As luck would
              have it, this is what The Disco Biscuits do best.
            </p>
            <p className="leading-relaxed">
              As much as we all love their compositions, sometimes the first 10 minutes of the House Dog Party Favor
              composition aren't the ideal musical companion for pushing yourself up the side of a mountain. Sometimes
              you want to get right into the meat of the jam to fuel your ascent. That's where The Disco Biscuits
              Workout Mixes come in handy.
            </p>
            <p className="leading-relaxed">
              These mixes are composed of hand-selected jams. In most cases, they segue into one another.
            </p>
            <p className="leading-relaxed">
              I've found them to be the perfect musical companion for longer runs. Personally, these mixes helped me to
              get into running and forged a lifelong love for this band.{" "}
              <a
                href="https://livemusicblog.com/features/podcast-59-hippie-workout-mix-vol-1/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:text-hover-accent hover:underline"
              >
                This specific mix from LiveMusicBlog.com
              </a>{" "}
              took my casual fandom to full-blown obsession back in 2008, and I've been running to the Biscuits ever
              since. They've gotten me across the finish line in countless races, and I have yet to find any music more
              conducive to cardio.
            </p>
            <p className="leading-relaxed">
              I hope you enjoy these mixes as much as I do! If I've missed any mixes (or you've created a new one that
              you'd like to add), please let me know. If one of these mixes is yours and you'd like credit for it, don't
              hesitate to reach out!
            </p>
            <p className="leading-relaxed">
              -{" "}
              <a
                href="https://johnvantine.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:text-hover-accent hover:underline"
              >
                John
              </a>
            </p>
          </div>
        </Card>

        <Card title="Available Mixes">
          <ul className="divide-y divide-divider">
            {mixes.map((mix) => (
              <li key={mix.name.replace(/\s+/g, "-").toLowerCase()} className="py-3">
                <a
                  href={mix.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:text-hover-accent hover:underline flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <title>Audio file</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  {mix.name}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Mixes;
