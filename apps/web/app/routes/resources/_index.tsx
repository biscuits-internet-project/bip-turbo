import type { ReactElement } from "react";
import ResourceCard from "~/components/resources/resource-card";
import { publicLoader } from "~/lib/base-loaders";

export const loader = publicLoader<void>(async () => {});

export function meta() {
  return [
    { title: "Resources | Biscuits Internet Project" },
    {
      name: "description",
      content: "Explore Disco Biscuits resources, including rock operas, side projects, and more.",
    },
  ];
}

export default function Resources(): ReactElement {
  return (
    <div>
      <div className="space-y-6 md:space-y-8">
        <div>
          <h1 className="page-heading">RESOURCES</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-full">
            <ResourceCard
              title="Band History"
              content="From their early days in Philadelphia as 'Zex Sea' to their current lineup as The Disco Biscuits, read more about the band members, who they are, and how they came together."
              image="https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/band.jpg"
              url="/resources/band-history"
            />
          </div>
          <div className="h-full">
            <ResourceCard
              title="Musical Terminology"
              content="Inverted I-Man? Dyslexic Munchkin?? Dub Dribble??? WHAT DOES IT ALL MEAN?"
              image="https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/music.jpg"
              url="/resources/music"
            />
          </div>
          <div className="h-full">
            <ResourceCard
              title="Touchdowns All Day Podcast"
              content="Step inside the mind of Jon Barber as he breaks down jams, interviews guests, and discusses all things Disco Biscuits on Touchdowns All Day w/ Jon Barber."
              image="https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/tdad.jpg"
              url="/resources/touchdowns"
            />
          </div>
          <div className="h-full">
            <ResourceCard
              title="The Hot Air Balloon"
              content="The band's first full length rock opera, written by Jon Gutwillig and debuted at the band's 1998 New Year's Eve show at Silk City in Philadelphia."
              image="https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/hot-air-balloon.jpg"
              url="/resources/hot-air-balloon"
            />
          </div>
          <div className="h-full">
            <ResourceCard
              title="The Chemical Warfare Brigade"
              content="The band's second full length rock opera, written by Marc Brownstein, and debuted Dec 30, 2000 at the Vanderbilt on Long Island."
              image="https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/cwb.jpg"
              url="/resources/chemical-warfare-brigade"
            />
          </div>
          <div className="h-full">
            <ResourceCard
              title="Revolution in Motion"
              content="The band's third rock opera, a sci-fi concept album created by Jon Gutwillig, Joey Friedman, and Aron Magner. Follow a blacksheep alien prince whose collision with humanity rewrites the fate of two worlds."
              image="https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/revolution-in-motion.png"
              url="/resources/revolution-in-motion"
            />
          </div>
          <div className="h-full">
            <ResourceCard
              title="Side Projects"
              content="From Barber and the Laid Back Band to Younger Brother Live and everything in between. And we mean EVERYTHING."
              image="https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/electron.jpg"
              url="/resources/side-projects"
            />
          </div>
          <div className="h-full">
            <ResourceCard
              title="Live Movie Scores"
              content="Akira, Tron, and every other time the band played a set synched to a movie."
              image="https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/akira.jpg"
              url="/resources/movie-scores"
            />
          </div>
          <div className="h-full">
            <ResourceCard
              title="The Perfume"
              content="Don't miss these Disco Biscuits doppelgangers if you have the chance. Performing alternate versions of songs like Devo Frog Legs and surf punk Kitchen Mitts, catching a Perfume set is a rare treat for fans."
              image="https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/drops.jpg"
              url="/resources/perfume"
            />
          </div>
          <div className="h-full">
            <ResourceCard
              title="Tractorbeam"
              content="All things serve the Beam. Debuted in 2007, this Disco Biscuits alter-ego played instrumental versions of tdb originals and covers until reinventing themselves in 2019."
              image="https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/tractorbeam.jpg"
              url="/resources/tractorbeam"
            />
          </div>
          <div className="h-full">
            <ResourceCard
              title="News from Nowhere"
              content="From jambands.com to Rolling Stone, here you'll find all of your favorite Disco Biscuits articles and interviews in one place."
              image="https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/news.jpg"
              url="/resources/media"
            />
          </div>
          <div className="h-full">
            <ResourceCard
              title="Running Mixes"
              content="Stream or download long-form continuous mixes of hand-selected Biscuits jams in mp3 format. These are perfect for the gym, the track, or the trail, and they're also a great way to focus on exceptional jams!"
              image="https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/mixes.jpg"
              url="/resources/mixes"
            />
          </div>
          <div className="h-full">
            <ResourceCard
              title="Think Tank"
              content="Each month, Think Tank Dubs presents The Basement Sessions, two full-length DJ sets blending top-notch Biscuit jams with dub / electronica music for the party people."
              image="https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/think-tank.jpg"
              url="/resources/think-tank"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
