import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { publicLoader } from "~/lib/base-loaders";

// Define types for our data
interface BandMember {
  name: string;
  instrument: string;
  twitter: string;
}

interface BandHistoryData {
  currentMembers: BandMember[];
}

// Add a loader function
export const loader = publicLoader<void>(async () => {});

// Define metadata for the route
export function meta() {
  return [
    { title: "Band History" },
    {
      name: "description",
      content:
        "From their early days in Philadelphia as Zex Sea to their current lineup as The Disco Biscuits, read more about the band members, who they are, and how they came together.",
    },
  ];
}

const BandHistory: React.FC = () => {
  const [data, setData] = useState<BandHistoryData>({
    currentMembers: [
      { name: "Jon Gutwillig", instrument: "Guitar", twitter: "https://twitter.com/BarberShreds" },
      { name: "Marc Brownstein", instrument: "Bass", twitter: "https://twitter.com/Marc_Brownstein" },
      { name: "Aron Magner", instrument: "Keys", twitter: "https://twitter.com/aronmagner" },
      { name: "Allen Aucoin", instrument: "Drums", twitter: "https://twitter.com/DrFameus" },
    ],
  });

  const TwitterIcon = ({ url }: { url: string }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block ml-2 pt-1">
      <img src="/twitter.png" alt="twitter" className="inline-block" />
    </a>
  );

  return (
    <div className="">
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Band History</h1>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Current Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.currentMembers.map((member) => (
                <div key={member.name} className="flex items-center space-x-2">
                  <div>
                    <h3 className="font-medium text-white">{member.name}</h3>
                    <p className="text-sm text-gray-400">{member.instrument}</p>
                  </div>
                  <TwitterIcon url={member.twitter} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Early Years</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              The four original members, Jon Gutwillig (guitar), Marc Brownstein (bass), Ben Hayflick (keys), and Sam
              Altman (drums) met in the early 90's as students at the University of Pennsylvania in Philadelphia.
              Originally calling themselves by various names such as "Party Tent" and "Zex Sea", they played at
              fraternities and house parties in West Philadelphia, doing mostly covers of the Grateful Dead and Phish
              with some early originals mixed in. Setlists from this time would often feature segments like "Basis For a
              Day &gt; Help On the Way &gt; Slipknot &gt; Basis For a Day" or "Antelope &gt; Morning Dew &gt; Antelope"
            </p>
            <p>
              In 1995, Aron Magner replaced Hayflick on keys and the band changed their name to The Disco Biscuits. In
              an interview with Spin, Marc says:
            </p>
            <p>
              <blockquote>
                "...we were headed out to the Jersey Shore one weekend for this huge party. We were sitting in our car
                and one of our friends... totally out of the blue... says, 'Hey, you guys wanna go find some Disco
                Biscuits?' We were like 'Boom! That's the name.' At the time I didn't know what Disco Biscuits even
                meant... the dude was looking for Quaaludes. That shows how old we are because nowadays Disco Biscuits
                is slang for ecstasy. Part of the reason I never told that story before is because there was a time when
                we didn't necessarily want to be associated with the drug reference. But that didn't hurt the Rolling
                Stones, so I think we'll be okay!"
              </blockquote>
            </p>
            <p>
              <Link to="/shows/year/1995">1995</Link> into <Link to="/shows/year/1996">1996</Link> saw them move away
              from house parties and into the Philadelphia bar/club scene with shows at Sam Adam's Brewhouse, The Middle
              East, J.C. Dobb's, and the Blarney Stone, among others.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>1997 - 1999</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              The first heavily circulated show of the Disco Biscuits career was played on{" "}
              <Link to="/shows/1997-01-30-wetlands-preserve-new-york-ny">1/30/97</Link> at the Wetlands Preserve, in New
              York, featuring a masterful, segue-laden setlist. On{" "}
              <Link to="/shows/1997-02-13-r-t-s-oaklyn-nj">2/13/97</Link>, the band played Peaches en Regalia for the
              final time, marking the beginning of a new era focused on originals and leaving their Phish aping styles
              in the past. The move away from Phish's shadow was solidified with a performance on{" "}
              <Link to="/shows/1997-10-31-phi-sigma-kappa-university-of-pennsylvania-philadelphia-pa">10/31/97</Link> in
              which Magner incorporated the JP8000 synthesizer for the first time. The show, featuring an extremely
              jammed out Run Like Hell, marked the beginning of the "Trance-Fusion Era."
            </p>
            <p>
              <Link to="/shows/year/1998">1998</Link> saw an explosion in the band's scope and popularity. Prior to that
              year they had played exclusively in the Northeast and Mid-Atlantic regions, but beginning in the summer of
              98, the band embarked on a tour that took them down the East coast, out West via the Midwest, along the
              West coast, and back East via the South. The band made their triumphant return to the Northeast on{" "}
              <Link to="/shows/1998-08-28-wetlands-preserve-new-york-ny">8/28/98</Link> where they debuted three new
              songs, two of which, Helicopters and Once the Fiddler Paid, entered regular rotation. The band played
              almost entirely on the East coast for the rest of the year, debuting the songs that would make up the Hot
              Air Balloon rock opera. On <Link to="/shows/1998-12-29-wetlands-preserve-new-york-ny">12/29/98</Link> and{" "}
              <Link to="/shows/1998-12-30-wetlands-preserve-new-york-ny">12/30/98</Link> the band played two legendary
              Phish afterparties at the Wetlands Preserve, and on{" "}
              <Link to="/shows/1998-12-31-silk-city-diner-philadelphia-pa">12/31/98</Link> the band debuted Barber's{" "}
              <Link to="/resources/hot-air-ballooon">Hot Air Balloon</Link> rock opera at Silk City.
            </p>
            <p>
              The Biscuits saw a huge expansion in popularity and skill in <Link to="/shows/year/1999">1999</Link>. They
              played two national tours in the winter and fall, as well as an East coast and Midwest tour in the
              spring/summer. They continued to cultivate their following throughout the year, playing 1000+ capacity
              venues in New York, Worcester and (of all places) Phoenix, Arizona. On 5/22/99, the band was scheduled to
              play a set at All Good Music Festival that was ultimately canceled. A group of dedicated Biscuits fans
              camped out, dubbing their site "Camp Bisco." In August, the band held the first Camp Bisco Music Festival,
              an annual event that happens to this day.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2000 - The Disco Triscuits and The Maui Project</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              In January 2000 Marc announced via an Internet message board post that he had been asked to leave the
              band. Luckily, this hiatus was short-lived, and he rejoined the band in July of that same year.
            </p>
            <p>
              During this 6-month period, the remaining three members (Jon, Aron, and Sammy) played several shows as a
              trio, referred to as The Disco Triscuits (or just Triscuits). Each member would take turns playing the
              bassline - sometimes Aron on keys, other times Sammy would pick up a bass guitar while friend and local
              musician DJ Mauricio would take over on e-drums. During this time, they also auditioned/jammed with other
              bass players at shows including Carol Wade, Clay Belknap, Bill Stites, Anthony Rogers-Wright, Rob Derhak,
              and Jordan Crisman. Crisman played multiple shows with the band and was widely believed to be Marc's
              replacement for a time.
            </p>
            <p>
              Meanwhile, Marc channeled his energy into writing a ton of new songs, and formed his own band, The Maui
              Project, which played one show on his birthday - <span> </span>
              <Link to="https://archive.org/details/maui2000-04-08.flac16" target="blank">
                4/8/2000
              </Link>{" "}
              - at the Wetlands in New York City. The Maui Project featured Marc on bass, Jamie Shields on keys, Max
              Delaney on guitar, Dave Hoffman on drums, Paulie Herron on percussion and DJ Stitch on the turntables.
              Maui Project songs are now staples of the Biscuits current repertoire, and include such fan favorites as
              Triumph, Home Again, Humuhumunukunukuapua'a, Grass is Green, and Kamaole Sands.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2000 - 2004</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Coming soon!. Follow us at on{" "}
              <Link to="https://twitter.com/tdbdotnet" target="blank">
                twitter
              </Link>{" "}
              and{" "}
              <Link to="https://instagram.com/tdbdotnet" target="blank">
                instagram
              </Link>{" "}
              for content updates!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2005 - The Doctor is Out. Enter Batman.</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              In <Link to="/shows/years/2005">2005</Link>, after more than 10 years, Sam Altman left the band to pursue
              his dream of becoming a doctor. His last official shows were{" "}
              <Link to="/shows/2005-08-26-skye-top-festival-grounds-van-etten-ny">8/26/05</Link> and{" "}
              <Link to="/shows/2005-08-27-skye-top-festival-grounds-van-etten-ny">8/27/05</Link> at Camp Bisco IV. To
              find a replacement, the band held a series of auditions culminating in a two-night, sold-out "drum off" at
              the Borgata in Atlantic City, won by Skydog Gypsy drummer, Allen Aucoin. In December of 2005, Allen was
              announced as the band's new drummer.
            </p>
            <p>
              Allen attended Berklee College of Music in Boston, and began his musical career in education and
              composition, including teaching and writing for award-winning percussion ensembles. In 1999 he formed
              Skydog Gypsy.
            </p>
            <p>
              In December of 2010, Allen was hospitalized after a serious asthma attack and was unable to perform at the
              first 3 shows of the band's New Year's Eve run. In his place, Lotus drummer Mike Greenfield, Johnny Rabb
              from BioDiesel, Pretty Lights drummer Adam Deitch, New Deal drummer Darren Shearer, and even original
              drummer Sam Altman took turns sitting in.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2006</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <Link to="/shows/year/2006">2006</Link> marked a new chapter for the Disco Biscuits, as they took their
              new drummer Allen on the road. While performances may have been a little uneven at first, it was clear
              that Allen had the chops and chemistry within the band improved with each show. A change in the band's
              sound was immediately evident. The jams produced during these early Allen days could be described as
              hard-driving and more electronic sounding than ever before. While the sound wasn’t fully actualized yet,
              they were playing with a raw energy that gave fans reason to be optimistic.
            </p>
            <p>
              Winter Tour started in February and included stops in Chicago, Denver, Baltimore and three nights in
              Sayreville. These first few shows featured a lot of standalones in the setlists as Allen was still getting
              comfortable with the band’s catalog. A mixture of old classics, Conspirator tracks Commercial Amen and
              Liquid Handcuffs, and new originals The Great Abyss and Cyclone (originally debuted by JM2) were common
              songs to see in early 2006.
            </p>
            <p>
              March consisted of two shows and a festival set at Langerado in Florida and three shows in Amsterdam at
              weekend getaway Jam in the Dam. In April they went on tour in support of their live album The Wind at Four
              to Fly. The tour consisted of three nights in Burlington, one night in Charlottesville, VA and five nights
              in North Carolina. Wilmington, two nights in Raleigh, and nights in Charlotte and Asheville were all stops
              along the way. The southern leg of the tour wrapped up with a show in Atlanta, two in Athens, GA and
              Nashville, TN. As they played more shows the catalog gradually opened up a bit more and multiple
              transitions between songs became more common.
            </p>
            <p>
              By May, things were starting to sound more cohesive by the night as they made stops in Milwaukee/Madison,
              WI, Chicago, IL, Memphis, TN, Washington D.C. Wilkes-Barre, PA and Albany. At the end of the month they
              played two nights at Summer Camp in Chillicothe, IL and then came home to Philadelphia for shows at Jam on
              the RIver and the Electric Factory. (Recommended listening:
              <Link to="/shows/2006-05-28-electric-factory-philadelphia-pa">05/28</Link> Astronaut and 42).
            </p>
            <p>
              Early June included two nights Wakarusa in Lawrence, KS, a co-bill with Umphrey’s McGee in Indianapolis,
              IN and late-night and sonic stage sets at Bonnaroo. Two shows at the Stone Pony in Asbury Park, NJ again
              indicated that the band was building momentum and refining their sound. (Recommended listening:
              <Link to="/shows/2006-06-23-stone-pony-asbury-park-nj">06/23</Link> I-Man) Shows in Norfolk, VA and at
              Starscape in Baltimore, MD wrapped up the month.
            </p>
            <p>
              Shows in July consisted of two nights at High Sierra Music Festival and one set at All Good Music
              Festival. (Recommended listening:
              <Link to="/shows/2006-07-02-plumas-country-fairgrounds-quincy-ca">7/2</Link> I-Man/Helicopters mashup).
              August another light month of shows with only three tour dates. The first was
              <Link to="/shows/2006-08-05-hutchinson-field-in-grant-park-chicago-il">8/5</Link> 8/5 at Lollapalooza and
              the second and third were
              <Link to="/shows/2006-08-25-hunter-mountain-ski-lodge-hunter-ny">8/25</Link> and
              <Link to="/shows/2006-08-26-hunter-mountain-ski-lodge-hunter-ny">8/26</Link> Camp Bisco V at Hunter
              Mountain in Hunter, NY. This was Allen’s first Camp and proved to be an important weekend. At the time,
              these shows, 8/25 in particular, contained some of the most cohesive playing to date.
            </p>
            <p>
              Fans were thrown for a bit of a loop as the first show of the fall tour featured Shawn Hennessy on
              percussion and occasionally guitar. He joined the band again on
              <Link to="/shows/2006-10-31-orpheum-theater-boston-ma">10/31</Link> , as well as the next four shows after
              that. Some fans thought it seemed odd to add another new member into the mix just as Allen was really
              starting to find his footing. The experiment, however, was short lived as
              <Link to="/shows/2006-11-04-sonar-lounge-baltimore-md">11/4</Link> was the last show Shawn played with the
              band. Check out
              <Link to="/shows/2006-11-03-the-calvin-northampton-ma">11/3</Link> for some of the better playing with
              this lineup.
            </p>
            <p>
              With The Disco Biscuits performing once again as a quartet, Tour rolled on in Pittsburgh. The next night
              in Buffalo would prove to be eventful as the band performed their first ever palindrome with Allen, in the
              first set. Seamlessly moving from Spraypaint into Cyclone and then into Voices, back into Cyclone and
              finally finding a landing spot in the end of Spraypaint, this segment indicated just how in sync the band
              was. From Buffalo they traveled across the Midwest with stops in Cincinnati, Columbus, and Cleveland, OH,
              Bloomington, IN, Columbia, MO, Urbana, IL and Lawrence, KS. Two nights in Colorado had fans abuzz, with
              shows in Denver and Boulder. The Astronaut &gt; Ladies (inverted) &gt; Astronaut was heavily praised and
              represented a new high watermark with Allen behind the kit. After making two stops in Memphis and Atlanta,
              they headed back north and wrapped the Fall Tour up with two nights in New York at the Hammerstein
              Ballroom. (Recommended listening:
              <Link to="/shows/2006-11-24-hammerstein-ballroom-new-york-ny">11/24</Link> Robots)
            </p>
            <p>
              The end of Fall tour and the California run in December showcased a band that was feeling more confident
              by the day. By the time they closed out the year at The Tweeter Center (Susquehanna Bank Center) in Camden
              NJ, they had resoundingly quashed any fears fans had felt about the switch in drummers. The show featured
              DJ Switches (Bazaar &gt; Munchkin) as well as the debut of Orch Theme (Conspirator) a song that would
              ultimately become a fan favorite and heavy hitter.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2007</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              While it could be said that much of 2006 felt like a period of adjustment,{" "}
              <Link to="/shows/year/2007">2007</Link> found the Biscuits extremely comfortable with their new drummer
              and could be described as a time of high level experimentation and creativity. Setlists became more
              diverse and the band took more risks on stage as their confidence grew. On{" "}
              <Link to="/shows/2007-02-15-starland-ballroom-sayreville-nj">02/15/07</Link> the band brought back Spin
              the Wheel as a select group of fans got to come on stage, spin the wheel, and the band played whatever
              song it landed on. A whole slew of new originals (Air Song, Minions, Shadow, Rockafella, Sweatbox and
              Glastonbury) were debuted and to the delight of fans they dusted off Down to Bottom, Onamae Wa, and Pat
              and Dex (all first time played with Allen). Another exciting development of the weekend was the
              reintroduction of Strobelights and Martinis and Gangster. Both were reworked versions of 1.0 jams
              (Strobelights appearing in <Link to="/shows/2001-09-01-wetlands-preserve-new-york-ny">09/01/01</Link>{" "}
              Dribble and Gangster as the intro jam &gt; I-Man on{" "}
              <Link to="/shows/2002-12-29-electric-factory-philadelphia-pa">12/29/02</Link>
              ), now being presented as full-fledged songs. Both songs would go on to become staples in the band’s live
              repertoire and are used as jam vehicles to this day. These Starland shows would be a harbinger of good
              things to come in 2007 as the Disco Biscuits were ready to remind everyone that they can be the best band
              on the planet on any given night.
            </p>
            <p>
              Spring Tour yielded more quality shows as they played Chicago and an extensive run in the northeast and
              Mid-Atlantic. <Link to="/shows/2007-05-21-mr-small-s-funhouse-pittsburgh-pa">05/21/07</Link> is required
              listening for all fans and for good reason. The band expertly wove in and out of their songs with
              precision, dropping stunning improv along the way, as they blew the roof off of Mr. Smalls, just outside
              Pittsburgh, PA. Excitement within the scene grew as word spread that The Disco Biscuits had not only
              returned to form, but were breaking new ground on a nightly basis. June would be another important month
              for the band as they headlined Starscape in Baltimore, MD, played a legendary{" "}
              <Link to="/resources/tractorbeam">Tractorbeam</Link> show on{" "}
              <Link to="/shows/2007-06-26-chameleon-club-lancaster-pa">06/26</Link>, and played a six show run
              co-headlining shows with Umphrey’s McGee (dubbed D.U.M.B. tour). Their hot streak continued into July as
              they zigzagged across the country playing High Sierra Music Festival, two shows in Southern California,
              co-headlined festival Trancegression (with Umphrey’s) in Copper Mountain, Colorado, played Missouri,
              Wisconsin, and 10,000 Lakes Festival in Detroit Lakes, MN, and then finally back out to San Francisco and
              Berkeley, CA. You really cannot go wrong with any of these shows, but{" "}
              <Link to="/shows/2007-07-19-10-000-lakes-festival-detriot-lakes-mn">07/19/07</Link> epitomizes the
              creative setlist writing and inspired playing of 2007.
            </p>
            <p>
              In August, Camp Bisco found a new home in Mariaville, NY at Indian Lookout Country Club. This would prove
              to be a huge moment in Disco Biscuits history as ILCC would become the first venue to allow the Disco
              Biscuits back after holding the festival (and continued to so through 2013). Fall tour began in Florida
              and continued to bring the heat as they headed north through Georgia and Tennessee. Momentum built as they
              moved through the Midwest, back to North Carolina and then up through the Mid-Atlantic and then the
              northeast. Halloween in Boston was a special occasion as Jon Gutwillig's rock opera The Hot Air Balloon
              was performed in full for the 8th time. After Boston it was off to Albany, Columbus, Cleveland, and then
              finally to the tour closer in Buffalo, NY. Looking back, this tour is undoubtedly one of their finest.
              There are noteworthy jams and segues in virtually every show, although it could be argued that{" "}
              <Link to="/shows/2007-10-10-state-theatre-st-petersburg-fl">10/10</Link>,{" "}
              <Link to="/shows/2007-10-23-legends-boone-nc">10/23</Link>,{" "}
              <Link to="/shows/2007-10-26-rams-head-live-baltimore-md">10/26</Link>,{" "}
              <Link to="/shows/2007-11-01-the-palace-theatre-albany-ny">11/1</Link> and{" "}
              <Link to="/shows/2007-11-03-house-of-blues-cleveland-oh">11/3</Link> stand above the rest.
            </p>
            <p>
              In mid-December the band and fans headed off to Runaway Bay, Jamaica for Caribbean Holidaze, a jamband
              destination vacation. Co-headlined by Umphrey’s McGee, this event gave fans an opportunity to watch the
              band from the beach and even take excursions with band members. 2007 wrapped with a New Year’s run split
              between New York and Philadelphia, culminating with New Year’s Eve at the Tweeter Center (now the
              Susquehanna Bank Center). Fans still look back on this time period as a golden age of The Disco Biscuits
              and with good reason, the band was at the top of their game and the future looked bright.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2008</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Fresh off an incredibly successful 2007, four nights in Colorado started{" "}
              <Link to="/shows/year/2008">2008</Link> off on the right foot. Extended sections of improv were prevalent
              throughout this run, the 54 minute I-Man from{" "}
              <Link to="/shows/2008-01-19-dobson-ice-arena-vail-co">01/19</Link> in Vail being one of the many
              highlights. Three nights back at the Starland Ballroom and a set at the final Langerado served as somewhat
              of a warm up, before heading off to Europe for Jam in the Dam, with an additional three shows before and
              after the festival. Two major highlights of this European Tour occurred on{" "}
              <Link to="/shows/2008-03-21-magnet-club-berlin-germany">3/21</Link> and{" "}
              <Link to="/shows/2008-03-22-pumpehuset-copenhagen-denmark">3/22</Link>. Channeling the spirit of Berlin
              and the techno music that’s revered there, 03/21 featured relentless, hard hitting jams that reflected
              this German city splendidly. The following night in Copenhagen, Denmark delivered a performance that could
              not have been more different, instead showing off gorgeous soundscapes and gooey transitions (both
              Crickets &gt; Voices and Voices &gt; Rainbow song are master level segues).
            </p>
            <p>
              When comparing 2008 to the previous and following years, it might be easy to say that it was a down year,
              but if you go just by the shows in April it would be hard to tell. Playing fifteen shows over the course
              of the month, the Biscuits continued to polish and fine-tune their sound.{" "}
              <Link to="/shows/2008-04-11-nokia-theater-new-york-ny">04/11</Link> produced one of the top highlights of
              2.0 with the blissed out, buttery segue from Vassillios &gt; Spaga. A run through the south was punctuated
              by two highly praised shows at the Georgia Theater in Athens on{" "}
              <Link to="/shows/2008-04-18-georgia-theater-athens-ga">04/18</Link> and{" "}
              <Link to="/shows/2008-04-19-georgia-theater-athens-ga">04/19</Link>, before heading down to New Orleans
              for late nights at JazzFest. May was a very quiet month, with only two shows; Jam on the River and a late
              night at the Electric Factory in Philadelphia. June was also somewhat light on tour dates, with only 7
              performances. However, the music they played was anything but light.{" "}
              <Link to="/shows/2008-06-06-webster-theater-hartford-ct">06/06</Link> and{" "}
              <Link to="/shows/2008-06-07-ft-armistead-park-baltimore-md">06/07</Link> featured dark, heavy, danceable
              improv, while <Link to="/shows/2008-06-13-bonnaroo-music-festival-manchester-tn">06/13</Link> undoubtedly
              turned on a whole new group of fans, as they delivered a jaw dropping late night set at Bonnaroo (check
              out the opening sequence of M.E.M.P.H.I.S. &gt; Ladies &gt; Helicopters).
            </p>
            <p>
              The rest of the year was relatively quiet as the band spent a lot of time in the studio, working on an
              album that would never be officially released. Tour dates for the second half of 2008 were very sparse and
              almost all exclusively one-off festival dates. Camp Bisco VII, now in its second year at ILCC in
              Mariaville, NY continued to grow in popularity and performances by mainstream artists like Snoop Dogg and
              311... err, hold on. Was 311 there? No. Snoop seemed to think so though. Despite the lack of shows, the
              Biscuits came out swinging at Camp, delivering sets that tapped into the energy and cohesiveness they had
              found earlier in the year.
            </p>
            <p>
              The year ended strong as the band returned to Jamaica for Caribbean Holidaze. Not only was the playing
              extremely high level, but the band debuted four new songs (Uber Glue, High Speed Racer, and M80)
              foreshadowing the inspiration and creativity that would be displayed the following year. While the improv
              was especially good all weekend, it is the jam out of Vassillios on{" "}
              <Link to="/shows/2007-12-14-caribbean-holidaze-runaway-bay-jamaica">12/14</Link> that could be considered
              the crown jewel of Holidaze. The exquisite, cascading melody that developed out of this classic song was
              nothing short of breathtaking.
            </p>
            <p>
              2008 ended with a five night run at the Nokia Theater in New York. The shows certainly had their moments,
              especially <Link to="/shows/2008-12-28-nokia-theater-new-york-ny">12/28</Link> and{" "}
              <Link to="/shows/2008-12-30-nokia-theater-new-york-ny">12/30</Link>, but{" "}
              <Link to="/shows/2008-12-31-nokia-theater-new-york-ny">12/31</Link>, set three in particular (which
              included almost all new material and a Matisyahu sit-in) left fans wanting more. Luckily for them, the
              band would be back on the road in a few weeks, breaking new ground and eviscerating everything that stood
              in their path.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2009</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              When the band hit the road in early January, excitement was palpable. While they had played at a high
              level in the first half of 2008, there was no tour in the second half, and fans were ready to go out and
              jam when things kicked off with two nights in Northampton. The shows served as notice that the Biscuits
              would be taking no prisoners in ‘09. The improv was dark and aggressive and often synthesized into
              melodic, thematic peaks. Triumph &gt; Basis from{" "}
              <Link to="/shows/2009-01-16-the-calvin-northampton-ma">1/16</Link> exemplifies how locked in they were
              right out of the gate and things would only grow from there.
            </p>
            <p>
              Audiences were delighted in Buffalo, NY, Columbus, OH and Madison, WI as the band showed off their new,
              seemingly deliberate sound. <Link to="/shows/2009-01-23-first-avenue-minneapolis-mn">1/23</Link> in
              Minneapolis, MN featured a 30 minute Confrontation &gt; Gangster, which covered a lot of ground, and the
              band continued to build on the momentum of the early tour successes as they moved on to Chicago and
              Urbana. Tour rolled on from the midwest to the south, with stops in Nashville, Knoxville and Atlanta.
              Pygmy &gt; Abraxas from <Link to="/shows/2009-01-31-the-tabernacle-atlanta-ga">1/31</Link> in Atlanta
              again demonstrated the heavy, ominous spaces they could often find themselves in in 2009. Shows in
              Tuscaloosa, AL, Oxford, MS, and Tulsa, OK, as well as three dates opening up for Government Mule in
              Austin, Houston, and Dallas, TX rounded out this southern leg of the tour.
            </p>
            <p>
              The next three nights of tour— <Link to="/shows/2009-02-13-ogden-theater-denver-co">2/13</Link> and{" "}
              <Link to="/shows/2009-02-14-ogden-theater-denver-co">2/14</Link> in Denver, CO and{" "}
              <Link to="/shows/2009-02-15-liberty-hall-lawrence-ks">2/15</Link> in Lawrence, KS respectively—again found
              the band pushing boundaries and tapping into a creative energy that felt new and refreshing. There are
              numerous highlights, but 02/13 Shem-Rah &gt; Lunar Pursuit, and 2/15 42 &gt; Spacebird (as well as the
              majority of the 2nd set) stand out as required listening.
            </p>
            <p>
              After a ten day break, it was back to the northeast and back to producing aural gold on a nightly basis.
              Dynamic jamming wowed crowds in Portland, ME, Burlington, VT (2 nights), and Boston.{" "}
              <Link to="/shows/2009-02-27-the-new-higher-ground-south-burlington-vt">2/27</Link> The Very Moon &gt;
              Vassilios and <Link to="/shows/2009-02-28-house-of-blues-boston-ma">2/28 </Link>
              Cyclone &gt; Basis are representative of the peaks they were able to reach on this run. Winter tour
              wrapped up with March dates in Baltimore, MD and Richmond, Norfolk, and Charleston, VA. (Recommended
              listening: <Link to="/shows/2009-03-05-norva-theater-norfolk-va">3/05</Link> Abyss &gt; Spacebird) This
              leg of tour was supposed to end with a set at Langerado, but the festival was canceled in February "due to
              sluggish ticket sales."
            </p>
            <p>
              Spring tour began in April on the west coast with shows in San Francisco, CA, Crystal Bay, NV, and Eureka,
              CA. Voices &gt; Air Song &gt; Voices from{" "}
              <Link to="/shows/2009-04-04-crystal-bay-club-casino-crystal-bay-nv">4/04</Link> is massive. Unfortunately
              just as things started to get cooking out west, a family emergency back home necessitated the rest of the
              run to be canceled.
            </p>
            <p>
              Shortly before Spring Tour started, it was announced that the opening two nights at the Electric Factory
              would be three sets apiece. Anticipation grew within the community as the band got ready to throw down in
              their hometown. These two shows did not disappoint with standout segments of Caves &gt; Dribble &gt;
              Shem-Rah and Spraypaint &gt; Cyclone &gt; Spraypaint on{" "}
              <Link to="/shows/2009-04-17-electric-factory-philadelphia-pa">4/17 </Link>
              and The Very Moon &gt; Orch Theme and Hot Air Balloon &gt; Great Abyss &gt; Hot Air Balloon on{" "}
              <Link to="/shows/2009-04-18-electric-factory-philadelphia-pa">4/18.</Link>
            </p>
            <p>
              The rest of the spring tour included stops in Bridgeport, CT, Washington, D.C, Louisville/Covington, KY,
              and the tour closer in Asheville, NC. Fans were again delighted as top notch jams were dropped at nearly
              every stop. <Link to="/shows/2009-04-20-9-30-club-washington-dc">4/20</Link> Crickets would become one of
              the most talked about and revered jams of the year. Finding themselves in dark and haunting, yet beautiful
              territory, the band’s communication on stage, some thought, could only be explained by telepathy.{" "}
              <Link to="/shows/2009-04-23-headliners-music-hall-louisville-ky">4/23</Link> Run Like Hell &gt; Humu
              (inverted) was monstrous and exhibited a stark juxtaposition in jamming styles (when compared to 4/20
              Crickets), with the jamming and transition being silky smooth and bubbly.
            </p>
            <p>
              After taking most of May off, Summer Tour launched in Colorado as fans were reintroduced to the annual
              event Bisco Inferno for the first time since 2003. After playing a night at the Ogden on{" "}
              <Link to="/shows/2009-05-29-ogden-theater-denver-co">5/29</Link> (Recommended listening: Spacebird &gt;
              Cyclone &gt; Spacebird and Morph &gt; Caves), they headlined their first show at Red Rocks on{" "}
              <Link to="/shows/2009-05-30-red-rocks-amphitheater-morrison-co">5/30</Link> with support from Paul
              Oakenfold, Z-Trip, RJD2, The New Deal, Orchard Lounge and Lotus.
            </p>
            <p>
              June was a month that found the band reaching for the{" "}
              <span style={{ color: "black", backgroundColor: "hotpink", padding: 4 }}>stars</span> on a nightly basis.
              Starting things off with a full performance of{" "}
              <Link to="/resources/chemical-warfare-brigade">Chemical Warfare Brigade</Link> in Providence, RI on{" "}
              <Link to="/shows/2009-06-03-lupo-s-heartbreak-hotel-providence-ri">6/3</Link>, the band then traveled to
              Buffalo for a free outdoors show in Lafayette Square.{" "}
              <Link to="/shows/2009-06-05-house-of-blues-cleveland-oh">6/05</Link> in Cleveland, OH might be one of the
              most complete shows of this banner year start to finish, but it would be criminal to not at least mention
              the Vassillios &gt; HAB and the Basis from this storied evening.{" "}
              <Link to="/shows/2009-06-06-ft-armistead-park-baltimore-md">6/06</Link> at Starscape provided one of the
              crazier backdrops for a show (and in our scene that’s really saying something). Anyone who was there
              probably remembers the marathon second set, the cop twirling glowsticks and the Robots encore with the sun
              fully up.
            </p>
            <p>
              After an 18 day break from the road, <Link to="/shows/2009-06-24-bottle-cork-dewey-beach-de">6/24</Link>{" "}
              gave fans an intimate experience at the Bottle & Cork in Dewey Beach, DE and{" "}
              <Link to="/shows/2009-06-25-house-of-blues-atlantic-city-nj">6/25</Link> through{" "}
              <Link to="/shows/2009-06-28-church-of-universal-love-and-music-acme-pa">6/28</Link> represent peak 2009
              Biscuits. Some fans passionately argue that the creative energy that they brought to these shows is
              unparalleled. This type of sentiment is backed up by blistering segments like Hope &gt; Digital Buddha
              &gt; I-Man on 6/25, Strobelights &gt; Minions on{" "}
              <Link to="/shows/2009-06-26-house-of-blues-atlantic-city-nj">6/26</Link>, Story &gt; Pilin’ and Astronaut
              &gt; Helicopters from <Link to="/shows/2009-06-27-the-state-theater-state-college-pa">6/27</Link>.{" "}
              <Link to="/shows/2009-06-28-church-of-universal-love-and-music-acme-pa">06/28</Link> was a psychedelic
              experience at the Universal Church of Love and Music in Acme, PA where a number of fans camped on site.
              Many remember the mammoth Run Like Hell that opened the show (complete w/ samples from the speech given
              earlier that day by the venue owner). The run finished up with shows in Columbus, OH, Indianapolis, IN and
              two nights at Rothbury Music Festival in Michigan (recommended listening: Caterpillar &gt; Crickets &gt;
              Aceetobee &gt; Caterpillar and Hope from{" "}
              <Link to="/shows/2009-07-01-murat-egyptian-room-indianapolis-in">7/1</Link>
              ). Two nights at High Sierra Music Festival in Quincy, CA, an extremely soggy weekend at their own Camp
              Bisco in Mariaville and an appearance at Fuji Rock Festival in Naeba, Japan wrapped up Summer Tour.
            </p>
            <p>
              Over the summer, You and I started showing up on setlists. First debuted on the radio in April, it
              garnered lukewarm reception from fans. The first song to be released from their latest (extensive) studio
              sessions it signaled a somewhat obvious shift in songwriting. It relied heavily on pop elements and was
              very different from the complex musical arrangements the band was known for early in their career. As the
              year progressed, the song started to fit better into the live setting and it became a tongue-in-cheek
              favorite for some fans.
            </p>
            <p>
              Fall tour commenced in September in Baltimore and continued for a month through the south, finally
              trekking back up to the Mid-Atlantic by early October. Fresh off of a month and a half break, the band
              sounded fresh as things got under way.{" "}
              <Link to="/shows/2009-09-11-hippodrome-theatre-baltimore-md">9/11</Link> Vassillios &gt; You and I from
              Baltimore and <Link to="/shows/2009-09-13-starland-ballroom-sayreville-nj">9/13</Link> Orch Theme from
              Starland Ballroom provide clear illustrations of focused and confident playing. As they went South,
              experimentation on stage came to the forefront again. Quite polarizing at the time,{" "}
              <Link to="/shows/2009-09-17-george-s-majestic-fayetteville-ar">9/17</Link> Shimmy saw the band dip their
              proverbial toes into the dubstep waters in Arkansas.{" "}
              <Link to="/shows/2009-09-18-palladium-ballroom-dallas-tx">9/18</Link> at the Palladium Ballroom in Dallas
              was another highly regarded show with standout segments Sound One &gt; Tempest &gt; Sound One and Shem-Rah
              &gt; HAB, the latter producing one of the most beautiful, blissful jams of the year.{" "}
              <Link to="/shows/2009-09-19-stubb-s-bar-b-q-austin-tx">9/19</Link> at Stubbs in Dallas, TX electrified the
              band and fans alike prompting Jon to say “It was like we were throwing touchdown passes the whole show."
              (Recommended listening: Mirrors &gt; Basis)
            </p>
            <p>
              Tour marched on through Tuscaloosa, AL, Oxford, MS and then Nashville,TN.{" "}
              <Link to="/shows/2009-09-24-cannery-ballroom-nashville-tn">9/24</Link> in Nashville is famous for the
              Shimmy &gt; Boom Shanker &gt; Shimmy, but don’t sleep on the second set. Atlanta, GA, Knoxville, TN,
              Charlotte/Boone, NC, and Richmond, VA concluded the Southern run of fall tour. After two nights at the
              9:30 Club in D.C. (Recommended listening:{" "}
              <Link to="/shows/2009-10-03-9-30-club-washington-dc">10/03</Link> Floodlights) they continued north to
              State College, PA and Burlington, VT. The monster opener of MEMPHIS &gt; Rock Candy on{" "}
              <Link to="/shows/2009-10-07-the-new-higher-ground-south-burlington-vt">10/07</Link> is a journey through
              electronic soundscapes and is representative of this fruitful fall tour. Things on the east coast wrapped
              up with shows in Hampton Beach, NH, two shows in Northampton, MA and their first appearance at the
              Brooklyn Bowl in Brooklyn, NY (How did that tank get in there?)
            </p>
            <p>
              The second midwest run of the year led up to and followed their Halloween show at the Auditorium Theater
              in Chicago, IL, with stops in Kalamazoo, MI, Madison, WI, Minneapolis, MN, and Urbana, IL. By mid-November
              it was back to the west coast and California to make up shows (from April) in San Diego, West Hollywood,
              San Francisco, and Santa Cruz. <Link to="/shows/2009-11-20-the-fillmore-san-francisco-ca">11/20</Link>{" "}
              Grass is Green &gt; Minions &gt; Grass is Green is one of the hidden gems of the year. It was during the
              fall that more new songs like Flash Mob, Widgets, Loose Change, and Fish out of Water started appearing in
              setlists, eliciting mixed reviews from fans. Catalyst, first apearing as an instrumental, received
              slightly higher praise. Two highly anticipated post-thanksgiving shows at the Electric Factory wrapped up
              fall tour, but fell slightly short of the high level playing fans had come to expect in this exceptional
              year. Carribean Holidaze in mid-December again provided fans an opportunity to relax in Jamaica and see
              their favorite band in paradise.
            </p>
            <p>
              In a year that provided highlight upon highlight, it was natural that they were slightly fatigued as the
              year came to a close. When New Years Run opened up at the Nokia in Times Square, however, it was clear
              they were ready to end the year with a bang. Everything that made 2009 great was on display. Creative
              setlists and ferocious, focused, thematic jamming were common over the 5 night run. The opening set of
              Strobelights &gt; Shem Rah &gt; Rock Candy &gt; Abraxas &gt; Spaga and the debut of Portal to an Empty
              Head on <Link to="/shows/2009-12-26-nokia-theater-new-york-ny">12/26</Link> got the ball rolling. Koncrete
              from <Link to="/shows/2009-12-27-nokia-theater-new-york-ny">12/27</Link> showed the potential that the new
              songs could bring and those in attendance will never forget the fire alarm Floes on{" "}
              <Link to="/shows/2009-12-28-highline-ballroom-new-york-ny">12/28</Link>.{" "}
              <Link to="/shows/2009-12-30-nokia-theater-new-york-ny">12/30</Link> is another fan favorite with a massive
              Crickets in the first set and fully segued, masterful second set. Gangster &gt; Waves &gt; Shem Rah Boo
              from <Link to="/shows/2009-12-31-nokia-theater-new-york-ny">12/31</Link> gave fans a reason to celebrate,
              playing Shem Rah Boo’s ending for the first time in over a year. The Second set is highlighted by the new
              years countdown medley (Consisting of Orch Theme &gt; Morph Dusseldorf &gt; Run Like Hell &gt; Aceetobee
              &gt; Vassillios &gt; Mr. Don &gt; Above The Waves &gt; Munchkin Invasion &gt; Crickets) which kept fans
              guessing right down to the Basis countdown. The third set does not let up as Down To the Bottom &gt; Naeba
              &gt; Humu delivers the goods.
            </p>
            <p>
              The year was over and everyone’s hearts were full. The Disco Biscuits had conquered the world in 2009 and
              with a new album on the horizon, fans were optimistic that there was nothing that could stand in the
              band’s way. While sometimes it feels like there’s always something lurking around the corner in Biscuits
              land, no one could have predicted what the following months would have in store.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2011 - 2019 - Setbreak</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              During the 8 years from 2011 - 2019, the band did not tour - instead just performing periodic series of
              limited engagement runs (4 nights in Colorado, NYE Run, Camp Bisco, etc).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2019 - Present - Setbreak is Over</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              In September of 2019 in a series of social media posts, the Disco Biscuits announced "Setbreak is over.
              Gas tank's refilled. We are back." Shortly thereafter, they announced their 2019-2020 Winter Tour, playing
              23 shows in a 2 month period, including 3-night runs in Florida and Chicago and a 4-night New Year's Eve
              run at the Playstation Theater in New York City.
            </p>
            <p>
              In January of 2020 the band announced "Act 1" - a 19-show tour starting with a 3-night run in March at the
              Fillmore in Philadelphia and culminating in the band's annual Camp Bisco festival in July.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BandHistory;
