import type React from "react";
import { Link } from "react-router-dom";
import { publicLoader } from "~/lib/base-loaders";

// Add a loader function
export const loader = publicLoader<void>(async () => {});

// Define metadata for the route
export function meta() {
  return [
    { title: "Music Terminology | Biscuits Internet Project" },
    {
      name: "description",
      content: "Inverted I-Man? Dyslexic Munchkin?? Dub Dribble??? WHAT DOES IT ALL MEAN?",
    },
    {
      property: "og:image",
      content: "/public/music.jpg",
    },
  ];
}

export default function Music() {
  return (
    <div className="">
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-content-text-primary">Music Terminology</h1>
        </div>

        <div className="bg-content-bg rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-brand-secondary mb-4">Inverted</h2>
          <p className="text-content-text-secondary mb-4">
            Inverted songs are played with the sections in reverse order. For example, if a song normally has an A-B-C
            structure, the inverted version would be played C-B-A. This technique creates a fresh take on familiar
            compositions while maintaining the core elements that fans recognize.
          </p>
          <p className="text-content-text-secondary mb-4">
            The Disco Biscuits have been playing inverted versions of their songs since the late 1990s. This approach
            showcases their musical versatility and keeps their live performances dynamic and unpredictable.
          </p>
          <p className="text-content-text-secondary mb-4">
            Inverted songs are typically noted in setlists with an "inv" or "inverted" designation after the song title.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6 text-brand-secondary">Examples:</h3>
          <ul className="list-disc pl-6 mb-4 text-content-text-secondary">
            <li>Helicopters (inverted)</li>
            <li>Mindless Dribble (inverted)</li>
            <li>Spaga (inverted)</li>
            <li>Astronaut (inverted)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6 text-brand-secondary">Shows:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <Link
                to="/shows/2009-12-31-the-fillmore-philadelphia-pa"
                className="text-brand-secondary hover:text-hover-accent hover:underline"
              >
                12/31/2009 - The Fillmore, Philadelphia, PA
              </Link>{" "}
              - Features inverted versions of "Helicopters" and "Mindless Dribble"
            </li>
            <li>
              <Link
                to="/shows/2010-01-16-theater-of-the-living-arts-philadelphia-pa"
                className="text-brand-secondary hover:text-hover-accent hover:underline"
              >
                01/16/2010 - Theater of the Living Arts, Philadelphia, PA
              </Link>{" "}
              - Features an inverted version of "Spaga"
            </li>
          </ul>
        </div>

        <div className="bg-content-bg rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-brand-secondary mb-4">Dyslexic</h2>
          <p className="text-content-text-secondary mb-4">
            Dyslexic versions involve playing the song's sections in a scrambled order, rather than simply reversing
            them as in inverted versions. This creates an even more unpredictable and challenging arrangement that tests
            the band's improvisational skills and communication.
          </p>
          <p className="text-content-text-secondary mb-4">
            For example, if a song normally has an A-B-C-D structure, a dyslexic version might be played as C-A-D-B.
            This approach creates a disorienting yet fascinating listening experience for fans familiar with the
            original compositions.
          </p>
          <p className="text-content-text-secondary mb-4">
            Dyslexic versions are less common than inverted versions but equally beloved by fans.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6 text-brand-secondary">Examples:</h3>
          <ul className="list-disc pl-6 mb-4 text-content-text-secondary">
            <li>Basis for a Day (dyslexic)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6 text-brand-secondary">Shows:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <Link
                to="/shows/2009-07-24-camp-bisco-8-mariaville-ny"
                className="text-brand-secondary hover:text-hover-accent hover:underline"
              >
                07/24/2009 - Camp Bisco 8, Mariaville, NY
              </Link>{" "}
              - Features a dyslexic version of "Basis for a Day"
            </li>
          </ul>
        </div>

        <div className="bg-content-bg rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-brand-secondary mb-4">Palindrome</h2>
          <p className="text-content-text-secondary mb-4">
            Palindrome versions are played with the sections in a mirror-like structure. For example, if a song normally
            has an A-B-C structure, the palindrome version would be played A-B-C-B-A. This creates a symmetrical
            arrangement that builds to a central point before returning to the beginning.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6 text-brand-secondary">Shows:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <Link
                to="/shows/2009-12-30-the-fillmore-philadelphia-pa"
                className="text-brand-secondary hover:text-hover-accent hover:underline"
              >
                12/30/2009 - The Fillmore, Philadelphia, PA
              </Link>{" "}
              - Features a palindrome version of "Cyclone"
            </li>
            <li>
              <Link
                to="/shows/2010-01-16-theater-of-the-living-arts-philadelphia-pa"
                className="text-brand-secondary hover:text-hover-accent hover:underline"
              >
                01/16/2010 - Theater of the Living Arts, Philadelphia, PA
              </Link>{" "}
              - Features a palindrome version of "Astronaut"
            </li>
          </ul>
        </div>

        <div className="bg-content-bg rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-brand-secondary mb-4">Techno</h2>
          <p className="text-content-text-secondary mb-4">
            In 2003 and 2004, the band experimented with techno versions of their songs, particularly during shows where
            they performed as "The Perfume." These versions featured electronic arrangements with drum machines and
            synthesizers taking a more prominent role.
          </p>
          <p className="text-content-text-secondary mb-4">
            <Link to="/shows?year=2003" className="text-brand hover:text-hover-accent hover:underline">
              2003
            </Link>{" "}
            and{" "}
            <Link to="/shows?year=2004" className="text-brand hover:text-hover-accent hover:underline">
              2004
            </Link>{" "}
            were particularly notable years for these techno experiments, with songs like "I-Man" and "7-11" receiving
            the techno treatment.
          </p>
        </div>
      </div>
    </div>
  );
}
