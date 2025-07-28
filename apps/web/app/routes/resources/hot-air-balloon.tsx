import type React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { publicLoader } from "~/lib/base-loaders";

// Define types for our data
interface Character {
  name: string;
  anchor: string;
  copy: string;
}

interface Act {
  name: string;
  anchor: string;
  setting: string;
}

interface Song {
  name: string;
  anchor: string;
  setting?: string;
  lyrics?: string;
}

// Add a loader function
export const loader = publicLoader<void>(async () => {});

// Define metadata for the route
export function meta() {
  return [
    { title: "The Hot Air Balloon | Biscuits Internet Project" },
    {
      name: "description",
      content:
        "The band's first full length rock opera, written by Jon Gutwillig, and debuted on 12/31/98 at Silk City in Philadelphia.",
    },
  ];
}

const HotAirBalloon: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yCoordinate = element.getBoundingClientRect().top + window.pageYOffset;
      const yOffset = -80;
      window.scrollTo({ top: yCoordinate + yOffset, behavior: "smooth" });
    }
  };

  const chars = [
    {
      name: "Corrinado",
      anchor: "corrinado",
      copy: `An unemployed wayward inventor who bounced aimlessly from idea to idea, until he invented the world's first aircraft, the hot air balloon. He was convinced by Morris Mulberry that the idea could be profitable and that the two of them should start a service shuttling people across the sea in hot air balloons. The business, called Hot Air Balloon Traveling, became successful and attracted the attention of Manilla Trane, the entrepreneur whose capital ran much of the town. Corrinado refused to sell Hot Air Balloon Traveling, and even worse, kindles a romance with Manilla's beautiful wife, Leora of the Sequoias. Manilla forcibly overtook the business and had Corrinado arrested and sentenced for building "the devil's flying machine."`,
    },
    {
      name: "Leora of the Sequioas",
      anchor: "leora",
      copy: "The young trophy wife of Manilla Trane, known throughout town as a terrific chef. She earned her nickname because of her height as well as the size of her hair, which, according to the townspeople, looked as if were held up by branches. Lack of attention from her husband turned her into an insomniac, and she was often seen late at night staring out the window of the high tower of Manilla's fortress.",
    },
    {
      name: "Manilla Trane",
      anchor: "manilla",
      copy: "Extraordinarily wealthy entrepreneur whose riches allows him to control the entire town. As a young man, he began to amass his fortune by peddling weapons. He possesses a small army of extremely loyal men who will do his every whim. An avid arts collector, he married Leora of the Sequoias on the steps of his brand new museum. He is known as an extremely demanding and unforgiving tyrant.",
    },
    {
      name: "Morris Mulberry",
      anchor: "morris",
      copy: "A somewhat conniving, albeit benevolent, street hustler. He convinced Corrinado that the two of them could start a highly successful business by using Corrinado's hot air balloon invention to shuttle people across the sea. He mysteriously vanished one month after Hot Air Balloon Travelling was destroyed and Corrinado was arrested.",
    },
    {
      name: "Diamond Rigg",
      anchor: "diamond",
      copy: "A well known loan-shark and old street friend of Morris Mulberry. He put up the initial capital to start Hot Air Ballon Traveling. A very aloof individual who, according to town rumor, possessed the prototype hot air balloon, which he was given as collateral for his initial investment.",
    },
  ];

  const act1 = [
    {
      name: "The Overture",
      anchor: "overture",
      setting:
        "High noon - townsfolk fill the center square for lunch. There is much commotion. Horse-drawn carriages line the outer streets. Merchants are yelling their pitches into the crowd. Street performers are miming and dancing in front of onlookers. The echoing sound of the street charmer's horn can be heard ricocheting off of the buildings.",
      lyrics: "",
    },
    {
      name: "Once the Fiddler Paid",
      anchor: "fiddler",
      setting:
        "Corrinado sits alone in his prison cell, staring out the tiny barred window, over the jagged cliffs, and out to the sea beyond. The noon sun is high, the sky is clear and a comfortable summer wind blows through his cell. He thinks about Leora, his lost loved one, and he is plagued by the haunting vision of his fate.",
      lyrics: `
				Summer Sunny day, once the wind blew warm
				and the light circled round the sun I saw like a crown
				you could feel it in the air, like a not so distant storm
				and the silent pause in the wind it seemed
				left a magical sound<br><br>
				But now she's gone & I vowed to miss her
				days that we spent starry eyed run deep within my soul
				& now she's gone & I can't dismiss her
				nor can I forget the man who sent me down below<br><br>
				Summer sunny day, once the wind blew cold
				and the world had seen a better day all around
				my life was ripped away, my business torn & sold
				and I found myself in this cell I live
				with a clamouring sound<br><br>
				But now she's gone & I vowed to miss her
				days that we spent starry eyed run deep within my soul
				& now she's gone & I can't dismiss her
				nor can I forget the man who sent me down below<br><br>
				Summer sunny day, once the wind blew thorns
				and the world had seen a better day all around
				you could feel it in the air, like a not so distant storm
				and the days once lost but still recalled can be found
				Once the fiddler paid, but once was not enough
				was all who cornered his misfortune yelled
				the fiddler took the blame, the crowd had called his bluff
				when all was lost the verdict came to the silence of the crowd
				<br><br>
				But now she's gone & I vowed to miss her
				days that we spent starry eyed run deep within my soul
				& now she's gone & I can't dismiss her
				nor can I forget the man who sent me down below
				`,
    },
    {
      name: "The Very Moon",
      anchor: "tvm",
      setting:
        "The scene moves to Manilla's estate, before the arrest of Corrinado. We catch a glimpse of the relationship between Manilla and Leora. Manilla has reaped the rewards of many succesfull buisness enterprises. He works too hard to pay attention to his wife Leora, needing her only as a chef. Manilla invites Corrinado and Mulberry over for dinner in order to discuss the propositon of buying Hot Air Balloon Traveling. Corrinado and Mulberry are not willing to part with the business. As the scene ends, it becomes clear that Corrinado and Leora are enamored with one another, leaving Leora wondering whether Corrinado is the man to fly her far, far away.",
      lyrics: `

Manilla, a crude machine, had taken his fair share
He gobbled up the world he owned as petals paved his stairs
Manilla thanked the very moon for money and his life
He triffled nothing miniscule including one, his wife
Leora, his arranged wife, did not need his greed
She asked that stars, the very moon, to one day cross the sea
Manilla gazed an empty stare nothing there could grow
She cherished dreams of flying high and leaving him below
<br><br>
Leora stands on her head
Doin' the two step on her hands
As her eyes move round the room
To catch somone watching
Leora stands on her head
Doin' the two step on her hands
Underneath the very moon each one was watching
<br><br>
Manilla wanted worldly things and everything he'd have
He built castles, moats, battleships and troops in iron clad
Manilla heard Mulberry's name under the very moon
His troops went running the next day to find the air balloon.
Leora, his arranged wife, cooked the men a feast
And cleaned herself up solemnly before she faced the beast
That night she asked the very moon was this her fate to be
At lunch she met the flying man whose airships crossed the sea
<br><br>
Leora stands on her head
Doin' the two step on her hands
As her eyes move round the room
To catch somone watching
Leora stands on her head
Doin' the two step on her hands
Underneath the very moon each one was watching
			`,
    },
    {
      name: "Voices Insane",
      anchor: "voices",
      setting:
        "The scene shifts back to Corrinado's jail cell, the night before he is to be burned at the stake. Starved and beaten, he has given in to the demons which are living in his mind. He knows that there is little chance to escape his fate, yet he dares the audience to condemn him for what he has done. Half-crazy, he sits alone in his cell dreaming of Leora, laughing aloud at the world which had condemned him.",
      lyrics: `

I admit it, I was guilty
But don't you believe it, that I was wrong
I never accepted my relocation
& I'm looking out past them four hours til dawn
<br><br>
I've dreamed of this day since they locked away the key
A prisoner in chains will not make a madman of me
These voices insane are telling me tales from the stars
So I call on the reigns of forces drawn in from afar
<br><br>
The walls have deceived me
I imagined this all on my own
These spirits around me, clouds of dust looking for a new home
When they tap on my shoulder, tell me I got what I deserve
I wave my arms & destroy them
Cause on this day they will eat all their words
<br><br>
I've dreamed of this day since they locked away the key
A prisoner in chains will not make a madman of me
These voices insane are telling me tales from the stars
So I call on the reigns of forces drawn in from afar
<br><br>
I can stop all the voices
and bang on the walls with my fists
But my only chance left
is the one I'd never dimiss
I hear the world through the echos
A song of life through the noise in the crowd
In this cell I've known plainly
That what I want is what is not allowed.
<br><br>
I've dreamed of this day since they locked away the key
A prisoner in chains will not make a madman of me
These voices insane are telling me tales from the stars
So I call on the reigns of forces drawn in from afar
		`,
    },
    {
      name: "Eulogy",
      anchor: "eulogy",
      setting:
        "The prison guards come to take Corrinado away to be executed. He walks defiantly through the crowd as they taunt and jeer at him. He remains calm and seems completely unmoved. His gaze is fixed on the sky.",
      lyrics: `
There's more to the world than what I've seen
There's more to my life than my eulogy
and if I ask my maker for one more day
When all of my chances are slipping away
<br><br>
I hear the bells and I see the clouds
All of the people out thinking aloud
All of the whispers and laughter and calls
People out frantic in search of it all
<br><br>
There's one in a million I'd be here today
There's one in a million that I get to stay
And if I ask my maker to see me through
When it seems there's nothing more that I can do
<br><br>
There's more who will live when gone are my days
and the sands waiting last to be swept away
but I still have time to look to the sky
and search through the clouds for some kind of sign
<br><br>
Bring on the lightning in bolts like a train
Let loose the screams of a mad hurricane
Bring down the water in buckets and all
Shake up the earth where all here will fall
<br><br>
But nothing, no splash, no flash and no sound
all that is left is my feet on the ground
Now I remember that life was a ball
When I was the person in search of it all
<br><br>
There's one in a million I'd be hear today
There's one in a million that I get to stay
And if I ask my maker to see me through
When it seems there's nothing more that I can do
		`,
    },
  ];

  const act2 = [
    {
      name: "Bazaar Escape",
      anchor: "bazaar",
      setting:
        "Corrinado is strapped to a pole in the center of town. Manilla's troops are preparing the fire. Leora has arranged for his feet to be left untied. At the last moment, he pulls on his ropes with all his might, tearing himself free. He charges into the town bazaar as Manilla's troops pursue. His only chance of escaping is to make for the cliffs and jump into the sea. With a hoard of troops on his heels, he swan dives off the cliff into the sea far below.",
      lyrics: `
			Corrinado slipped the chopping block
The onlookers in fear & shock
He bolted swiftly through the crowd
The women yelled & screamed aloud
Manilla's words rang through the air
"Kill that man or all Beware!"
Corrinado tookoff all for bust
Gone behind a cloud of dust
<br><br>
Passed on tragedy Corrinado moves with ease
Eluding all authority with his own agility
Ducks down an alley to the center square bazaar
Soldiers yell, soldiers scream, don't let him get too far.
<br><br>
Corrinado hides down an alley
As Manilla's troops begin to rally
He lays behind the street snake charmer
and slips out of his prison pajamas
<br><br>
The Matador, the bull can run
Corrinado sidestepped everyone
Takesoff towards the end of town
Drawing troops from all around
He knows he's got but one way out
His only route without a doubt
be fastest to the mighty cliffs
and jump for his own benefit
<br><br>
Passed on tragedy Corrinado moves with ease
Eluding all authority with his own agility
Ducks down an alley to the center square bazaar
Soldiers yell, soldiers scream, don't let him get too far.
<br><br>
Carooning down the mountain top
A bouncing rock no will can stop
Their chasing our strong hero down
Who dodges trees with swift abounds
He spins the air like a carousel
While dodging shots adeptly till
His steps no longer make a sound
His feet are well above the ground
		`,
    },
    {
      name: "Mulberry's Dream",
      anchor: "mulberrys",
      setting:
        "Corrinado swims through the sea, his only chance of survival is to make it to the island; hoping that Morris Mulberry will be waiting with the prototype hot air balloon, the only one left undestroyed by Manilla. As he swims, he gets delirious from pure physical exhaustion. He thinks back to his friend Mulberry and the beginning of Hot Air Balloon Traveling when Mulberry persuaded him to use his invention to start a successful business.",
      lyrics: `

I first caught the sun at noon today
To get another 24 hours
I lept & broke my bedframe
Which the termites have devoured
I lived a life in shambles
With one idea left to scheme
But if I ever built it
then what would I have left to dream?
<br><br>
Mulberry's Dream was talkin to me,
as we kickin' with time.
Burnin' in the sun on the side of the street,
we gotta be out of our minds.
Life, he said, is all about style,
and my flying machine.
And we'll take the people cross miracle miles,
and I believed him
<br><br>
I walked down to the corner
To fetch myself some dollars
I left later that afternoon
When the streets began to hollar
and there I saw O'Farrell
The old street corner pantomime
and I simply could not shake him
till old Mulberry came just in time
<br><br>
Mulberry's Dream was talkin to me,
as we kickin' our time.
Burnin' in the sun on the side of the street,
we gotta be out of our minds.
Life, he said, is all about style,
and my flying machine.
And we'll take the people cross miracle miles,
and I believed him
		`,
    },
    {
      name: "Above the Waves",
      anchor: "atw",
      setting:
        "Mulberry stands alone on the island with the hot air balloon engine burning. He waits all night in hopes that Corrinado will make it. Eventually, he starts to despair, realizing that even if Corinado managed to escape his execution, there is no way that he could make the long swim across the ocean. He gives up all hope of Corrinado's survival, puts out the balloon engine, and sits there in the darkness. Out of the darkness, he hears someone shouting his name in a faint voice. He looks out but still he sees nothing. He thinks that his mind is playing tricks on him, and decides that it is time to move on and start his life anew. He is about to leave when Corrinado's soaking wet figure emerges from the darkness.",
      lyrics: `

Above the waves, Going under
<br><br>
Corrinado swam like hell on fire
With jelly arms and beaten bones
He rode the crest, he broke the waves
Trying to get a breath of air for all that he had left to save
<br><br>
Mulberry let the engines burn
The airship lifting off the ground
He watched the sea, could not believe
That he thought Corrinado could be free, his life was now in vain
All was left one chance to fly away
He spun, he heard a gasping sound
But he did not see his friend
<br><br>
After the sun and light were gone
Before he found himself at home
Corrinado swam, fought the waves
Remembering when, a myriad of falls, behind another day
All was left one chance to fly away
just beyond his reach the plan
To reunite them once again
<br><br>
Caught in the waves as the wind whipped on
and the sand sat calmly miles below
He had to swim, to take the day
Hoping to see Mulberry when he crawled to reach his getaway
All was left one chance to fly away
Just beyond his reach the plan
To reunite them once again
		`,
    },
    {
      name: "Hot Air Balloon",
      anchor: "hab",
      setting:
        "Corrinado embraces Mulberry. He stares in awe at the hot air balloon. The fantastic pipe dream that had become his greatest joy had also led to his persecution. He starts up the engine and takes off, flying over the sea to rescue his beloved Leora. Leora waits lying by the sea on the beach. She frets about whether or not Corrinado has survived As dawn approaches, she sees a speck on the horizon. Corrinado has arrived. He sets his balloon down on the shore. Leora climbs in with him. They take off together, never to be seen by anyone again, flying off into the sunrise.",
      lyrics: `
In the light of the moon, too soon
In a hot air balloon, he crossed the sea
Once an airship tycoon, turned bafoon
Leaving his home marooned, attempted to flee
the life he's begun
<br><br>
In the blink of an eye, he spies
The shore where he's fantasized, his baby to be
Turns his gaze to the skies, he cries
Just give me one more try, to chase down my dream
before I am done
<br><br>
Unsure from the day, she prays
Hoping their getaway, will still come to be
Watching stars ricochet, she strays
Beyond the alleyway, where no one can see
not anyone
<br><br>
In the blink of an eye, she spies
The spot in the foggy skies, she's been longing to see
Camoflaged by the tides, she hides
Where the water and wind collide, she's soon to be free
from what she's begun
<br><br>
In a hot air balloon
Corrinado flies over the sea
for Leora today
<br><br>
And in one day
He went from the jail to the sky
at his last chance to fly
		`,
    },
  ];

  const acts = [...act1, ...act2];

  const OperaMenuCard = ({ title, items }: { title: string; items: { name: string; anchor: string }[] }) => (
    <Card className="card-premium rounded-lg mb-6">
      <CardHeader>
        <h3 className="text-2xl font-semibold">{title}</h3>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <button
            key={item.anchor}
            type="button"
            onClick={() => scrollToSection(item.anchor)}
            className="text-brand-primary hover:text-brand-secondary block w-full text-left py-2 transition-colors"
          >
            {item.name}
          </button>
        ))}
      </CardContent>
    </Card>
  );

  const LyricsBlock = ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-content-bg-secondary pl-4 italic my-4 text-content-text-secondary">{children}</blockquote>
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-content-text-primary">The Hot Air Balloon</h1>
      </div>

      <div className="gap-6">
        <div className="space-y-6">
          <Card className="card-premium rounded-lg">
            <CardHeader>
              <h3 className="text-2xl font-semibold">Introduction</h3>
            </CardHeader>
            <CardContent className="space-y-4 text-content-text-primary leading-relaxed">
              <p>
                The Hot Air Balloon is the Disco Biscuits' first full-length rock opera, written by Jon Gutwillig, and
                debuted on{" "}
                <Link
                  to="/shows/1998-12-31-silk-city-diner-philadelphia-pa"
                  className="text-brand-primary hover:text-brand-secondary"
                >
                  12/31/98
                </Link>{" "}
                at Silk City in Philadelphia.
              </p>
              <p>
                The story follows Corrinado, an eccentric inventor who creates the world's first hot air balloon and
                starts a successful business with his friend Morris Mulberry. His invention attracts the attention of
                powerful businessman Manilla Trane, whose wife Leora falls in love with Corrinado, setting in motion a
                tale of romance, betrayal, and escape.
              </p>
            </CardContent>
          </Card>

          <Card className="card-premium rounded-lg">
            <CardHeader>
              <h3 className="text-2xl font-semibold">Characters</h3>
            </CardHeader>
            <CardContent className="space-y-6 text-content-text-primary leading-relaxed">
              {chars.map((char) => (
                <div key={char.anchor} id={char.anchor}>
                  <h4 className="text-xl font-semibold mb-2">{char.name}</h4>
                  <p>{char.copy}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="card-premium rounded-lg">
            <CardHeader>
              <h3 className="text-2xl font-semibold">Story Overview</h3>
            </CardHeader>
            <CardContent className="space-y-6 text-content-text-primary leading-relaxed">
              {acts.map((act) => (
                <div key={act.anchor} id={act.anchor}>
                  <h4 className="text-xl font-semibold mb-2">{act.name}</h4>
                  <p>{act.setting}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HotAirBalloon;
