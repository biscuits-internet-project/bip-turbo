import { Link } from "react-router-dom";
import { publicLoader } from "~/lib/base-loaders";

export const loader = publicLoader<void>(async () => {});

export function meta() {
  return [
    { title: "Tractorbeam | Biscuits Internet Project" },
    {
      name: "description",
      content:
        "All things serve the Beam. Debuted in 2007, this Disco Biscuits alter-ego played instrumental versions of tdb originals and covers until reinventing themselves in 2019.",
    },
    { property: "og:image", content: "/public/tractorbeam.jpg" },
  ];
}

export default function Tractorbeam() {
  return (
    <div>
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-content-text-primary">Tractor Beam</h1>
        </div>

        <div className="card-premium rounded-lg p-6 mb-6">
          <div className="space-y-4 text-content-text-secondary">
            <p className="leading-relaxed">
              Tractorbeam, like{" "}
              <Link to="/resources/the-perfume" className="text-brand-primary hover:text-brand-secondary hover:underline">
                The Perfume
              </Link>
              , is a pseudonym the Disco Biscuits perform under. Debuted on{" "}
              <Link
                to="/shows/2007-04-20-ontourage-chicago-il"
                className="text-brand-primary hover:text-brand-secondary hover:underline"
              >
                April 20th, 2007
              </Link>{" "}
              at Ontourage in Chicago, IL Tractorbeam played instrumental versions of Disco Biscuits originals and
              covers until switching up their format in 2019.
            </p>

            <p className="leading-relaxed">
              It was evident that this project served as a creative spark for the band, as they played three memorable
              shows in 2007, following their Chicago debut.{" "}
              <Link
                to="/shows/2007-04-27-gramercy-theater-new-york-ny"
                className="text-brand-primary hover:text-brand-secondary hover:underline"
              >
                April 27th, 2007
              </Link>{" "}
              at the Gramercy in New York and two shows at the Chameleon Club in Lancaster, PA (
              <Link
                to="/shows/2007-06-26-chameleon-club-lancaster-pa"
                className="text-brand-primary hover:text-brand-secondary hover:underline"
              >
                06/26
              </Link>{" "}
              and{" "}
              <Link
                to="/shows/2007-08-30-chameleon-club-lancaster-pa"
                className="text-brand-primary hover:text-brand-secondary hover:underline"
              >
                08/30
              </Link>
              ) featured creative setlists and dynamic jamming that often leaned heavy, dark, and electronic.
            </p>

            <p className="leading-relaxed">
              After appearing four times in 2007, Tractorbeam performances became somewhat rare as they played only nine
              times over the next eleven years:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  <Link
                    to="/shows/2008-10-25-state-theater-falls-church-va"
                    className="text-brand-primary hover:text-brand-secondary hover:underline"
                  >
                    10/25/08 State Theater Falls - Church, VA
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shows/2009-07-18-indian-lookout-country-club-mariaville-ny"
                    className="text-brand-primary hover:text-brand-secondary hover:underline"
                  >
                    07/18/09 Camp Bisco, ILCC - Mariaville, NY
                  </Link>{" "}
                  (TB vs. The Perfume)
                </li>
                <li>
                  <Link
                    to="/shows/2009-09-12-starland-ballroom-sayreville-nj"
                    className="text-brand-primary hover:text-brand-secondary hover:underline"
                  >
                    09/12/09 Starland Ballroom - Sayreville, NJ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shows/2009-12-28-highline-ballroom-new-york-ny"
                    className="text-brand-primary hover:text-brand-secondary hover:underline"
                  >
                    12/28/09 Highline Ballroom - New York, NY
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shows/2010-03-26-grand-central-miami-fl"
                    className="text-brand-primary hover:text-brand-secondary hover:underline"
                  >
                    03/26/10 Ultra Music Festival Afterparty - Miami, FL
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shows/2010-09-18-mishawaka-amphitheater-bellvue-co"
                    className="text-brand-primary hover:text-brand-secondary hover:underline"
                  >
                    09/18/10 Mishawaka Amphitheatre - Bellvue, CO
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shows/2010-10-31-jefferson-theater-charlottesville-va"
                    className="text-brand-primary hover:text-brand-secondary hover:underline"
                  >
                    10/31/10 Jefferson Theater - Charlottesville, VA
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shows/2011-01-23-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico"
                    className="text-brand-primary hover:text-brand-secondary hover:underline"
                  >
                    01/23/11 Mayan Holidaze Now Sapphire Resort - Puerto Morelos, Mexico
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shows/2014-01-26-fox-theatre-boulder-co"
                    className="text-brand-primary hover:text-brand-secondary hover:underline"
                  >
                    01/26/14 Fox Theater, Boulder, CO
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shows/2014-12-29-b-b-king-s-blues-club-new-york-ny"
                    className="text-brand-primary hover:text-brand-secondary hover:underline"
                  >
                    12/29/14 B.B. King Blue Club - New York, NY
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shows/2016-09-09-great-north-music-and-arts-fest-minot-me"
                    className="text-brand-primary hover:text-brand-secondary hover:underline"
                  >
                    09/09/16 Great North Music and Arts Fest - Minot, ME
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shows/2018-07-14-the-pavilion-at-montage-mountain-scranton-pa"
                    className="text-brand-primary hover:text-brand-secondary hover:underline"
                  >
                    07/14/18 Camp Bisco, Montage Mountain - Scranton, PA
                  </Link>{" "}
                  (TB vs. The Perfume Spin the Wheel)
                </li>
              </ul>
            </p>

            <p className="leading-relaxed">
              On October{" "}
              <Link
                to="/shows/2019-10-03-10-mile-music-hall-frisco-co"
                className="text-brand-primary hover:text-brand-secondary hover:underline"
              >
                3rd
              </Link>{" "}
              and{" "}
              <Link
                to="/shows/2019-10-04-10-mile-music-hall-frisco-co"
                className="text-brand-primary hover:text-brand-secondary hover:underline"
              >
                4th
              </Link>{" "}
              2019 at 10 Mile Music Hall in Frisco, CO the band debuted a completely new format for Tractorbeam. This
              iteration focuses on playing live versions of house and disco songs like Delorean Dynamite/Strandbar (Todd
              Terje), White Rabbit (Solomun), Fly Away (Crackazat). All four band members use laptops and are synced up
              through Ableton Live. Tractorbeam also played a late night show on{" "}
              <Link
                to="/shows/2019-12-27-sony-hall-new-york-ny"
                className="text-brand-primary hover:text-brand-secondary hover:underline"
              >
                12/27/19 at Sony Music Hall in New York, NY
              </Link>
              .
            </p>

            <p className="leading-relaxed">
              In addition to the TB standalone shows, every Disco Biscuits show since 11/14/19 has included a
              Tractorbeam segment mid-second or third set.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
