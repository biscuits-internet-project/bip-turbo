import type React from "react";
import Markdown from "react-markdown";
import { Link, useNavigate } from "react-router-dom";
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
    { title: "The Chemical Warfare Brigade" },
    {
      name: "description",
      content:
        "The band's second full length rock opera, written by Marc Brownstein, and debuted Dec 30, 2000 at the Vanderbilt on Long Island.",
    },
  ];
}

const ChemicalWarfareBrigade: React.FC = () => {
  const chars: Character[] = [
    {
      name: "Amos Anderson",
      anchor: "amos",
      copy: "A large fellow from a very young age, Amos was raised in rural Tennessee. He is a rugged, handsome fellow, but has never been considered the brightest guy by his peers. He doesn't have many friends and spends a good deal of time drinking and fantasizing about what could have been had he decided to finish high school. Instead he dropped out so he could get a job and be a little more desirable to the very few women in the surrounding towns. Sufficed to say, many years later he is quite the opposite. He has very little actual ambition, very little money, and is extremely unsure of himself. Any time he really had had a chance with the ladies, he seemed to blow it. Meeting Shelby Rose seemed too good to be true, but he never asked thought twice when this sexy young women threw herself at him on night at Albert Lia's compound… currently out of work, hasn't had any work since he had a job doing carpentry at Albert Lai's compound a few summer back. Seems to be trustworthy and considers himself a good friend of Lai's and to no-ones surprise, Lai feels the same way...",
    },
    {
      name: "Albert Lai",
      anchor: "bert",
      copy: "Albert, or Bert, as his close friends called him, was always a very mysterious character. He never really talked that much, but always seemed to be enjoying himself in any situation. Nobody who knows Albert in town really knows what he \"does\" for a living. Everyone in town had their ideas. He has held a residence outside the town in the foothills for three years. He doesn't really seem to work or need any more money then he already has. He has what seems to the locales to be an extremely extensive security system, especially for the area, a notoriously crime free district. But he has been host to some of the greatest parties that have ever been thrown in the neighborhood, at least in Amos' memory, and there always seemed to be an abundance of alcohol and women ay his compound. Bert has numerous residences, but has spent most of his adult life running a money laundering operation out of a Newark, New Jersey restaurant called Empire Hunan, and has strong connections to organized crime families in New York, New Jersey, Pennsylvania, Chicago, and Kansas City. His compound in Tennessee was rarely used for business, rather was used as a place where he could entertain potential business associates, friends and family.",
    },
    {
      name: "Doctor Edwin Von Stadt",
      anchor: "von-stadt",
      copy: "Pronounced properly his name translates to Edwin of the City, which was fitting, except he was born in New York City, not Munich, where his ancestors were from. The Doctor hadn't been called anything but Doc or Doctor in many years. He has been a chemist for thirty years or so. He has a twenty year old son named Lukas who he hasn't seen in years. He grew despondent around five years ago when Lukas' mother, whom he had lived with for many years but never married, took Lukas and left. He transferred to the local university several years ago after many years without tenure at City College of New York. He felt that the change of scenery would be good for him as he got older and he hadn't felt better in years. He is an aloof man, whose mind is wandering in the gaseous clouds of his laboratory, even if his body is parked on a barstool at one of the several local watering holes. He doesn't really have a great deal of money, but on the other hand, he never really wanted any. But something about living in the country changed all that. Maybe it was the lack of excitement or the lack of noise, or just seeing that mansion up on the hill and wondering how much it would cost to have a place like that. He liked the country, but if he could have his way, he'd live somewhere a little warmer. He would be much better off on the beaches of a far away place like Fiji, Micronesia, or the Galapagos.",
    },
    {
      name: "Amy Willard",
      anchor: "willard",
      copy: "Amy is a thirty-three year old agent for the Federal Bureau of Investigation, although you'd never imagine her to be a day over twenty-two…she had always wanted to work in law enforcement. Her parents had always expected her to go to law school, just like her father and two of her brothers, but she had other ideas. Amy had never been the same since she had seen Silence of the Lambs so many years ago. Graduating after just seven semesters at Georgetown, she went to the FBI training center. She graduated from the training program six years earlier and qualified for undercover work when she was twenty five. After spending two six month stints living in college dormitories in similar drug stints, she was transferred to her third undercover job to the local university, where it was believed that a young man had immersed himself in a large operation of producing and distributing amphetamines. In her second month at the school, under the alias of Shelby Rose, her investigation had ended her up at Albert Lai's compound for an all night party, where rumor had it, several ounces of the unnamed drug was going to transferred from one person to another. It was at this party that she became curious that something larger then they suspected was going on in the area. The drug ring seemed to have links to several other major metropolitan areas, and she suspected possible mafia ties. It seemed that hanging around at the compound, and Bert was a sucker for having young college girls at the house, would be in her best interest.",
    },
  ];

  const acts: Act[] = [
    {
      name: "The Plan",
      anchor: "the-plan",
      setting:
        "The Plan was simple. Amos knew what was going on over at Bert's. When the construction jobs dried up at the compound, Bert had told Amos that he could come to him if he ever needed anything. It was when he repeated himself and said emphatically, \"Anything\", that Amos understood. Amos always turned down Bert's offer for \"legal\" work. But one night at in a drunken conversation with the doctor at a local bar, Amos finds out about a chemical that the doctor is working with at the University. The research indicates that the chemical kills anything that it comes into contact with, but that it leaves virtually no trace of itself. The research project on the chemical, which the University had named Veritin-22, was originally funded to see if there could be possible uses for it as a pesticide, but the research indicates that there is no control over what it kills. It kills basically everything that it comes into contact with, and the doctor speculates in passing that even a small amount could kill a large population of buffalo, or elephants, or monkeys, or even people. And as a product of the chemical decomposition, it wouldn't leave a trace of itself. The perfect chemical weapon. They decide to have a meeting with Albert Lai to see if any of his friends could use such a powerful stealth weapon. Both of these guys need a big score. They do some simple math and realize they could potentially put hundreds of thousands of dollars in their pockets, if their consciouses could take it. And hell, to these guys, that's like millions.",
    },
    {
      name: "The Meeting",
      anchor: "the-meeting",
      setting:
        'The Meeting took place at the compound, which Amos was happy about, as any trip to the compound was more exciting then his average day, and considering that he helped build it, he knew the ins and outs of the place, which made him feel smart, which he liked a lot. The idea intrigued Lai and he liked the fact that a scientist was involved. Actually, his first thought was that the Doctor may be involved with the authorities, but he knew a quick background check would clear up any of his concerns. He figured that they could all make millions with his connections in China and Nicaragua, and the Doctor indicated that he could basically produce an endless supply of this as long as the "research project" continued. Lai was defiantly interested, as long as everything checked out okay. He insisted that the Doctor and Amos stick around for one of his patented shindigs, which was already going on outside the cabana at the pool. When the meeting adjourned, they allowed themselves the pleasure of a few drinks and some casual flirting with some of the local college girls.',
    },
    {
      name: "The Party",
      anchor: "the-party",
      setting:
        "The party was fantastic, from the viewpoint of Amos. They left the meeting and went to the bar. Of course, the parties, although large and exciting, were invite only. Bert insisted that they meet some of the girls that were mulling around. He introduces Amos to Shelby as a business associate, which made Amos feel important. Shelby acted really interested in everything that Amos said as he was the first business associate of Lai's that she had meet who seemed vulnerable. In the two months that she had been hanging around Lai's there was never any talk of business around the ladies. Never. She couldn't seem to penetrate his business dealings, until she meet Amos. She sensed his weakness and figured she would go even deeper undercover than her job had ever required. But that was Amy, always going the extra distance, and besides, this guy actually seemed really innocent. And he was attractive. And she hadn't had any sexual relations in some time. So Amy, or Shelby as Amos knew her, engaged Amos in the time of his life. He was in love immediately. A beautiful, smart, funny girl, and she was young, and best of all, she seemed to like him. When the Doctor was passing out near the guest house, Shelby and Amos were sitting quietly by the pool getting to know each other.",
    },
    {
      name: "The Deception",
      anchor: "the-deception",
      setting:
        "What seemed like weeks went by and Amos couldn't believe it. This was his first real girlfriend, truly amazing. Walks in the park, hikes that led to waterfalls, and trips to the zoo packed Amos' next few days. He spent all of his free time, which was most of his time, with Shelby. He even let on to her that would take a vacation together to the islands as soon as some money came in, which would be soon. You see, the future was bright. He was nervous that she would get bored of him, and so he told her how rich he was going to be, hoping that she would stay with him. It was not before long, and not without ample prodding by Shelby that Amos told her all about the plan to make the chemical weapon and sell it and retire to the islands. The Chemical Warfare Brigade, he called the three of them. She finally had some insider information into Albert Lai's dealings. And it just so happened that her knowledge of the plan could save potentially hundreds of thousands of lives. But then the plan changed. Amos ultimately convinced Doctor Von Stadt that if they left Lai alive they would end up dead, and if they made the chemical, thousands of people would die. Amos was able to convince the Doctor that killing Lai was absolutely necessary. They could always back out, but they were already knee deep in this thing. And the truth was, however they could get the money, they would at this point. So they revamped their plan yet again. It was official. Plan B. Go in shooting, take the money, and get the hell out of there.",
    },
    {
      name: "The Confrontation",
      anchor: "the-confrontation",
      setting:
        "Everything went exactly as planned. Amos knew all about the security systems on the compound. He had installed most of them. They came in and took out one guard, and then went for the security mainframe. When it was disengaged, they waited at the bottom of the stairs for the second guard. As he came down the stairs, they took him out. They went up the stairs to Lai's office. Before he could even say anything, he was shot. A shootout with the three bodyguards that were remaining ensued, and Amos and the Doctor were the last men standing.",
    },
    {
      name: "The Outcome",
      anchor: "the-outcome",
      setting:
        "As they left the house, they heard the helicopters, and saw the floodlights. They heard the sirens in the distance. The cops were there. Already. The Doctor never told anybody about this. Who had Amos told? Before Amos could even give a reason for why it was okay that he told Shelby what he was doing that evening, the Doctor, formally a meek man, turned his gun on Amos, and at once, removed his face from what was once his head. And then he started to run. He ran for his life. And as he ran, all of the facts of the story started to flash randomly through his mind. Flashbacks. He is running so hard, he starts to hallucinate. The lights are shining from the sky. There is faint screaming in the distance, and he knew that the law was on his tail. He has always stayed in good shape, but he was never prepared for this kind of a chase. The Doctor, when backed against the wall by a group of screaming agents, knows that there is only one thing that he can do. He realized that he can not live through the horror of a trial and a life in prison with a possible death penalty. He knew the truth. Death was an inevitable part of life. Everyone's time would come, and his had. He had had fantasies for many years. Big dreams. Maybe in another life. The doctor turns the gun on himself and pulls the trigger.",
    },
  ];

  const songs: Song[] = [
    {
      name: "Plan B",
      anchor: "planb",
      setting:
        "P.O.V. of the Doctor. It sets up a flashback situation. The story starts with the Doctor running down a narrow path in the middle of the night, setting up the theme of the story, life and death, and the preparedness for the inevitable. The verses of the song explain a little history of the main characters. The Doctor never thought that he would ever become the type of man to be in the middle of something like this. He was a scientist. That was his talent. He never imagined doing anything illegal, although for some reason he also thought he'd never get caught.",
      lyrics: `I never imagined that I'd use my talent like this.
      I never imagined that freedom was something I'd miss.
      But now that I'm on the run, if anything stands in my path,
      I wouldn't hesitate, and you'll have to suffer my wrath.

      Running down a narrow path, in the middle of the night.
      I knew that the law was catching up, and that there would be a fight.
      Just as I thought there was no way out, a fork in the path was in sight.
      I had to run for my life.

      I knew that something was wrong the second he walked through the door.
      He said he wanted to run the second we picked up the score.
      Given the circumstance I loaded my pistol and left.
      The feds would put me away for more than a third-degree theft.

      Running down a narrow path, in the middle of the night.
      I knew that the law was catching up, and that there would be a fight.
      Just as I thought there was no way out, a fork in the path was in sight.
      I had to run for my life.

      I believe it all started up in the mountains last year.
      I had no problems but Amos expressed his fear.
      All it would take was a trip to the city one night.
      When horrors ensued, I couldn't endure the fight

      Running down a narrow path, in the middle of the night.
      I knew that the law was catching up, and that there would be a fight.
      Just as I thought there was no way out, a fork in the path was in sight.
      I had to run for my life.
      I had to run for my life.`,
    },
    {
      name: "Little Lai",
      anchor: "lai",
      setting:
        "Is a story about Amos, the Doctor, and their connections to Bert, the quiet and calm leader of an organized crime group in New Jersey. The first verse is a recount from the Doctors perspective, explaining the fact that he leads a simple and frugal life. It is not until he sees the inside of Bert's compound that he truly got excited about the money that they were going to make. The story of the meeting and the party are referenced in this song.",
      lyrics: `I was born on the streets of New York City,
      where growin' up was easy just the same.
      I didn't know what I had,
      And I didn't know what I was missing,
      'Til I met Little Lai and he showed me the way.

      Bert wouldn't tell me anything,
      Even when I'd asked him everything.
      Baby look inside,
      For Little Lai you cannot hide,
      And for a couple of days we'll take it all in stride.

      Little Lai had a business proposition,
      And he knew that I wouldn't say no.
      He took me into the glow of the cabana,
      And he asked all the ladies to go.
      He used a key the kind I'd never seen,
      And the box opened up in the light.
      Lai assured me that the deal was good,
      And that the ladies were the rest of the night.

      Bert wouldn't tell me anything,
      Even when I'd asked him everything.
      Baby look inside,
      For Little Lai you cannot hide,
      And for a couple of days we'll take it all in stride.

      Baby look inside,
      For Little Lai you cannot hide,
      And for a couple of days we'll take it all in stride.

      Little Lai was on a path of self-destruction,
      All the fun he had had was just a game.
      He didn't know where he was,
      And he didn't know where he was going,
      Last I saw Little Lai he was boarding the train.

      Bert wouldn't tell me anything,
      Even when I'd asked him everything.
      Baby look inside,
      For Little Lai you cannot hide,
      And for a couple of days we'll take it all in stride.`,
    },
    {
      name: "And the Ladies Were the Rest of the Night",
      anchor: "ladees",
      setting:
        "The Ladies is told from Amy Willard's point of view. He wouldn't give it up…she couldn't seem to get any information on Albert Lai, and she knew he was at least involved in her drug investigation. She tried to get a tap into the compound, but the security was too tough. And Lai never spoke business around the Ladies. She knew upon meeting Amos that he was the weak link. Just a hunch. She pursued him and went beyond the call of duty, shall we say, DEEP undercover.",
      lyrics: `Come on all the ladies, get down tonight.
      Know a little agent who has set her sight.
      Come on all the ladies, get down tonight.
      Give it up! Give it up!

      It took a few months to infiltrate,
      In just one night he bit the bait.
      It didn't seem Lai would give it up.
      Even when Shelby spiked his cup.

      He ran a tight ship and closed his mouth,
      Every time the ladies were in the house.
      Everything she did was done in vain.
      Couldn't get a wire tap in the drain.

      Give it up! Give it up!

      Come on all the ladies, get down tonight.
      Know a little agent who has set her sight.
      Come on all the ladies, get down tonight.
      Give it up! Give it up!

      Little Shelby Rose, this is how it goes,
      And you know what it takes.
      Careful what you say, careful what you do,
      Can't afford a mistake.

      Come on all the ladies, get down tonight.
      Know a little agent who has set her sight.

      Little does he know she has him read.
      In a couple minutes, they're off to bed.
      Takes another name and sculpts her clay,
      And not before long she's got her prey.

      Come on all the ladies, get down tonight.
      Know a little agent who has set her sight.`,
    },
    {
      name: "Floodlights",
      anchor: "floodlights",
      setting:
        "This song serves as a reminder to the listener that as the story is being told, the Doctor is still being chased. The lights are swinging back and forth from above, and he continues to run for his life. In the distance are sirens, faint yelling, and dogs barking. The Doctor is coming to grips with the fact that he is, for the first time ever, actually facing death. And it is during Floodlights that the Doctor first realizes that he the power to end this all.",
      lyrics: `Where did I go wrong, and it wasn't too long ago.
      I didn't think I would ever change me.
      but I know that it did, That the fruit that I was tempted by.
      It didn't sink in, until the lights flashed in my eye.

      And I knew they were flying up above in the sky.
      I wouldn't let up until I couldn't push anymore.
      And I thought if I ever had a chance before,
      And I was set up, and now I'd say my chances are poor.

      And you run for your life,
      And you hide from the lights as they shine from the sky.
      When your life's on the line,
      And you think in your mind, are you ready to die?

      How can I go on, and I'll live a long life you know
      If I could outrun the whole damn state
      And I think of the time that I didn't have to run
      And then I thought it, I may never see the sun

      In the morning all I got left is my gun
      And I will use it to get myself out of this mess
      And I thought if I'd ever taken more or less
      Then I'd abuse it and all I'd have left is my stress

      And you run for your life,
      And you hide from the lights as they shine from the sky.
      When your life's on the line,
      And you think in your mind, are you ready to die?`,
    },
    {
      name: "Shelby Rose",
      anchor: "shelby",
      setting:
        "The lust song. Amos, thinking that he is in love, recounts the excitement he feels for his new relationship. And for Amos, every night with Shelby truly is Heaven sent. The irony is that this relationship is the best AND worst thing that has ever happened to Amos.",
      lyrics: `Springtime come, and the flowers bloom.
      Quiet walk in the park.
      And the sun sinks and reddens.
      Shelby Rose in the dark.
      A yellow bird on a tree stump.
      You take a stroll by the lake.
      And when you see Shelby coming,
      You feel your heart palpitate.

      And I suppose I can tell Shelby Rose how I feel.
      And I suppose I can tell Shelby Rose what I do.

      And in a few days you tell her,
      that the future is bright.
      You fill her in on the prospect,
      And she fills with delight.
      It's a good thing you tell her.
      Because you know that she'll stay.
      You celebrate with some champagne,
      And you wake the next day.

      Every day is a walk in the park, every afternoon to the days turn dark.
      Every night is heaven sent.
      Every night is heaven sent.
      Every day that I spend with you, every afternoon that we go to the zoo.
      Every place we ever went.
      Every night is heaven sent.`,
    },
    {
      name: "Chemical Warfare Brigade",
      anchor: "cwb",
      setting:
        "Back to the Doctors point of view. More thoughts from the Doctor about his present situation. The Chemical Warfare Brigade, as he and Amos jokingly called the three of them in a drunken stupor one night, actually did represent the only chance that these guy had ever had for prosperity. At one point, the future was bright, but now the Doctor knows what the outcome of this all is going to be...",
      lyrics: `I just took out two men,
      Because they knew too much.
      Body count's up to ten,
      I never planned as such.

      Many more people will die,
      If this story's not told,
      But it may be too late.

      When it's over I won't be around,
      See the trees as they fall to the ground.
      You could say that I warned you of this in the past,
      And you hide in the shadows they cast.

      I remember the time,
      When I first met Lai.
      I thought I had it made
      The Chemical Warfare Brigade.

      And then it happened again,
      Too much was never enough.
      As it is with everything,
      It made us feel strong.

      And Amos told me how,
      He thought we could triple our buck.
      We had to resort to Plan B,
      'Cause our first plan had run out of luck.

      When it's over I won't be around,
      See the trees as they fall to the ground.
      You could say that I warned you of this in the past,
      And you hide in the shadows they cast.

      Oh, the Chemical War Brigade,
      Three men tall, expecting it all
      Oh, the Chemical War Brigade,
      This is there for our future.
      (Marc: Nowhere to run, nowhere to hide,
      Backs on the wall, there's only one way out of)
      Oh, the Chemical War Brigade,
      Three men tall, expecting it all
      Oh, the Chemical War Brigade,
      This is there for our future.

      Oh, the Chemical War Brigade,
      Three men tall, expecting it all
      Oh, the Chemical War Brigade,
      This is there for our future.
      (Marc: Nowhere to run, nowhere to hide,
      Backs on the wall, there's only one way out of)
      Oh, the Chemical War Brigade,
      Three men tall, expecting it all
      Oh, the Chemical War Brigade,
      This is there for our future.

      Nowhere to run, nowhere to hide,
      Backs on the wall, there's only one way out of
      Nowhere to run, nowhere to hide,
      Backs on the wall, there's only one way out of
      Nowhere to run, nowhere to hide,
      Backs on the wall, there's only one way out of
      Nowhere to run, nowhere to hide,
      Backs on the wall, there's only one way out of
      Here...

      There's only one way out of here.
      There's only one way out of here.`,
    },
    {
      name: "Three Wishes",
      anchor: "three-wishes",
      setting:
        "This song is a side bar to the main plot, and flashes forward several weeks past the end of the story…it is told from the perspective of the Doctors estranged son, right after he received the news that his father had passed. The son had not seen him since he left for Tennessee several years earlier. They were not extraordinarily close. Lukas was a musician in an aspiring band. His father didn't disapprove, but didn't necessarily approve of this decision. Doctor Von Stadt started to grow distant after his son's mother had left with him eight years earlier. But his son had actually planned a surprise visit to his dad, when his band was taking his first national tour, which was taking them through Nashville and Memphis. He never had the chance...",
      lyrics: `I wish I was young.
      But still I'm naive.
      I wish I was rich.
      But for now it's a dream.

      If I had three wishes, I wish I could see you again.

      I wish I had listened.
      To all that you told.
      I wish I had learned.
      From all that you know.

      If I had three wishes, I wish I could hear your voice.

      I wish I had told you.
      But you may not have heard.
      I wish you can see me.
      As I fly like a bird.

      If I had three wishes, I wish you could be here with me.`,
    },
    {
      name: "Confrontation",
      anchor: "confrontation",
      setting:
        'This is the story of the end. This song explains why the Doctor had to take the life of Amos. It is among the Doctor\'s last moment alive. In the end chorus he claims, "And for the moments time I wish I had the nerve." And in the next moment he finds the nerve, and with the pull of the trigger, the story ends.',
      lyrics: `I didn't mean no harm,
      I know there's no alarm,
      And now we've made our choice.

      There is no turning back,
      You've always had the knack,
      To hear your inner voice.

      But now you tune it out,
      And then begin to shout,
      Until your face turns red.

      And Amos pleads his case,
      And you remove his face,
      From what was once his head.

      And if you ever see me in my dreams.
      And if you know that life was what it seems.
      And now you wish that it was yesterday.
      But that's the price you have to pay.

      No time to reminisce,
      But time is what you miss,
      It seems you've got no chance.

      A mask to hide your face,
      And wings to win your race,
      We've had a change of plans.

      And in the thick of night,
      With not a speck of light,
      And with your fingers curled.

      How did you kill your friend,
      And have you reached the end,
      Of your forsaken world.

      And if you ever see me in my dreams.
      And if you know that life was what it seems.
      And now you wish that it was yesterday.
      But that's the price you have to pay.

      The confrontation was a necessary act.
      We traded in our lives but took a million back.
      And in the end, it seems I get what I deserve.
      But for one moment's time, I wish I had the nerve.`,
    },
  ];

  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    navigate(`#${id}`);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const OperaMenuCard = ({ title, items }: { title: string; items: { name: string; anchor: string }[] }) => (
    <Card className="mb-6 card-premium">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3 text-content-text-primary">{title}</h3>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.anchor}>
              <button
                type="button"
                onClick={() => scrollToSection(item.anchor)}
                className="text-brand-primary hover:text-brand-secondary hover:underline"
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-content-text-primary">The Chemical Warfare Brigade</h1>
      </div>

      <div className="space-y-6">
        <Card className="card-premium rounded-lg">
          <CardHeader>
            <h3 className="text-2xl font-semibold">Introduction</h3>
          </CardHeader>
          <CardContent className="space-y-4 text-content-text-primary leading-relaxed">
            <p>
              The Chemical Warfare Brigade is the Disco Biscuits' second full-length rock opera, written by Marc
              Brownstein, and debuted on{" "}
              <Link to="/shows/2000-12-30-vanderbilt-plainview-ny" className="text-brand-primary hover:text-brand-secondary">
                12/30/00
              </Link>{" "}
              at the Vanderbilt on Long Island.
            </p>
            <p>
              The story follows a complex plot involving a chemist, a construction worker, and an FBI agent, centered
              around a dangerous chemical weapon and organized crime. Through themes of deception, greed, and
              redemption, the opera weaves together multiple perspectives into a tragic tale.
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

        <Card className="card-premium rounded-lg">
          <CardHeader>
            <h3 className="text-2xl font-semibold">Songs</h3>
          </CardHeader>
          <CardContent className="space-y-6 text-content-text-primary leading-relaxed">
            {songs.map((song) => (
              <div key={song.anchor} id={song.anchor}>
                <h4 className="text-xl font-semibold mb-2">{song.name}</h4>
                {song.setting && <p>{song.setting}</p>}
                {song.lyrics && (
                  <blockquote className="border-l-4 border-content-bg-secondary pl-4 italic my-4 text-content-text-secondary whitespace-pre-line">
                    {song.lyrics}
                  </blockquote>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-premium rounded-lg">
          <CardHeader>
            <h3 className="text-2xl font-semibold">Related Links</h3>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/resources/hot-air-balloon" className="text-brand-primary hover:text-brand-secondary block">
              The Hot Air Balloon
            </Link>
            <a
              href="https://archive.org/details/db2000-12-30.shnf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary hover:text-brand-secondary block"
            >
              Listen to the Debut Performance
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChemicalWarfareBrigade;
