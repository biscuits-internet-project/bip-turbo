import type React from "react";
import { Link } from "react-router-dom";
import { publicLoader } from "~/lib/base-loaders";

export const loader = publicLoader<void>(async () => {});

export function meta() {
  return [
    { title: "The Hot Air Balloon | Biscuits Internet Project" },
    {
      name: "description",
      content:
        "The band's first full length rock opera, written by Jon Gutwillig, and debuted on 12/31/98 at Silk City in Philadelphia.",
    },
    {
      property: "og:image",
      content: "https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/hot-air-balloon.jpg",
    },
  ];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const characters = [
  {
    name: "Corrinado",
    initial: "C",
    gradient: "from-purple-500 to-cyan-400",
    description:
      "An unemployed wayward inventor who bounced aimlessly from idea to idea, until he invented the world's first aircraft, the hot air balloon. He was convinced by Morris Mulberry that the idea could be profitable and that the two of them should start a service shuttling people across the sea in hot air balloons. The business, called Hot Air Balloon Traveling, became successful and attracted the attention of Manilla Trane, the entrepreneur whose capital ran much of the town. Corrinado refused to sell Hot Air Balloon Traveling, and even worse, kindles a romance with Manilla's beautiful wife, Leora of the Sequoias. Manilla forcibly overtook the business and had Corrinado arrested and sentenced for building \"the devil's flying machine.\"",
  },
  {
    name: "Leora of the Sequioas",
    initial: "L",
    gradient: "from-pink-400 to-purple-400",
    description:
      "The young trophy wife of Manilla Trane, known throughout town as a terrific chef. She earned her nickname because of her height as well as the size of her hair, which, according to the townspeople, looked as if were held up by branches. Lack of attention from her husband turned her into an insomniac, and she was often seen late at night staring out the window of the high tower of Manilla's fortress.",
  },
  {
    name: "Manilla Trane",
    initial: "MT",
    gradient: "from-red-400 to-amber-500",
    description:
      "Extraordinarily wealthy entrepreneur whose riches allows him to control the entire town. As a young man, he began to amass his fortune by peddling weapons. He possesses a small army of extremely loyal men who will do his every whim. An avid arts collector, he married Leora of the Sequoias on the steps of his brand new museum. He is known as an extremely demanding and unforgiving tyrant.",
  },
  {
    name: "Morris Mulberry",
    initial: "MM",
    gradient: "from-emerald-400 to-cyan-400",
    description:
      "A somewhat conniving, albeit benevolent, street hustler. He convinced Corrinado that the two of them could start a highly successful business by using Corrinado's hot air balloon invention to shuttle people across the sea. He mysteriously vanished one month after Hot Air Balloon Travelling was destroyed and Corrinado was arrested.",
  },
  {
    name: "Diamond Rigg",
    initial: "DR",
    gradient: "from-amber-400 to-orange-500",
    description:
      "A well known loan-shark and old street friend of Morris Mulberry. He put up the initial capital to start Hot Air Ballon Traveling. A very aloof individual who, according to town rumor, possessed the prototype hot air balloon, which he was given as collateral for his initial investment.",
  },
];

interface SongSection {
  name: string;
  setting: string;
  lyrics: string;
}

const act1: SongSection[] = [
  {
    name: "The Overture",
    setting:
      "High noon - townsfolk fill the center square for lunch. There is much commotion. Horse-drawn carriages line the outer streets. Merchants are yelling their pitches into the crowd. Street performers are miming and dancing in front of onlookers. The echoing sound of the street charmer's horn can be heard ricocheting off of the buildings.",
    lyrics: "",
  },
  {
    name: "Once the Fiddler Paid",
    setting:
      "Corrinado sits alone in his prison cell, staring out the tiny barred window, over the jagged cliffs, and out to the sea beyond. The noon sun is high, the sky is clear and a comfortable summer wind blows through his cell. He thinks about Leora, his lost loved one, and he is plagued by the haunting vision of his fate.",
    lyrics: `Summer Sunny day, once the wind blew warm
and the light circled round the sun I saw like a crown
you could feel it in the air, like a not so distant storm
and the silent pause in the wind it seemed
left a magical sound

But now she's gone & I vowed to miss her
days that we spent starry eyed run deep within my soul
& now she's gone & I can't dismiss her
nor can I forget the man who sent me down below

Summer sunny day, once the wind blew cold
and the world had seen a better day all around
my life was ripped away, my business torn & sold
and I found myself in this cell I live
with a clamouring sound

But now she's gone & I vowed to miss her
days that we spent starry eyed run deep within my soul
& now she's gone & I can't dismiss her
nor can I forget the man who sent me down below

Summer sunny day, once the wind blew thorns
and the world had seen a better day all around
you could feel it in the air, like a not so distant storm
and the days once lost but still recalled can be found
Once the fiddler paid, but once was not enough
was all who cornered his misfortune yelled
the fiddler took the blame, the crowd had called his bluff
when all was lost the verdict came to the silence of the crowd

But now she's gone & I vowed to miss her
days that we spent starry eyed run deep within my soul
& now she's gone & I can't dismiss her
nor can I forget the man who sent me down below`,
  },
  {
    name: "The Very Moon",
    setting:
      "The scene moves to Manilla's estate, before the arrest of Corrinado. We catch a glimpse of the relationship between Manilla and Leora. Manilla has reaped the rewards of many succesfull buisness enterprises. He works too hard to pay attention to his wife Leora, needing her only as a chef. Manilla invites Corrinado and Mulberry over for dinner in order to discuss the propositon of buying Hot Air Balloon Traveling. Corrinado and Mulberry are not willing to part with the business. As the scene ends, it becomes clear that Corrinado and Leora are enamored with one another, leaving Leora wondering whether Corrinado is the man to fly her far, far away.",
    lyrics: `Manilla, a crude machine, had taken his fair share
He gobbled up the world he owned as petals paved his stairs
Manilla thanked the very moon for money and his life
He triffled nothing miniscule including one, his wife
Leora, his arranged wife, did not need his greed
She asked that stars, the very moon, to one day cross the sea
Manilla gazed an empty stare nothing there could grow
She cherished dreams of flying high and leaving him below

Leora stands on her head
Doin' the two step on her hands
As her eyes move round the room
To catch somone watching
Leora stands on her head
Doin' the two step on her hands
Underneath the very moon each one was watching

Manilla wanted worldly things and everything he'd have
He built castles, moats, battleships and troops in iron clad
Manilla heard Mulberry's name under the very moon
His troops went running the next day to find the air balloon.
Leora, his arranged wife, cooked the men a feast
And cleaned herself up solemnly before she faced the beast
That night she asked the very moon was this her fate to be
At lunch she met the flying man whose airships crossed the sea

Leora stands on her head
Doin' the two step on her hands
As her eyes move round the room
To catch somone watching
Leora stands on her head
Doin' the two step on her hands
Underneath the very moon each one was watching`,
  },
  {
    name: "Voices Insane",
    setting:
      "The scene shifts back to Corrinado's jail cell, the night before he is to be burned at the stake. Starved and beaten, he has given in to the demons which are living in his mind. He knows that there is little chance to escape his fate, yet he dares the audience to condemn him for what he has done. Half-crazy, he sits alone in his cell dreaming of Leora, laughing aloud at the world which had condemned him.",
    lyrics: `I admit it, I was guilty
But don't you believe it, that I was wrong
I never accepted my relocation
& I'm looking out past them four hours til dawn

I've dreamed of this day since they locked away the key
A prisoner in chains will not make a madman of me
These voices insane are telling me tales from the stars
So I call on the reigns of forces drawn in from afar

The walls have deceived me
I imagined this all on my own
These spirits around me, clouds of dust looking for a new home
When they tap on my shoulder, tell me I got what I deserve
I wave my arms & destroy them
Cause on this day they will eat all their words

I've dreamed of this day since they locked away the key
A prisoner in chains will not make a madman of me
These voices insane are telling me tales from the stars
So I call on the reigns of forces drawn in from afar

I can stop all the voices
and bang on the walls with my fists
But my only chance left
is the one I'd never dimiss
I hear the world through the echos
A song of life through the noise in the crowd
In this cell I've known plainly
That what I want is what is not allowed.

I've dreamed of this day since they locked away the key
A prisoner in chains will not make a madman of me
These voices insane are telling me tales from the stars
So I call on the reigns of forces drawn in from afar`,
  },
  {
    name: "Eulogy",
    setting:
      "The prison guards come to take Corrinado away to be executed. He walks defiantly through the crowd as they taunt and jeer at him. He remains calm and seems completely unmoved. His gaze is fixed on the sky.",
    lyrics: `There's more to the world than what I've seen
There's more to my life than my eulogy
and if I ask my maker for one more day
When all of my chances are slipping away

I hear the bells and I see the clouds
All of the people out thinking aloud
All of the whispers and laughter and calls
People out frantic in search of it all

There's one in a million I'd be here today
There's one in a million that I get to stay
And if I ask my maker to see me through
When it seems there's nothing more that I can do

There's more who will live when gone are my days
and the sands waiting last to be swept away
but I still have time to look to the sky
and search through the clouds for some kind of sign

Bring on the lightning in bolts like a train
Let loose the screams of a mad hurricane
Bring down the water in buckets and all
Shake up the earth where all here will fall

But nothing, no splash, no flash and no sound
all that is left is my feet on the ground
Now I remember that life was a ball
When I was the person in search of it all

There's one in a million I'd be hear today
There's one in a million that I get to stay
And if I ask my maker to see me through
When it seems there's nothing more that I can do`,
  },
];

const act2: SongSection[] = [
  {
    name: "Bazaar Escape",
    setting:
      "Corrinado is strapped to a pole in the center of town. Manilla's troops are preparing the fire. Leora has arranged for his feet to be left untied. At the last moment, he pulls on his ropes with all his might, tearing himself free. He charges into the town bazaar as Manilla's troops pursue. His only chance of escaping is to make for the cliffs and jump into the sea. With a hoard of troops on his heels, he swan dives off the cliff into the sea far below.",
    lyrics: `Corrinado slipped the chopping block
The onlookers in fear & shock
He bolted swiftly through the crowd
The women yelled & screamed aloud
Manilla's words rang through the air
"Kill that man or all Beware!"
Corrinado tookoff all for bust
Gone behind a cloud of dust

Passed on tragedy Corrinado moves with ease
Eluding all authority with his own agility
Ducks down an alley to the center square bazaar
Soldiers yell, soldiers scream, don't let him get too far.

Corrinado hides down an alley
As Manilla's troops begin to rally
He lays behind the street snake charmer
and slips out of his prison pajamas

The Matador, the bull can run
Corrinado sidestepped everyone
Takesoff towards the end of town
Drawing troops from all around
He knows he's got but one way out
His only route without a doubt
be fastest to the mighty cliffs
and jump for his own benefit

Passed on tragedy Corrinado moves with ease
Eluding all authority with his own agility
Ducks down an alley to the center square bazaar
Soldiers yell, soldiers scream, don't let him get too far.

Carooning down the mountain top
A bouncing rock no will can stop
Their chasing our strong hero down
Who dodges trees with swift abounds
He spins the air like a carousel
While dodging shots adeptly till
His steps no longer make a sound
His feet are well above the ground`,
  },
  {
    name: "Mulberry's Dream",
    setting:
      "Corrinado swims through the sea, his only chance of survival is to make it to the island; hoping that Morris Mulberry will be waiting with the prototype hot air balloon, the only one left undestroyed by Manilla. As he swims, he gets delirious from pure physical exhaustion. He thinks back to his friend Mulberry and the beginning of Hot Air Balloon Traveling when Mulberry persuaded him to use his invention to start a successful business.",
    lyrics: `I first caught the sun at noon today
To get another 24 hours
I lept & broke my bedframe
Which the termites have devoured
I lived a life in shambles
With one idea left to scheme
But if I ever built it
then what would I have left to dream?

Mulberry's Dream was talkin to me,
as we kickin' with time.
Burnin' in the sun on the side of the street,
we gotta be out of our minds.
Life, he said, is all about style,
and my flying machine.
And we'll take the people cross miracle miles,
and I believed him

I walked down to the corner
To fetch myself some dollars
I left later that afternoon
When the streets began to hollar
and there I saw O'Farrell
The old street corner pantomime
and I simply could not shake him
till old Mulberry came just in time

Mulberry's Dream was talkin to me,
as we kickin' our time.
Burnin' in the sun on the side of the street,
we gotta be out of our minds.
Life, he said, is all about style,
and my flying machine.
And we'll take the people cross miracle miles,
and I believed him`,
  },
  {
    name: "Above the Waves",
    setting:
      "Mulberry stands alone on the island with the hot air balloon engine burning. He waits all night in hopes that Corrinado will make it. Eventually, he starts to despair, realizing that even if Corinado managed to escape his execution, there is no way that he could make the long swim across the ocean. He gives up all hope of Corrinado's survival, puts out the balloon engine, and sits there in the darkness. Out of the darkness, he hears someone shouting his name in a faint voice. He looks out but still he sees nothing. He thinks that his mind is playing tricks on him, and decides that it is time to move on and start his life anew. He is about to leave when Corrinado's soaking wet figure emerges from the darkness.",
    lyrics: `Above the waves, Going under

Corrinado swam like hell on fire
With jelly arms and beaten bones
He rode the crest, he broke the waves
Trying to get a breath of air for all that he had left to save

Mulberry let the engines burn
The airship lifting off the ground
He watched the sea, could not believe
That he thought Corrinado could be free, his life was now in vain
All was left one chance to fly away
He spun, he heard a gasping sound
But he did not see his friend

After the sun and light were gone
Before he found himself at home
Corrinado swam, fought the waves
Remembering when, a myriad of falls, behind another day
All was left one chance to fly away
just beyond his reach the plan
To reunite them once again

Caught in the waves as the wind whipped on
and the sand sat calmly miles below
He had to swim, to take the day
Hoping to see Mulberry when he crawled to reach his getaway
All was left one chance to fly away
Just beyond his reach the plan
To reunite them once again`,
  },
  {
    name: "Hot Air Balloon",
    setting:
      "Corrinado embraces Mulberry. He stares in awe at the hot air balloon. The fantastic pipe dream that had become his greatest joy had also led to his persecution. He starts up the engine and takes off, flying over the sea to rescue his beloved Leora. Leora waits lying by the sea on the beach. She frets about whether or not Corrinado has survived As dawn approaches, she sees a speck on the horizon. Corrinado has arrived. He sets his balloon down on the shore. Leora climbs in with him. They take off together, never to be seen by anyone again, flying off into the sunrise.",
    lyrics: `In the light of the moon, too soon
In a hot air balloon, he crossed the sea
Once an airship tycoon, turned bafoon
Leaving his home marooned, attempted to flee
the life he's begun

In the blink of an eye, he spies
The shore where he's fantasized, his baby to be
Turns his gaze to the skies, he cries
Just give me one more try, to chase down my dream
before I am done

Unsure from the day, she prays
Hoping their getaway, will still come to be
Watching stars ricochet, she strays
Beyond the alleyway, where no one can see
not anyone

In the blink of an eye, she spies
The spot in the foggy skies, she's been longing to see
Camoflaged by the tides, she hides
Where the water and wind collide, she's soon to be free
from what she's begun

In a hot air balloon
Corrinado flies over the sea
for Leora today

And in one day
He went from the jail to the sky
at his last chance to fly`,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderLyrics(lyrics: string) {
  if (!lyrics.trim()) return null;
  const stanzas = lyrics.split("\n\n");
  return stanzas.map((stanza, i) => (
    <p key={i}>
      {stanza.split("\n").map((line, j, arr) => (
        <span key={j}>
          {line}
          {j < arr.length - 1 && <br />}
        </span>
      ))}
    </p>
  ));
}

// ─── Components ──────────────────────────────────────────────────────────────

function CharacterCard({ character }: { character: (typeof characters)[number] }) {
  return (
    <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 to-purple-900/10 p-5 md:p-6">
      <div
        className={`w-12 h-12 rounded-full bg-gradient-to-br ${character.gradient} flex items-center justify-center text-sm font-bold text-purple-950 mb-3`}
      >
        {character.initial}
      </div>
      <h4 className="text-lg font-bold text-purple-100 mb-2 font-[Rajdhani] tracking-wide">
        {character.name}
      </h4>
      <p className="text-base text-content-text-secondary leading-relaxed">{character.description}</p>
    </div>
  );
}

function StoryCard({
  song,
  index,
  actLabel,
}: {
  song: SongSection;
  index: number;
  actLabel: string;
}) {
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
          <div className="mb-4">
            <span className="text-xs font-semibold tracking-[3px] text-purple-400/70 uppercase">
              {actLabel}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-purple-100 font-[Rajdhani] tracking-wide mt-0.5">
              {song.name}
            </h3>
          </div>
          {/* Setting */}
          <div className="space-y-3 text-content-text-secondary leading-relaxed text-base md:text-lg">
            <p>{song.setting}</p>
          </div>
          {/* Lyrics */}
          {song.lyrics.trim() && (
            <blockquote className="border-l-4 border-purple-500/30 pl-4 italic text-content-text-secondary mt-6 space-y-4">
              {renderLyrics(song.lyrics)}
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

const HotAirBalloon: React.FC = () => {
  return (
    <div className="space-y-10 md:space-y-14">
      {/* ── Hero Banner ── */}
      <div className="relative -mx-4 md:-mx-0 overflow-hidden rounded-none md:rounded-2xl">
        <div className="relative h-[200px] md:h-[300px]">
          <img
            src="https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/hot-air-balloon.jpg"
            alt="The Disco Biscuits - The Hot Air Balloon"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(240,10%,3.9%)] via-[hsl(240,10%,3.9%)]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
            <h1 className="font-[Audiowide] text-2xl md:text-4xl text-white tracking-wider">
              THE HOT AIR BALLOON
            </h1>
            <p className="text-purple-300/80 text-base md:text-lg mt-1 font-[Rajdhani] tracking-wide">
              The First Rock Opera by The Disco Biscuits
            </p>
          </div>
        </div>
      </div>

      {/* ── Introduction ── */}
      <div className="space-y-4 text-content-text-secondary leading-relaxed text-base md:text-lg">
        <p>
          <strong className="text-content-text-primary">The Hot Air Balloon</strong> is the Disco
          Biscuits' first full-length rock opera, written by Jon Gutwillig, and debuted on{" "}
          <Link
            to="/shows/1998-12-31-silk-city-diner-philadelphia-pa"
            className="text-brand-primary hover:text-brand-secondary"
          >
            12/31/98
          </Link>{" "}
          at Silk City in Philadelphia.
        </p>
        <p>
          The story follows Corrinado, an eccentric inventor who creates the world's first hot air
          balloon and starts a successful business with his friend Morris Mulberry. His invention
          attracts the attention of powerful businessman Manilla Trane, whose wife Leora falls in
          love with Corrinado, setting in motion a tale of romance, betrayal, and escape.
        </p>
      </div>

      {/* ── Characters ── */}
      <section>
        <h2 className="text-base font-semibold tracking-[4px] text-purple-400/60 uppercase mb-5">
          Characters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((char) => (
            <CharacterCard key={char.name} character={char} />
          ))}
        </div>
      </section>

      {/* ── Act I ── */}
      <section>
        <h2 className="text-base font-semibold tracking-[4px] text-purple-400/60 uppercase mb-5">
          Act I
        </h2>
        <div className="space-y-4">
          {act1.map((song, i) => (
            <StoryCard key={song.name} song={song} index={i} actLabel="Act I" />
          ))}
        </div>
      </section>

      {/* ── Act II ── */}
      <section>
        <h2 className="text-base font-semibold tracking-[4px] text-purple-400/60 uppercase mb-5">
          Act II
        </h2>
        <div className="space-y-4">
          {act2.map((song, i) => (
            <StoryCard key={song.name} song={song} index={i} actLabel="Act II" />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HotAirBalloon;
