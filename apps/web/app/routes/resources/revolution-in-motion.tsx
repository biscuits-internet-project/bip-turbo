import { Podcast } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SetlistList } from "~/components/setlist/setlist-list";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { EXTERNAL_SOURCE_DOMAINS, faviconSrc } from "~/lib/favicon";
import { ROCK_OPERA_SLUG } from "~/lib/rock-operas";
import { slugifyAnchor } from "~/lib/utils";
import { getRockOperaPerformances, type RockOperaPerformancesLoaderData } from "./rock-opera-performances";

export const loader = publicLoader<RockOperaPerformancesLoaderData>(({ context }) =>
  getRockOperaPerformances(ROCK_OPERA_SLUG.REVOLUTION_IN_MOTION, context),
);

export function meta() {
  return [
    { title: "Revolution in Motion | Biscuits Internet Project" },
    {
      name: "description",
      content:
        "The Disco Biscuits' third rock opera, a science-fiction concept album created by Jon Gutwillig, Joey Friedman, and Aron Magner. Released March 29, 2024.",
    },
    {
      property: "og:image",
      content: "https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/revolution-in-motion.png",
    },
  ];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const characters = [
  {
    name: "The Captain",
    initial: "C",
    gradient: "from-purple-500 to-cyan-400",
    description:
      "Commander of the JP-8000 and son of the Queen of Polyfuzia. A brilliant but reckless prince who loses his way, spiraling into addiction and aimlessness. Through his encounter with The Disco Biscuits and their music, he transforms into an enlightened leader.",
    songs: ["Shocked!", "The Wormhole", "Freeze", "The Deal"],
  },
  {
    name: "The Queen of Polyfuzia",
    initial: "Q",
    gradient: "from-purple-400 to-pink-400",
    description:
      "Benevolent ruler of Polyfuzia and mother of the Captain. The emotional centerpiece of the story. When her advisers declare her son lost, she refuses to believe them and holds faith that he will return.",
    songs: ["Twisted in the Road", "Why We Dance"],
  },
  {
    name: "The First Mate & Crew",
    initial: "FM",
    gradient: "from-emerald-400 to-cyan-400",
    description:
      "Loyal officers of the JP-8000 and the Captain's lifelong companions. They help motivate the Captain after he awakens from his coma and carry out the mission to freeze Manhattan.",
    songs: ["Another Plan of Attack", "Tourists (Rocket Ship)"],
  },
  {
    name: "The Disco Biscuits",
    initial: "tDB",
    gradient: "from-purple-500 to-emerald-400",
    description:
      "Human band whose music reshapes the fate of Polyfuzia and life here on Earth. Eventually fused with Polyfuzian energy through DNA transference, becoming part human and part alien royalty.",
    songs: [
      "Times Square",
      "Spaga's Last Stand",
      "Who's in Charge",
      "Space Train",
      "One Chance to Save the World",
      "To Be Continued...",
    ],
  },
  {
    name: "Bellevue Wrecking Crew",
    initial: "BWC",
    gradient: "from-amber-400 to-orange-500",
    description:
      'A fictionalized gang of teenage pickpockets whose legend inspires The Disco Biscuits\' New Year\'s Eve "gag." The band performs "Times Square" as an imagined hype anthem for this notorious crew.',
    songs: [],
  },
  {
    name: "The Queen's Advisers",
    initial: "QA",
    gradient: "from-red-400 to-purple-500",
    description:
      "Political figures in the Polyfuzian court who resent the Prince's favored status. When the JP-8000 disappears, they seize the opportunity to consolidate power by declaring the Captain dead.",
    songs: [],
  },
];

const storyParts = [
  {
    part: "Prologue",
    title: "Backstory",
    songs: [] as string[],
    content: [
      "Polyfuzia is a planet in a distant galaxy and home to an advanced, electronically evolved humanoid species known as the Polyfuzians, ruled by a singular Queen. The planet's atmosphere is charged with electricity due to a crystallized mineral in the planet's crust called polyfuzaline, which releases energy into the air. The electricity produced by this mineral powers everything on the planet, from its cities to its starships, and the Polyfuzians have evolved to channel its current through bio-electric tendrils where hands would be on humans.",
      'The same connection can be misused. If a Polyfuzian plugs their tendrils directly into a raw polyfuzaline crystal, an act known in slang terms as "taking fuzzies," they become "shocked," entering an extremely intense psychedelic state.',
      "The Queen's son, a brilliant but reckless and underachieving Captain, commands the specimen-collection starship JP-8000, powered by a massive polyfuzaline core. His mission is to discover alien life and return proof of it to his mother as a test of worthiness to inherit the throne.",
      "The JP-8000 houses an advanced piece of alien machinery called the Freeze, which uses concentrated electricity to super-cool the water around an island landmass and flash-freeze all specimens on it.",
      "The task itself is not difficult, as Polyfuzians have been exploring the stars for millennia, but the Captain and his crew have lost their way. They are flying fast and living recklessly, heading toward the messy end of an intergalactic bender. Buckling under the weight of royal expectations, they spend their time taking fuzzies and getting shocked off the crystal, frying their circuits and blasting themselves into a psychedelic stupor.",
      'Teetering on the edge of collapse, but loyal to each other to the end, our story begins somewhere in deep space with "Shocked!"',
    ],
  },
  {
    part: "Part 1",
    title: "Shocked",
    songs: ["Shocked!"],
    content: [
      'The opening song is sung by the Captain, wild-eyed and unraveling at the end of an extended bender. He and his crew are drifting through outer space together aboard the JP-8000, their camaraderie evident even as they spiral. They have been repeatedly "taking fuzzies," plugging their bio-electric tendrils into the ship\'s polyfuzaline core to trigger an intense psychedelic experience, a mental state they call "Shocked!".',
      "As the crew drifts aimlessly through space, high on electrical intoxication, their unraveling sanity mirrors the physical strain on the JP-8000 itself; its hull cracking and windshield fracturing under erratic piloting. Because Polyfuzians interface with technology through their tendrils, the ship's performance is tied directly to the Captain's mind. His instability amplifies the ship's erratic behavior, and the ship's strain pushes him closer to collapse. A feedback loop spiraling toward disaster.",
      "\"Shocked!\" sets the tone for Revolution in Motion: a crew of talented but underachieving misfits partying their way through the cosmos, an empire's heir who'd rather get high than rule, and a mission that's gone completely off the rails.",
    ],
  },
  {
    part: "Part 2",
    title: "The Wormhole",
    songs: ["The Wormhole", "Twisted in the Road"],
    content: [
      "While the crew of the JP-8000 continue taking fuzzies, an undetected wormhole appears in their flight path. What happens next becomes one of the enduring mysteries of the Polyfuzian chronicles. Some accounts claim that the Captain, too shocked to think clearly, accidentally steered the ship into the anomaly. Others suggest that he made a conscious and defiant choice to confront the unknown.",
      '"The Wormhole" represents the Captain\'s psychedelic inner thoughts as the ship careens through the anomaly. Light collapses into darkness, and the JP-8000 emerges intact but adrift above an unfamiliar blue planet: Earth. The crew, shaken but alive, realize they have survived, while the Captain lies unconscious, trapped in a coma.',
      "Back on Polyfuzia, the Queen's Advisers report that the JP-8000 has disappeared from all tracking systems. Seizing the opportunity to consolidate power, they tell the Queen that her son has perished. Refusing to believe them, she steps onto her palace veranda and gazes toward the stars.",
      '"Twisted in the Road" is sung by the Queen and expresses her mixture of grief and faith. She references the Prince\'s history of getting himself into trouble yet always finding a way to survive.',
    ],
  },
  {
    part: "Part 3",
    title: "Another Plan of Attack",
    songs: ["Another Plan of Attack"],
    content: [
      "The JP-8000 drifts silently in orbit around Earth. With the Captain still in a coma, the remaining officers begin analyzing transmissions from the surface. Their curiosity turns to fascination, especially with the strange human appendages called hands, which the Polyfuzians never evolved.",
      "The crew begin to rationalize a plan to redeem themselves. They focus their attention on Manhattan, and learn that the inhabitants will soon be gathering for New Year's Eve. The fact that Manhattan is an island makes it an ideal target for the Freeze.",
      'During their scans the crew also discover The Disco Biscuits, who are scheduled to perform in Times Square that night. The crew is mesmerized by the idea of electronic music being played with physical instruments and human hands. The concept of a "band" is entirely new to them.',
      "When the Captain finally regains consciousness, the First Mate leads the crew in explaining what has happened. \"Another Plan of Attack\" is sung by the First Mate and crew as they appeal to the Captain's desire to achieve his legacy. By the song's end, the Captain agrees. The JP-8000 begins preparations for the Freeze.",
    ],
  },
  {
    part: "Part 4",
    title: "The Freeze",
    songs: ["Times Square", "Freeze"],
    content: [
      'The next act unfolds simultaneously above and below Earth. "Times Square" and "Freeze" occur at the same moment, parallel hype anthems for two groups on the brink of collision: The Disco Biscuits performing underground in Manhattan, and the Polyfuzian crew preparing to unleash the Freeze from orbit.',
      "Below ground, The Disco Biscuits are onstage at the Palladium Times Square, playing their annual New Year's Eve show. The gag draws inspiration from a sensational news story: a gang of teenage pickpockets calling themselves the Bellevue Wrecking Crew of NYC.",
      'High above, the Captain delivers precise, methodical commands as the crew prepares to fire the weapon. In contrast to "Shocked," which depicts the Captain lost at the end of a purposeless bender, "Freeze" presents him as confident, sober, and determined.',
      "As both groups count down, the moment arrives. Below, fireworks erupt and confetti falls. Above, a massive pulse of blue-white energy streaks through the atmosphere. In an instant, New York City stands suspended, arms raised and smiles frozen, the world turned to stillness.",
    ],
  },
  {
    part: "Part 5",
    title: "The Tourists",
    songs: ["Tourists (Rocket Ship)", "Spaga's Last Stand"],
    content: [
      'With the Freeze complete, the Captain dispatches a retrieval unit to the surface. "Tourists (Rocket Ship)" captures the irony of their mission: visitors wandering through a world preserved in stillness, collecting "souvenirs." The retrieval team moves cautiously through Times Square, attaching transponders to select humans for transport.',
      "Below ground at the Palladium, the power cuts out completely. The band huddles together backstage, realizing something far beyond a technical glitch has occurred. \"Spaga's Last Stand\" chronicles the band's decision to confront the unknown. Keyboardist Aron Magner (Spaga) senses that their music may be their only defense.",
      "The band ascends the venue's iconic escalators and bursts through the lobby doors into a frozen world. A burst of energy surges through the plaza as the band strikes a single note. Beams of light shoot from the transponders, enveloping the band and the tagged humans nearby. Within seconds, all are pulled upward in a cascade of blue light, vanishing into the JP-8000.",
    ],
  },
  {
    part: "Part 6",
    title: "The Deal",
    songs: ["Who's in Charge", "The Deal"],
    content: [
      'The band awakens inside the JP-8000. Disoriented but defiant, they reach for their instruments and demand answers. "Who\'s in Charge," its opening line, functions both literally and metaphorically as a direct challenge to authority.',
      "When the band begins to play, panels glow, lights flicker, and the polyfuzaline core vibrates in resonance with their rhythm. The vessel itself reacts to the sound. The Captain feels the music vibrate through the ship. He is b'gocked, the overwhelming moment when a piece of music permanently shifts how one hears everything that follows.",
      'In "The Deal," the Captain makes the band an offer they can\'t refuse. He promises to unfreeze Earth if the Biscuits accompany him to Polyfuzia to perform for the Queen. To survive the journey, they must undergo DNA transference, becoming biologically part Polyfuzian.',
      "Submerged in conductive water, the band endures an electrifying ritual that merges their biology with the Captain's. Back on Earth, time resumes. Fireworks complete their arc and the frozen awaken.",
    ],
  },
  {
    part: "Part 7",
    title: "One Chance to Save the World",
    songs: ["Space Train", "One Chance to Save the World", "Why We Dance"],
    content: [
      'The JP-8000 departs Earth\'s orbit in a blaze of light. "Space Train" begins as the ship accelerates toward the wormhole, part celebration and part reflection. For The Disco Biscuits, it becomes a moment of introspection. After thirty years of wild highs and devastating lows, they have jammed their way from small Earth venues to the far reaches of the galaxy.',
      'Safely through the wormhole, the planet Polyfuzia shines brilliantly in the distance. The band performs "One Chance to Save the World" as their introduction to Polyfuzia. As the performance grows, the band\'s irreverent humor breaks through. Their first question to the Queen, delivered mid-song: "Unlock the secret if you answer one question, where you keepin\' all the weed in this town?"',
      'The court erupts in laughter. Even the Queen smiles. In "Why We Dance," the chorus becomes an anthem for the entire planet. The Queen embraces her son and thanks The Disco Biscuits for giving him and their world new life. The Captain has fulfilled his mission not through conquest, but through the discovery of art.',
    ],
  },
  {
    part: "Part 8",
    title: "To Be Continued",
    songs: ["To Be Continued..."],
    content: [
      "The celebration on Polyfuzia lasts for days. The Queen's son stands beside her, no longer the reckless Prince who vanished through a wormhole, but a ruler reborn through discovery.",
      "But even as joy fills the planet, tension brews beneath its surface. The Queen's Advisers watch the celebrations in silence. The polyfuzaline energy in the atmosphere begins to flicker and pulse in shades of red.",
      "When the festivities end, the Queen grants the band safe passage home aboard the JP-8000. Inside the ship, the band looks out the viewport in silence. They do not know whether they will survive the return trip through the wormhole, what year it will be when they reach Earth, or what will have become of their families.",
      '"To Be Continued..." closes the opera in a tone of reflective wonder. As the music fades, the JP-8000 disappears towards the wormhole. Behind it, the red glow of Polyfuzia expands across the planet\'s surface, a world forever changed by discovery, love, and unintended revolution.',
      "To be continued...",
    ],
  },
];

const tracklist = [
  "Shocked!",
  "The Wormhole",
  "Twisted in the Road",
  "Another Plan of Attack",
  "Times Square",
  "Freeze",
  "Tourists (Rocket Ship)",
  "Spaga's Last Stand",
  "Who's in Charge",
  "The Deal",
  "Space Train",
  "One Chance to Save the World",
  "Why We Dance",
  "To Be Continued...",
];

const glossary = [
  { term: "Polyfuzia", definition: "Alien homeworld powered by crystalline electrical energy." },
  {
    term: "Polyfuzians",
    definition: "Humanoid species evolved to interface with electricity through bio-electric tendrils.",
  },
  {
    term: "Polyfuzaline",
    definition:
      "Hyperconductive mineral generating planetary energy; also the source of psychedelic effects when directly tapped.",
  },
  {
    term: "Taking fuzzies",
    definition: "Plugging tendrils directly into raw polyfuzaline to induce intense psychedelic states.",
  },
  { term: "Getting shocked", definition: "Entering the euphoric, overwhelming trance produced by fuzzies." },
  {
    term: "B'gocked",
    definition:
      "A transcendent musical awakening; a mind-altering epiphany when the Disco Biscuits' music is so good that everything changes.",
  },
  {
    term: "The Freeze",
    definition:
      "Flash-freezing technology for specimen collection. Uses concentrated electricity to super-cool the water around an island landmass.",
  },
  {
    term: "The Crystal",
    definition:
      'Polyfuzaline generator powering the JP-8000, the Freeze, and the main source of "fuzzies" on the ship.',
  },
  { term: "The Wormhole", definition: "Interstellar anomaly transporting the JP-8000 between star systems." },
  {
    term: "Electric DNA Transference",
    definition: "Ritual merging human biology with Polyfuzian energy so Earthlings can survive wormhole travel.",
  },
  { term: "The JP-8000", definition: "Polyfuzian specimen-collection starship commanded by the Captain." },
];

const places = [
  {
    name: "Polyfuzia",
    description:
      "Electrically evolved alien world ruled by the Queen. The planet's atmosphere is charged with polyfuzaline energy that powers everything from cities to starships.",
  },
  {
    name: "The JP-8000",
    description:
      "Specimen-collection starship commanded by the Captain. Powered by a massive polyfuzaline core, the ship reacts biologically to music.",
  },
  {
    name: "Times Square, NYC",
    description: "Site of The Disco Biscuits' New Year's Eve show and ground zero for the Freeze.",
  },
  {
    name: "Palladium Times Square",
    description:
      "Underground venue shielded from the Freeze by its deep-subterranean location. The band ascends its iconic escalators to confront the aliens.",
  },
  { name: "The Wormhole", description: "Cosmic anomaly that transports the JP-8000 between Polyfuzia and Earth." },
];

/**
 * Service URLs are kept as direct deep-links (no song.link wrapper)
 * because Odesli's ISRC-fingerprint match can't pair these albums'
 * Spotify and Apple Music releases — going through the chooser would
 * silently drop whichever side it can't resolve. Direct links always
 * land somewhere.
 */
const albumLinks: Array<{
  label: string;
  spotify?: string;
  appleMusic?: string;
  youtube?: string;
  songLink?: string;
}> = [
  {
    label: "Studio Album",
    spotify: "https://open.spotify.com/album/0uPgoCXqTnQHJG3DZIJsHw?si=tOGABWMRRwWha_b5FXjwgQ",
    appleMusic: "https://music.apple.com/us/album/revolution-in-motion/1728324671",
    youtube: "https://youtu.be/u7zLw5bxFBo?list=PLGwX3lC4qIF1wHftTP21qVuujFo3gTbJv",
    songLink: "https://album.link/i/1728324671",
  },
  {
    label: "Live at Webster Hall",
    spotify: "https://open.spotify.com/album/0rGWjTzqLiOrLK4vbeemap?si=S6msCxqXR0auGtY7vHJOkA",
    appleMusic:
      "https://music.apple.com/us/album/revolution-in-motion-live-3-29-2024-webster-hall-new-york-ny/1805195096",
    songLink: "https://album.link/i/1805195096",
  },
  {
    label: "Instrumental",
    spotify: "https://open.spotify.com/album/5BfTU8jKekyoZ9Pzo05TrR?si=54IWEib1Sy-c56TMk1mTcA",
    appleMusic: "https://music.apple.com/us/album/revolution-in-motion-the-instrumentals-instrumental/1811777941",
    songLink: "https://album.link/i/1811777941",
  },
  {
    label: "Comic Film",
    youtube: "https://youtu.be/vD-VmObIg5M",
  },
];

// Podcast — pod.link routes the listener to whichever podcast app they
// prefer (Apple Podcasts, Spotify, Overcast, etc.), so a single icon
// link per episode is enough.
const podcastEpisodes: Array<{ label: string; url: string }> = [
  { label: "TDAD Ep. 1", url: "https://pod.link/1460530534/episode/NjVhZDYwNzQyZTY0MTQwMDE2ZjExYzcy" },
  { label: "TDAD Ep. 2", url: "https://pod.link/1460530534/episode/NjVkMmJmMDgyMTNjMzAwMDE4NmE0Mzhi" },
  { label: "TDAD Ep. 3", url: "https://pod.link/1460530534/episode/NjVmNzg0ZWY0N2RhZGYwMDE3ZGQ1ZTFm" },
  { label: "TDAD Ep. 4", url: "https://pod.link/1460530534/episode/NjYwOWZjZmQ4NGQzOGEwMDE2YWY2NDY5" },
  { label: "TDAD Ep. 5", url: "https://pod.link/1460530534/episode/NjYxNGMyZmU3MTA1ZWMwMDE2NjQ0MGQx" },
];

// ─── Icons ───────────────────────────────────────────────────────────────────

function ServiceIconLink({ domain, href, label }: { domain: string; href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="shrink-0 rounded p-1 hover:bg-purple-500/20 transition-colors"
    >
      <img src={faviconSrc(domain)} alt="" className="h-4 w-4" />
    </a>
  );
}

const songSlugs: Record<string, string> = {
  "Shocked!": "shocked",
  "The Wormhole": "wormhole",
  "Twisted in the Road": "twisted-in-the-road",
  "Another Plan of Attack": "another-plan-of-attack",
  "Times Square": "times-square",
  Freeze: "freeze",
  "Tourists (Rocket Ship)": "tourists-rocket-ship",
  "Spaga's Last Stand": "spaga-s-last-stand",
  "Who's in Charge": "who-s-in-charge",
  "The Deal": "the-deal",
  "Space Train": "space-train",
  "One Chance to Save the World": "a-chance-to-save-the-world",
  "Why We Dance": "why-we-dance",
  "To Be Continued...": "to-be-continued",
};

// ─── Components ──────────────────────────────────────────────────────────────

function SongBadge({ name }: { name: string }) {
  const slug = songSlugs[name];
  const badge = (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-tertiary/10 border border-brand-tertiary/25 px-2.5 py-1 text-sm text-brand-tertiary hover:bg-brand-tertiary/20 transition-colors">
      <span className="text-xs">&#9835;</span>
      {name}
    </span>
  );
  if (slug) {
    return <Link to={`/songs/${slug}?tab=lyrics`}>{badge}</Link>;
  }
  return badge;
}

function StoryCard({ part, index }: { part: (typeof storyParts)[number]; index: number }) {
  const isEven = index % 2 === 0;
  return (
    <div className="relative">
      {/* Connector diamond */}
      {index > 0 && (
        <div className="flex justify-center -mt-3 mb-3">
          <div className="w-3 h-3 rotate-45 bg-brand-primary/30 border border-brand-primary/40" />
        </div>
      )}
      <div className="relative overflow-hidden rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 to-purple-900/10 backdrop-blur-sm">
        {/* Gradient accent bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-[3px] ${
            isEven
              ? "bg-gradient-to-r from-brand-primary to-brand-tertiary"
              : "bg-gradient-to-r from-brand-tertiary to-brand-primary"
          }`}
        />
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-semibold tracking-[3px] text-purple-400/70 uppercase">{part.part}</span>
              <h3 className="text-2xl md:text-3xl font-bold text-purple-100 font-[Rajdhani] tracking-wide mt-0.5">
                {part.title}
              </h3>
            </div>
            {part.songs.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {part.songs.map((song) => (
                  <SongBadge key={song} name={song} />
                ))}
              </div>
            )}
          </div>
          {/* Content */}
          <div className="space-y-3 text-content-text-secondary leading-relaxed text-base md:text-lg">
            {part.content.map((paragraph, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static content
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CharacterCard({ character }: { character: (typeof characters)[number] }) {
  return (
    <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 to-purple-900/10 p-5 md:p-6">
      <div
        className={`w-12 h-12 rounded-full bg-gradient-to-br ${character.gradient} flex items-center justify-center text-sm font-bold text-purple-950 mb-3`}
      >
        {character.initial}
      </div>
      <h4 className="text-lg font-bold text-purple-100 mb-2 font-[Rajdhani] tracking-wide">{character.name}</h4>
      <p className="text-base text-content-text-secondary leading-relaxed mb-3">{character.description}</p>
      {character.songs.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {character.songs.map((song) => (
            <SongBadge key={song} name={song} />
          ))}
        </div>
      )}
    </div>
  );
}

function GlossaryPill({ item }: { item: (typeof glossary)[number] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setExpanded(!expanded)}
      className={`text-left transition-all duration-200 rounded-full border px-4 py-2 text-base ${
        expanded
          ? "bg-brand-tertiary/15 border-brand-tertiary/30 text-brand-tertiary rounded-2xl"
          : "bg-brand-tertiary/8 border-brand-tertiary/20 text-brand-tertiary/80 hover:bg-brand-tertiary/12 hover:border-brand-tertiary/30"
      }`}
    >
      <span className="font-medium">{item.term}</span>
      {expanded && (
        <span className="block text-sm text-content-text-secondary mt-1 font-normal">{item.definition}</span>
      )}
    </button>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

const RevolutionInMotion: React.FC = () => {
  const { performances, externalSources } = useSerializedLoaderData<RockOperaPerformancesLoaderData>();
  return (
    <div className="space-y-10 md:space-y-14">
      {/* ── Hero Banner ── */}
      <div className="relative -mx-4 md:-mx-0 overflow-hidden rounded-none md:rounded-2xl">
        <div className="relative h-[200px] md:h-[300px]">
          <img
            src="https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/revolution-in-motion.png"
            alt="The Disco Biscuits - Revolution in Motion"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(240,10%,3.9%)] via-[hsl(240,10%,3.9%)]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
            <h1 className="font-[Audiowide] text-2xl md:text-4xl text-white tracking-wider">REVOLUTION IN MOTION</h1>
            <p className="text-purple-300/80 text-base md:text-lg mt-1 font-[Rajdhani] tracking-wide">
              A Science-Fiction Rock Opera by The Disco Biscuits
            </p>
          </div>
        </div>
      </div>

      {/* ── Intro + Listen ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4 text-content-text-secondary leading-relaxed text-base md:text-lg">
          <p>
            <strong className="text-content-text-primary">Revolution in Motion</strong> is a concept album and rock
            opera from The Disco Biscuits. Created by guitarist and lead singer Jon Gutwillig with longtime friend and
            collaborator Joey Friedman, and written with keyboardist Aron Magner, the project fuses the band's
            "jamtronic" sound with a story that moves in one continuous arc across fourteen songs.
          </p>
          <p>
            Produced by Cloudchord and released on March 29, 2024, the story takes place in an alternate timeline and
            follows a black sheep alien prince and his crew as they stumble through the universe, collide with humanity,
            and fall for a band and a music powerful enough to rewrite their future and alter the course of the
            universe.
          </p>
        </div>
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 to-purple-900/10 p-5">
            <h3 className="text-base font-semibold tracking-[3px] text-purple-400/70 uppercase mb-4">Listen & Watch</h3>
            <div className="grid grid-cols-1 sm:grid-cols-[3fr_2fr] gap-4">
              <div className="space-y-2">
                {albumLinks.map((album) => (
                  <div
                    key={album.label}
                    className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-purple-500/10 bg-purple-950/30 px-3 py-2.5 text-sm text-purple-200"
                  >
                    <span className="truncate">{album.label}</span>
                    {/* ml-auto so the icon group stays right-aligned
                        whether it sits on the same line as the label
                        or wraps to its own line. */}
                    <div className="ml-auto flex items-center gap-0.5 shrink-0">
                      {album.spotify && (
                        <ServiceIconLink
                          domain={EXTERNAL_SOURCE_DOMAINS.spotify}
                          href={album.spotify}
                          label={`${album.label} on Spotify`}
                        />
                      )}
                      {album.appleMusic && (
                        <ServiceIconLink
                          domain={EXTERNAL_SOURCE_DOMAINS.appleMusic}
                          href={album.appleMusic}
                          label={`${album.label} on Apple Music`}
                        />
                      )}
                      {album.youtube && (
                        <ServiceIconLink
                          domain={EXTERNAL_SOURCE_DOMAINS.youtube}
                          href={album.youtube}
                          label={`${album.label} on YouTube`}
                        />
                      )}
                      {album.songLink && (
                        <ServiceIconLink
                          domain={EXTERNAL_SOURCE_DOMAINS.songLink}
                          href={album.songLink}
                          label={`${album.label} on other services`}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* 2 columns on mobile (panel is full-width below the
                  albums so two short "TDAD Ep. N" labels fit comfortably
                  per row), single column at sm+ where the panel is the
                  narrow right side and there's no room to pair them. */}
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                {podcastEpisodes.map((episode) => (
                  <a
                    key={episode.url}
                    href={episode.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-lg border border-purple-500/10 bg-purple-950/30 px-3 py-2.5 text-sm text-purple-200 hover:border-purple-500/30 hover:bg-purple-900/20 transition-colors"
                  >
                    <Podcast className="w-4 h-4 text-purple-300 shrink-0" aria-label="Podcast" />
                    <span className="truncate">{episode.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Table of Contents ── */}
      <nav
        aria-label="Page contents"
        className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-950/30 to-purple-900/5 p-5 md:p-6"
      >
        <h2 className="text-base font-semibold tracking-[4px] text-purple-400/60 uppercase mb-4">Contents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-base">
          <a href="#characters" className="text-brand-primary hover:text-brand-secondary">
            Characters
          </a>
          <a href="#tracklist" className="text-brand-primary hover:text-brand-secondary">
            Track Listing
          </a>
          <a href="#places" className="text-brand-primary hover:text-brand-secondary">
            Places
          </a>
          <a href="#glossary" className="text-brand-primary hover:text-brand-secondary">
            Glossary
          </a>
          <a href="#background" className="text-brand-primary hover:text-brand-secondary">
            Background & Development
          </a>
          <a href="#releases" className="text-brand-primary hover:text-brand-secondary">
            Releases
          </a>
          <a href="#full-performances" className="text-brand-primary hover:text-brand-secondary">
            Full Performances
          </a>
          <div>
            <a href="#the-story" className="text-brand-primary hover:text-brand-secondary font-medium">
              The Story
            </a>
            <ul className="mt-1.5 ml-3 space-y-1 text-sm text-content-text-secondary">
              {storyParts.map((part) => (
                <li key={part.title}>
                  <a href={`#rim-${slugifyAnchor(part.title)}`} className="hover:text-brand-secondary">
                    {part.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* ── Characters ── */}
      <section id="characters" className="scroll-mt-20">
        <h2 className="text-base font-semibold tracking-[4px] text-purple-400/60 uppercase mb-5">Characters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((char) => (
            <CharacterCard key={char.name} character={char} />
          ))}
        </div>
      </section>

      {/* ── The Story ── */}
      <section id="the-story" className="scroll-mt-20">
        <h2 className="text-base font-semibold tracking-[4px] text-purple-400/60 uppercase mb-5">The Story</h2>
        <div className="space-y-4">
          {storyParts.map((part, i) => (
            <div key={part.title} id={`rim-${slugifyAnchor(part.title)}`} className="scroll-mt-20">
              <StoryCard part={part} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Reference Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tracklist */}
        <div
          id="tracklist"
          className="scroll-mt-20 rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 to-purple-900/10 p-5"
        >
          <h3 className="text-base font-semibold tracking-[3px] text-purple-400/70 uppercase mb-4">Track Listing</h3>
          <ol className="space-y-1.5">
            {tracklist.map((track, i) => (
              <li key={track} className="flex items-baseline gap-3 text-base">
                <span className="text-brand-tertiary font-mono text-sm w-5 text-right">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-content-text-primary">{track}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Places */}
        <div
          id="places"
          className="scroll-mt-20 rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 to-purple-900/10 p-5"
        >
          <h3 className="text-base font-semibold tracking-[3px] text-purple-400/70 uppercase mb-4">Places</h3>
          <div className="space-y-4">
            {places.map((place) => (
              <div key={place.name}>
                <h4 className="text-base font-bold text-purple-200">{place.name}</h4>
                <p className="text-sm text-content-text-secondary mt-1 leading-relaxed">{place.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Glossary ── */}
      <section id="glossary" className="scroll-mt-20">
        <h2 className="text-base font-semibold tracking-[4px] text-purple-400/60 uppercase mb-4">Glossary</h2>
        <p className="text-sm text-content-text-tertiary mb-4">Tap a term to see its definition</p>
        <div className="flex flex-wrap gap-2">
          {glossary.map((item) => (
            <GlossaryPill key={item.term} item={item} />
          ))}
        </div>
      </section>

      {/* ── Background & Development ── */}
      <section
        id="background"
        className="scroll-mt-20 rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 to-purple-900/10 p-5 md:p-8"
      >
        <h2 className="text-base font-semibold tracking-[4px] text-purple-400/60 uppercase mb-6">
          Background & Development
        </h2>
        <div className="space-y-8 text-content-text-secondary leading-relaxed text-base md:text-lg">
          <div>
            <h3 className="text-lg font-bold text-purple-100 font-[Rajdhani] tracking-wide mb-3">Origins</h3>
            <p className="mb-3">
              The concept for Revolution in Motion began on August 21, 2021, after The Disco Biscuits performed at
              Northlands Live in Swanzey, New Hampshire. After the show, in a small backstage trailer, Jon Gutwillig
              told friend Joey Friedman that the band needed new material. Friedman suggested creating another rock
              opera, which led to an improvised brainstorming session using the "yes, and..." technique popularized in
              improv comedy.
            </p>
            <p>
              The initial concept involved a New Year's Eve concert at the Palladium Theater in Times Square. As the
              idea developed, it shifted toward an alien-invasion narrative involving a young, discontented alien
              prince, his crew, a spaceship thrown through a wormhole, and a species that did not have hands. The story
              concluded with The Disco Biscuits saving Earth by traveling to the prince's home planet and becoming the
              biggest band in space.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-purple-100 font-[Rajdhani] tracking-wide mb-3">Writing Process</h3>
            <p className="mb-3">
              All fourteen songs were written in eleven long weekends from March through December 2022 at Gutwillig's
              home studio outside of Philadelphia. The songs were not written in narrative order.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-base">
              {[
                ["March 2022", "Another Plan of Attack, Twisted in the Road, One Chance to Save the World"],
                ["April/May 2022", "Shocked!, Freeze, Who's in Charge, Tourists, Space Train"],
                ["July 2022", "The Wormhole, Times Square"],
                ["Early Fall 2022", "Why We Dance, To Be Continued..."],
                ["Nov/Dec 2022", "Spaga's Last Stand, The Deal"],
              ].map(([period, songs]) => (
                <div key={period} className="rounded-lg border border-purple-500/10 bg-purple-950/30 px-3 py-2">
                  <span className="text-sm font-semibold text-purple-300">{period}</span>
                  <span className="block text-sm text-content-text-tertiary mt-0.5">{songs}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-purple-100 font-[Rajdhani] tracking-wide mb-3">
              Song Debuts & Singles
            </h3>
            <p className="mb-3">
              The Disco Biscuits began introducing the material live throughout 2022. "Freeze" premiered in May 2022,
              and by the end of that year all fourteen songs had debuted live, culminating with "The Deal" and "Spaga's
              Last Stand" during the band's New Year's Eve 2022 performances in Chicago.
            </p>
            <div className="flex flex-wrap gap-2 text-sm">
              {[
                ["Who's in Charge", "Jul '22"],
                ["Twisted in the Road", "Aug '22"],
                ["Tourists", "Sep '22"],
                ["The Wormhole", "Oct '22"],
                ["Another Plan of Attack", "Dec '22"],
                ["Shocked!", "Feb '23"],
              ].map(([song, date]) => (
                <span
                  key={song}
                  className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/15 bg-purple-950/40 px-3.5 py-1.5"
                >
                  <span className="text-purple-200">{song}</span>
                  <span className="text-purple-400/60">{date}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Releases ── */}
      <section id="releases" className="scroll-mt-20">
        <h2 className="text-base font-semibold tracking-[4px] text-purple-400/60 uppercase mb-5">
          Releases & Performances
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Studio Album",
              year: "March 29, 2024",
              detail:
                "Produced by Cloudchord. 14 tracks. First full live performance at Webster Hall, NYC on release day.",
            },
            {
              title: "Live at Webster Hall",
              year: "2025",
              detail:
                "Recording of the March 29, 2024 performance. Features guest vocalists Erin Boyd and Matteo Scammell.",
            },
            {
              title: "Instrumental",
              year: "2025",
              detail: "Instrumental versions of all 14 tracks. Completes the trilogy: studio, live, and instrumental.",
            },
            {
              title: "Comic Film",
              year: "March 29, 2024",
              detail: "25-minute comic-book-style animated video created with Blunt Action. Features four songs.",
            },
          ].map((release) => (
            <div
              key={release.title}
              className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 to-purple-900/10 p-4"
            >
              <span className="text-xs font-semibold tracking-widest text-brand-tertiary">{release.year}</span>
              <h4 className="text-lg font-bold text-purple-100 font-[Rajdhani] tracking-wide mt-1 mb-2">
                {release.title}
              </h4>
              <p className="text-sm text-content-text-secondary leading-relaxed">{release.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Full Performances ── */}
      <section id="full-performances" className="scroll-mt-20">
        <h2 className="text-base font-semibold tracking-[4px] text-purple-400/60 uppercase mb-5">Full Performances</h2>
        <div className="space-y-1">
          <SetlistList
            setlists={performances}
            externalSources={externalSources}
            numbered
            collapsible
            empty={<p className="text-sm text-content-text-tertiary">No full performances tagged yet.</p>}
          />
        </div>
      </section>
    </div>
  );
};

export default RevolutionInMotion;
