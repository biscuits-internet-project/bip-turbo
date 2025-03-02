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
  const p = ({ children }: { children: React.ReactNode }) => (
    <p className="mb-4 text-gray-300 leading-relaxed">{children}</p>
  );

  const SubHeading = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xl font-semibold mb-3 mt-6 text-blue-300">{children}</h3>
  );

  const SubSubHeading = ({ children }: { children: React.ReactNode }) => (
    <h4 className="text-lg font-semibold mb-2 mt-4 text-blue-400">{children}</h4>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Music Terminology</h1>

      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">Inverted</h2>

        <p>
          Consider that a basic Disco Biscuits song (Song A) has three parts: A beginning composed section, followed by
          a jam, followed by a composed ending section.
        </p>
        <p>
          An inverted version of a song will almost always happen when they jam out of a different song (Song B), and
          segue the jam into the ending section of Song A. At the exact point of the ending of Song A, they immediately
          play the beginning of Song A, then the jam section, which usually segues into a different song (Song C), or
          the song that proceeded the inverted song (Song B).
        </p>

        <SubHeading>Examples:</SubHeading>
        <p>Standard Version of a song:</p>
        <p>Song A (Beg.) -&gt; Jam -&gt; Song A (End)</p>
        <p>Inverted Version:</p>
        <p>Song B -&gt; Jam -&gt; Song A (End) -&gt; Song A (Beg.) -&gt; Jam -&gt; Song C</p>

        <SubHeading>Shows:</SubHeading>
        <p>
          <Link
            to="/shows/2003-08-31-cervantes-masterpiece-ballroom-denver-co"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            8/31/03
          </Link>
          : Magellan &gt; Inverted Once the Fiddler Paid &gt; Magellan
          <br />
          <Link
            to="/shows/2006-05-28-electric-factory-philadelphia-pa"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            5/28/06
          </Link>
          : Story of the World &gt; Inverted Digital Buddha &gt; Story of the World
        </p>
      </div>

      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">Dyslexic</h2>

        <p>
          Refer back to the Inverted example above, except the beginning of Song A does not immediately follow the
          ending.
        </p>
        <p>
          Basically, a song is considered dyslexic if it is broken up, similar to an inverted version, but the song
          structure is played out of order or not immediately following each other. The band might play the end of a
          song in the first set, then start off the second set with the beginning. This would be considered a dyslexic
          version of the song. Dyslexic and Inverted are mutually exclusive. A song can be one or the other, but not
          both.
        </p>

        <SubHeading>Examples:</SubHeading>
        <p>Song A -&gt; Jam -&gt; Song B (End), Song C, Song B (Beg.) -&gt; Song D</p>

        <SubHeading>Shows:</SubHeading>
        <p>
          <Link
            to="/shows/2007-01-04-starland-ballroom-sayreville-nj"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            1/4/07
          </Link>
          : Above the Waves &gt; Dyslexic Svenghali (End) &gt; Paul Revere &gt; Dyslexic Svenghali (Beg.) &gt;
          Confrontation
        </p>
      </div>

      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">Palindrome</h2>

        <p>
          A Palindrome is exactly what you think it is – a set or portion of a set 3 songs or longer that reads the same
          forwards as it does backwards.
        </p>

        <SubHeading>Shows:</SubHeading>
        <p>
          <Link
            to="/shows/1999-05-01-wetlands-preserve-new-york-ny"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            5/1/99
          </Link>
          : Overture &gt; Basis for a Day &gt; Vassillios &gt; Basis for a Day &gt; Overture
          <br />
          <Link
            to="/shows/2001-09-08-webster-theater-hartford-ct"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            9/8/01
          </Link>
          : Reactor &gt; Crickets &gt; Story of the World &gt; Overture &gt; Story of the World &gt; Crickets &gt;
          Reactor
        </p>
      </div>

      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">Fakeout</h2>

        <p>
          A song fakeout is when the band builds up the end of a jam exactly like they would for a given song, then
          instead of playing the actual song, they stop and start playing a different song all at once. For example, on{" "}
          <Link
            to="/shows/1999-10-02-cafe-tomo-arcata-ca"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            10/02/1999
          </Link>
          , there is a Basis For a Day fakeout, with a fast techno jam in the same key as Basis like it was usually
          played in '99, then the band dropped into Above the Waves at the last second.
        </p>
      </div>

      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">Alternative Genre Versions of Songs</h2>

        <p>
          Occasionally the band will experiment by putting a significantly different musical spin on a composed song –
          essentially taking what they've written and reimagining it in a completely different genre. It's very common
          to see "Dub Dribble" or "Techno I-Man" on a setlist.
        </p>

        <SubSubHeading>Dub [Song name]</SubSubHeading>
        <p>
          A "dub" or "reggae" version of a song is a slowed down version, often complemented by a "juicier" bassline and
          calypso sounds a la reggae. It's simply altering the tune/tempo to give the composed section of the song a
          different feel. Most common are "Dublights" (from Floodlights, as in{" "}
          <Link
            to="/shows/2001-04-28-howlin-wolf-new-orleans-la"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            4/28/01
          </Link>
          ) and "Dub Dribble" (from Mindless Dribble, as in{" "}
          <Link
            to="/shows/2001-05-08-crystal-ballroom-portland-or"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            5/8/01
          </Link>
          ,{" "}
          <Link
            to="/shows/2003-05-28-the-conduit-trenton-nj"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            5/28/03
          </Link>
          , etc.)
        </p>

        <SubSubHeading>Techno [Song Name]</SubSubHeading>
        <p>
          A "techno" version of a song involves dropping a song's usual drumwork for a four-on-the-floor house beat
          complemented by heavy hi-hat work. Additionally, the bassline is often more thumping, following very crisply a
          more emphatic techno beat. While electronic music purists may cringe at the misuse of the term "techno" to
          describe what is essentially a "house" version of a song, they'll just have to deal with the nomenclature.
        </p>
        <p>
          The most common techno versions are I-Man and Pilin' It High, and they've been played so frequently now that
          often people forget there used to be another style.
        </p>
        <p>
          Techno I-Man has varied over the years as their style of playing has progressed. Some of the more well-known
          versions of the song are{" "}
          <Link
            to="/shows/1999-03-14-quixote-s-true-blue-aurora-co"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            3/14/99
          </Link>
          ,{" "}
          <Link
            to="/shows/1999-12-04-irving-plaza-new-york-ny"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            12/4/99
          </Link>
          ,{" "}
          <Link
            to="/shows/2002-12-29-orpheum-theatre-boston-ma"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            12/29/02
          </Link>
          , and{" "}
          <Link
            to="/shows/2003-05-28-the-conduit-trenton-nj"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            5/28/03
          </Link>
          . For a comparison to a non-techno version,{" "}
          <Link
            to="/shows/1999-05-06-chameleon-club-atlanta-ga"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            5/6/99
          </Link>{" "}
          is a perfect example (and you can hear the roots of King of the World taboot). Most of the versions from{" "}
          <Link to="/shows?year=2003" className="text-blue-400 hover:text-blue-300 hover:underline">
            2003
          </Link>{" "}
          and{" "}
          <Link to="/shows?year=2004" className="text-blue-400 hover:text-blue-300 hover:underline">
            2004
          </Link>{" "}
          are techno versions and are often not noted as such on the setlists because it had become so commonplace.
        </p>
      </div>
    </div>
  );
}
