import type React from "react";
import { Link } from "react-router-dom";
import { publicLoader } from "~/lib/base-loaders";

export const loader = publicLoader<void>(async () => {});

export function meta() {
  return [
    { title: "Think Tank Dubs | Biscuits Internet Project" },
    { name: "description", content: "Learn about Think Tank Dubs and The Basement Sessions" },
    { property: "og:image", content: "/public/thinktank.jpg" },
  ];
}

interface SoundCloudLink {
  id: string;
  url: string;
  title: string;
}

const p = ({ children }: { children: React.ReactNode }) => {
  return <div className="mb-4 text-content-text-tertiary">{children}</div>;
};

const ExternalLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-brand-secondary hover:text-hover-accent hover:underline"
  >
    {children}
  </a>
);

export default function ThinkTank() {
  const starterPack: SoundCloudLink[] = [
    {
      id: "great-abyss-white-rabbit",
      url: "https://soundcloud.com/pree-di-dubs/great-abyss-jam-20210206-white-rabbit-peter-power-edit-dj-solomun-live-ibiza-2016?in=pree-di-dubs/sets/think-tank-dubs-selectors-cuts",
      title: "Great Abyss jam (tDB 2021/02/06) > White Rabbit (Peter Power Edit) (DJ Solomun LIVE - Ibiza 2016)",
    },
    {
      id: "everything-in-its-right-place",
      url: "https://soundcloud.com/pree-di-dubs/everything-in-its-right-place-atw-dub-jam-20210717-breaker-breaker-016-20210903?in=pree-di-dubs/sets/think-tank-dubs-selectors-cuts",
      title:
        "Everything in its Right Place (Third Son) > Above the Waves jam (tDB - 2021/07/17) > Breaker, Breaker (Wu-Tang X Khruangbin) (Tom Caruana Remix)",
    },
    {
      id: "babylon-gamma-goblins",
      url: "https://soundcloud.com/pree-di-dubs/babylon-gamma-goblins-2021-07-10-so-much-dub-to-tell?in=pree-di-dubs/sets/think-tank-dubs-selectors-cuts",
      title:
        "Babylon (Pixel) > Gamma Goblins (tDB – 2021/07/10) > So Much Dub To Tell (Ancient Astronauts, Lee Perry, Nas)",
    },
    {
      id: "seven-nation-army",
      url: "https://soundcloud.com/pree-di-dubs/seven-nation-army-birdy-i-i-anthem-2021-02-06?in=pree-di-dubs/sets/think-tank-dubs-selectors-cuts",
      title:
        "Seven Nation Army (J.Pool & Lemurian Edit) > Wings (NuLogic Remix) > I & I (Dr. Meaker Remix) > Dreadtime (RSD remix) > Anthem (tDB - 2021/02/06)",
    },
    {
      id: "great-abyss-spacebird",
      url: "https://soundcloud.com/pree-di-dubs/great-abyss-spacebird-jam-20090305-addict-soul-shakedown-party-afrodisiac-sound-system-remix?in=pree-di-dubs/sets/think-tank-dubs-selectors-cuts",
      title: "Great Abyss jam > SBMC jam (tDB - 2009/03/05) > Addict > Soul Shakedown Party (Afrodisiac Remix)",
    },
    {
      id: "don-man-sound",
      url: "https://soundcloud.com/pree-di-dubs/don-man-sound-j-star-remix-tractorbeam-20191227-made-you-look-smile-davis-remix_pn?in=pree-di-dubs/sets/think-tank-dubs-selectors-cuts",
      title: "Don Man Sound (J Star remix) > Tractorbeam jam (tDB - 2019/12/27) > Made You Look (Smile Davis remix)",
    },
    {
      id: "money-x-cream",
      url: "https://soundcloud.com/pree-di-dubs/money-x-cream-lunar-pursuit-jam-w-kung-confrontation-ending-sc-024-20211231?in=pree-di-dubs/sets/think-tank-dubs-selectors-cuts",
      title:
        "Money Rules Everything Around Me (Wu-Tang X King Tubby) > Money (Horace Andy, Dreadzone remix) > Lunar Pursuit jam w/ Kung samples (Phish – 2011/06/15) > Confrontation ending (tDB – 2021/11/21)",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-content-text-primary mb-6">Think Tank Dubs</h1>

      <div className="bg-content-bg rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-brand-secondary mb-4">The Basement Sessions</h2>

        <p className="text-content-text-secondary mb-6">
          Think Tank Dubs is a monthly livestream called "The Basement Sessions" where the DJ curates a unique set of
          music that blends Disco Biscuits jams with electronic, dub, and hip-hop tracks. The DJ is known for their
          expertise in creating seamless transitions between different genres and for their deep knowledge of music.
        </p>

        <div className="text-content-text-secondary mb-6">
          <div className="mb-2">You can find Think Tank Dubs on:</div>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <ExternalLink href="https://soundcloud.com/pree-di-dubs">SoundCloud</ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.mixcloud.com/thinktankdubs/">Mixcloud</ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.twitch.tv/thinktankdubs">Twitch</ExternalLink>
            </li>
            <li>
              Show announcements and updates on{" "}
              <ExternalLink href="https://twitter.com/thinktankdubs">Twitter</ExternalLink>
              {", "}
              <ExternalLink href="https://facebook.com/thinktankdubs">Facebook</ExternalLink>
              {", "}
              <ExternalLink href="https://instagram.com/thinktankdubs">Instagram</ExternalLink>
            </li>
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-brand mb-3">Think Tank Dubs Starter Pack:</h3>
          <ul className="list-disc pl-6 space-y-3 text-gray-300">
            {starterPack.map((link) => (
              <li key={link.id}>
                <ExternalLink href={link.url}>{link.title}</ExternalLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
