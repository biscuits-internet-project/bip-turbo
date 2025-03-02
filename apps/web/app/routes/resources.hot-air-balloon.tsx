import type React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "~/components/ui/card";
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
    { title: "The Hot Air Balloon" },
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

  const chars: Character[] = [
    {
      name: "Corrinado",
      anchor: "corrinado",
      copy: "An unemployed wayward inventor who bounced aimlessly from idea to idea, until he invented the world's first aircraft, the hot air balloon. He was convinced by Morris Mulberry that the idea could be profitable and that the two of them should start a service shuttling people across the sea in hot air balloons. The business, called Hot Air Balloon Traveling, became successful and attracted the attention of Manilla Trane, the entrepreneur whose capital ran much of the town. Corrinado refused to sell Hot Air Balloon Traveling, and even worse, kindles a romance with Manilla's beautiful wife, Leora of the Sequoias. Manilla forcibly overtook the business and had Corrinado arrested and sentenced for building \"the devil's flying machine.\"",
    },
    {
      name: "Leora of the Sequioas",
      anchor: "leora",
      copy: "The beautiful wife of Manilla Trane, who falls in love with Corrinado. She is a free spirit who feels trapped in her marriage to Manilla. She is drawn to Corrinado's creativity and passion, which are qualities her husband lacks. When Corrinado is arrested, she visits him in prison and helps him escape, fleeing with him in his hot air balloon.",
    },
    {
      name: "Manilla Trane",
      anchor: "manilla",
      copy: "A wealthy entrepreneur who controls much of the town's business. He is threatened by Corrinado's invention and the success of Hot Air Balloon Traveling. When he discovers the romance between his wife and Corrinado, he uses his influence to have Corrinado arrested and sentenced. He represents the forces of tradition and established power that resist innovation and change.",
    },
    {
      name: "Morris Mulberry",
      anchor: "morris",
      copy: "Corrinado's friend and business partner who helps him establish Hot Air Balloon Traveling. He recognizes the potential of Corrinado's invention and provides the business acumen to make it successful. He remains loyal to Corrinado even after his arrest.",
    },
    {
      name: "Diamond Rigg",
      anchor: "diamond",
      copy: "A well known loan-shark and old street friend of Morris Mulberry. He put up the initial capital to start Hot Air Ballon Traveling. A very aloof individual who, according to town rumor, possessed the prototype hot air balloon, which he was given as collateral for his initial investment.",
    },
  ];

  const acts: Act[] = [
    {
      name: "The Invention",
      anchor: "invention",
      setting:
        "Corrinado, an eccentric inventor, creates the world's first hot air balloon after years of failed inventions. His friend Morris Mulberry sees the potential for a business venture, and together they establish Hot Air Balloon Traveling, offering people the chance to fly across the sea.",
    },
    {
      name: "The Success",
      anchor: "success",
      setting:
        "Hot Air Balloon Traveling becomes wildly successful, attracting attention throughout the region. Manilla Trane, a powerful businessman, takes notice and attempts to buy the company, but Corrinado refuses to sell his invention.",
    },
    {
      name: "The Romance",
      anchor: "romance",
      setting:
        "Corrinado meets Leora of the Sequoias, Manilla's wife, and they fall deeply in love. Their secret romance flourishes as they share dreams of freedom and adventure.",
    },
    {
      name: "The Betrayal",
      anchor: "betrayal",
      setting:
        "Manilla discovers the affair between Corrinado and Leora. Enraged, he uses his influence to have Corrinado arrested on charges of witchcraft for creating 'the devil's flying machine.' Corrinado is imprisoned and sentenced to death.",
    },
    {
      name: "The Escape",
      anchor: "escape",
      setting:
        "Leora visits Corrinado in prison and helps him escape. They flee together in Corrinado's hot air balloon, soaring above the clouds toward freedom and a new life together.",
    },
  ];

  const songs: Song[] = [
    {
      name: "Hot Air Balloon",
      anchor: "hab",
      setting:
        "The opening song introduces Corrinado and his invention of the hot air balloon. It captures his excitement and vision for what this new technology could mean for humanity.",
      lyrics: "Up, up and away, in my beautiful balloon...",
    },
    {
      name: "Mulberry's Dream",
      anchor: "mulberry",
      setting:
        "Morris Mulberry envisions the business potential of the hot air balloon and convinces Corrinado to start Hot Air Balloon Traveling.",
      lyrics: "We'll fly across the sea, just you and me...",
    },
    {
      name: "Trane's Complaint",
      anchor: "trane",
      setting:
        "Manilla Trane expresses his frustration and jealousy over Corrinado's success and his suspicions about Leora.",
      lyrics: "Something's not right, I can feel it in the air tonight...",
    },
    {
      name: "Leora's Song",
      anchor: "leora-song",
      setting: "Leora sings of her feelings for Corrinado and her desire to escape her life with Manilla.",
      lyrics: "Freedom calls to me, like a bird upon the breeze...",
    },
    {
      name: "The Devil's Machine",
      anchor: "devil",
      setting:
        "Manilla rallies the townspeople against Corrinado, painting his invention as something unnatural and dangerous.",
      lyrics: "The devil's in the sky, watching as we die...",
    },
  ];

  const OperaMenuCard = ({ title, items }: { title: string; items: { name: string; anchor: string }[] }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="bg-blue-600 text-white px-6 py-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="p-6">
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.anchor} className="py-2">
              <button
                type="button"
                onClick={() => scrollToSection(item.anchor)}
                className="text-blue-600 hover:underline text-left w-full"
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const LyricsBlock = ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700">{children}</blockquote>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">The Hot Air Balloon</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card title="Introduction">
            <CardContent>
              <p>
                The Hot Air Balloon is the Disco Biscuits' first full-length rock opera, written by Jon Gutwillig, and
                debuted on 12/31/98 at Silk City in Philadelphia.
              </p>
              <p>
                The story follows Corrinado, an eccentric inventor who creates the world's first hot air balloon and
                starts a successful business with his friend Morris Mulberry. His invention attracts the attention of
                powerful businessman Manilla Trane, whose wife Leora falls in love with Corrinado, setting in motion a
                tale of romance, betrayal, and escape.
              </p>
            </CardContent>
          </Card>

          <Card title="Characters">
            <CardContent>
              {chars.map((char) => (
                <div key={char.anchor} id={char.anchor} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{char.name}</h3>
                  <p>{char.copy}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card title="Story Overview">
            <CardContent>
              {acts.map((act) => (
                <div key={act.anchor} id={act.anchor} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{act.name}</h3>
                  <p>{act.setting}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card title="Songs">
            <CardContent>
              {songs.map((song) => (
                <div key={song.anchor} id={song.anchor} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{song.name}</h3>
                  {song.setting && <p>{song.setting}</p>}
                  {song.lyrics && <LyricsBlock>{song.lyrics}</LyricsBlock>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <OperaMenuCard title="Characters" items={chars} />
          <OperaMenuCard title="Story Overview" items={acts} />
          <OperaMenuCard title="Songs" items={songs} />

          <Card title="Related Links">
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link to="/resources/chemical-warfare-brigade" className="text-blue-600 hover:underline">
                    The Chemical Warfare Brigade
                  </Link>
                </li>
                <li>
                  <a
                    href="https://archive.org/details/db1998-12-31.shnf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Listen to the Debut (12/31/1998)
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HotAirBalloon;
