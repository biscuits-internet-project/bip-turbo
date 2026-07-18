import { Link } from "react-router-dom";
import { Card, CardContent } from "~/components/ui/card";
import { useFeatureFlags } from "~/hooks/use-feature-flags";
import { useSession } from "~/hooks/use-session";

export function meta() {
  return [
    { title: "How ratings work | Biscuits Internet Project" },
    {
      name: "description",
      content:
        "How the Calibrated Show Rating and Calibrated Track Rating work: entropy weighting, bias-centering, bad-faith exclusion, duplicate-account de-duplication, and count-shrinkage, and how they draw on (and differ from) the phish.net ratings research.",
    },
  ];
}

const POSTS = {
  part1: "https://phish.net/blog/1724255149/phishnet-show-ratings-part-1-an-introduction-to-the-ratings-database",
  part2: "https://phish.net/blog/1724255474/phishnet-show-ratings-part-2-fluffers-bombers-and-other-anomalous-raters",
  part3:
    "https://phish.net/blog/1724255820/phishnet-show-ratings-part-3-variance-and-bias-in-ratings-whats-the-problem",
  part4:
    "https://phish.net/blog/1724255981/phishnet-show-ratings-part-4-can-rater-weights-improve-the-accuracy-of-show-ratings.html",
};

function PostLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
      {children}
    </a>
  );
}

/**
 * Public explainer for the Calibrated Show and Track Ratings. Always reachable by direct URL
 * (the `ratings.explainer-nav-link` flag gates only the nav link, not this page).
 * Written to be accurate enough to share with the phish.net ratings author whose
 * series it builds on. No loader; the only dynamic bit is the "profile settings"
 * link, shown when the `ratings.toggle-visible` flag makes the opt-in available to
 * this signed-in viewer.
 */
export default function ShowRatingAlgorithm() {
  const { toggleVisible } = useFeatureFlags();
  const { user } = useSession();
  // Link straight to the viewer's profile (where the opt-in toggle lives) only
  // when they can actually enable it: the flag is on and we know their username.
  const settingsHref = toggleVisible && user?.username ? `/users/${user.username}` : null;

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="page-heading">HOW RATINGS WORK</h1>
      </div>

      <div className="grid gap-6 md:gap-8">
        <Card variant="panel">
          <CardContent className="p-6">
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-content-text-secondary">
                Every show and every track has a{" "}
                <strong className="text-content-text-primary">community average</strong>, the plain mean of fans' star
                ratings. It is simple and transparent, but a raw average is easy to skew: a handful of people who rate
                everything 5 (or everything 0.5), or one person voting from several accounts, can move the number more
                than they should.
              </p>
              <p className="text-content-text-secondary">
                The <strong className="text-content-text-primary">Calibrated Show Rating</strong> and the{" "}
                <strong className="text-content-text-primary">Calibrated Track Rating</strong> are opt-in alternatives
                that aim at the same thing, how good a show or track was, while being much harder to skew. Everyone sees
                the community average by default; you can switch either on in{" "}
                {settingsHref ? (
                  <Link to={settingsHref} className="text-brand-primary hover:underline">
                    your profile settings
                  </Link>
                ) : (
                  "your profile settings"
                )}
                . They share a core idea, giving more weight to raters who use the whole scale, but differ where shows
                and tracks differ. This page explains what each does, then goes deeper on the show rating's design and
                how we tested it.
              </p>
              <p className="text-content-text-secondary">
                This work is directly inspired by Paul Jakus's four-part series on rating shows for phish.net:{" "}
                <PostLink href={POSTS.part1}>Part 1 (the ratings database)</PostLink>,{" "}
                <PostLink href={POSTS.part2}>Part 2 (fluffers, bombers, and anomalous raters)</PostLink>,{" "}
                <PostLink href={POSTS.part3}>Part 3 (variance and bias)</PostLink>, and{" "}
                <PostLink href={POSTS.part4}>Part 4 (can rater weights improve accuracy?)</PostLink>. We use his core
                tools but combine them differently; the section "How this differs from the proposed phish.net method"
                below explains why.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card variant="panel">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-content-text-primary mb-4">
              What the Calibrated Show Rating does
            </h2>
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-medium text-content-text-primary mb-1">Weights raters by how they rate</h3>
                <p className="text-content-text-secondary text-sm">
                  A rater who uses the whole 0.5 to 5 star scale carries more weight than a one-note rater who gives
                  nearly everything the same score. The measure is statistical{" "}
                  <em className="text-content-text-primary">entropy</em>: the more a person's ratings spread across the
                  scale, the more information each one carries. A considered contrarian who uses the full scale keeps
                  full weight; disagreement is never penalized.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-content-text-primary mb-1">Removes each rater's bias</h3>
                <p className="text-content-text-secondary text-sm">
                  Some people run hot, some run cold. Each rating is{" "}
                  <em className="text-content-text-primary">centered</em>: shifted by the gap between that rater's own
                  average and the population average, so what counts is whether they liked a show more or less than they
                  usually do, not whether they are a generous grader.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-content-text-primary mb-1">Drops clear bad-faith raters</h3>
                <p className="text-content-text-secondary text-sm">
                  Accounts that hand out essentially one extreme value (all near 0.5, the "bombers", or all near 5, the
                  "fluffers") are dropped from the calibrated score. Everyone else, including good-faith dissent, still
                  counts.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-content-text-primary mb-1">Counts each person once</h3>
                <p className="text-content-text-secondary text-sm">
                  One human who rated under several usernames is collapsed to a single most-recent vote, so
                  re-registered or duplicate accounts cannot double-count. This de-duplication applies to the community
                  average too.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-content-text-primary mb-1">Does not over-reward thin shows</h3>
                <p className="text-content-text-secondary text-sm">
                  A show with only a few ratings is pulled toward the global average until enough people weigh in, so a
                  lone 5-star vote cannot vault an obscure show to the top.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-content-text-primary mb-1">Treats new raters fairly</h3>
                <p className="text-content-text-secondary text-sm">
                  A brand-new or low-volume rater would otherwise carry almost no weight. Their score is blended toward
                  the typical rater until they have rated enough shows, so a newcomer's vote still moves the number.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="panel">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-content-text-primary mb-4">The Calibrated Track Rating</h2>
            <p className="text-content-text-secondary text-sm mb-3">
              Tracks have far fewer ratings than shows, from fewer raters, and those ratings skew high: most sit near 5
              stars. The Calibrated Track Rating is a separate opt-in that gives more weight to raters who use the whole
              0.5 to 5 star scale, which spreads the numbers out.
            </p>
            <p className="text-content-text-secondary text-sm">
              It works by adjusting how much{" "}
              <span className="text-content-text-primary">weight each rater&apos;s votes are given</span>, rather than
              by removing raters. Someone who uses the full range is given more weight than someone who gives nearly
              everything 5. Unlike the show rating, it also skips two steps that helped shows but not tracks in our
              testing: it doesn&apos;t shift a rater&apos;s scores toward the crowd average, and it doesn&apos;t pull
              thin tracks toward a global anchor.
            </p>
          </CardContent>
        </Card>

        <Card variant="panel">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-content-text-primary mb-4">
              How this differs from the proposed phish.net method
            </h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-content-text-secondary">
                Jakus's series established the foundation we build on: two metrics, a rater's{" "}
                <em className="text-content-text-primary">average deviation</em> and{" "}
                <em className="text-content-text-primary">entropy</em>, can identify anomalous raters (
                <PostLink href={POSTS.part2}>Part 2</PostLink>); those anomalous raters add bias to a show's average (
                <PostLink href={POSTS.part3}>Part 3</PostLink>); and a RateYourMusic-style{" "}
                <em className="text-content-text-primary">rater weighting</em> can correct for them (
                <PostLink href={POSTS.part4}>Part 4</PostLink>). In his scheme each rater earns a single trust weight
                (roughly 0, 0.25, 0.5, or 1) from those metrics, and the show's rating becomes a weighted average of raw
                scores. On phish.net's large database, every weighted variant correlated more closely with setlist
                quality than the simple average.
              </p>
              <p className="text-content-text-secondary">
                We started in exactly that place, with the same two metrics and the same validity test (below). Two
                things led us to a different estimator:
              </p>
              <ul className="text-content-text-secondary text-sm space-y-2 list-disc pl-5">
                <li>
                  <strong className="text-content-text-primary">Scale.</strong> The Disco Biscuits ratings database is
                  far smaller than phish.net's. When we ran the discrete trust-weighting on it, it barely moved the
                  rankings; the large gains the method showed on phish.net did not reproduce at our size.
                </li>
                <li>
                  <strong className="text-content-text-primary">We did not want to discard raters.</strong> A trust
                  weight of 0 throws a person out entirely, and the cutoff and weight values are admittedly hand-chosen
                  (a point the series itself flags as unfinished).
                </li>
              </ul>
              <p className="text-content-text-secondary">
                So rather than assign a discrete trust weight, the Calibrated Show Rating keeps everyone and corrects
                them continuously. It <strong className="text-content-text-primary">centers out</strong> each rater's
                bias (Jakus's Part 3 problem) instead of down-weighting them, weights by entropy on a smooth 0-to-1
                scale, and only fully drops the unambiguous one-note bombers and fluffers. It also adds two steps his
                posts did not need: <strong className="text-content-text-primary">collapsing duplicate accounts</strong>{" "}
                (a site rewrite here left many stub and re-registered logins) and{" "}
                <strong className="text-content-text-primary">shrinking thin shows</strong> toward the overall average.
                The spirit is "calibrate every rater" rather than "weight or discard raters." His series works through
                the same problems, grader bias, thin samples, and gaming, for a sibling jam-band dataset.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card variant="panel">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-content-text-primary mb-4">Does it work?</h2>
            <p className="text-content-text-secondary text-sm mb-4">
              We test it the way the phish.net research does, with a{" "}
              <em className="text-content-text-primary">convergent validity</em> check: a better rating should line up
              more closely with independent signs that a show was notable, here, its tracks on the community jam-chart /
              all-timer list. We measure that agreement with a{" "}
              <em className="text-content-text-primary">rank correlation</em> that runs from 0 (no relationship) to 1
              (perfect agreement). Across the roughly 1,150 shows with at least 10 ratings (as of June 2026), the
              calibrated rating tracks both how many all-timers a show has and their total length more closely than the
              raw community average:
            </p>
            <div className="overflow-x-auto">
              <table className="text-sm tabular-nums">
                <thead>
                  <tr className="text-content-text-tertiary text-left">
                    <th className="px-3 py-1.5 font-normal">Rating</th>
                    <th className="px-3 py-1.5 font-normal"># of all-timers</th>
                    <th className="px-3 py-1.5 font-normal">Length of all-timers</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-3 py-1.5 text-content-text-secondary">Community average</td>
                    <td className="px-3 py-1.5 text-content-text-primary">0.54</td>
                    <td className="px-3 py-1.5 text-content-text-primary">0.53</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-3 py-1.5 text-content-text-secondary">Calibrated Show Rating</td>
                    <td className="px-3 py-1.5 text-content-text-primary font-semibold">0.58</td>
                    <td className="px-3 py-1.5 text-content-text-primary font-semibold">0.56</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-content-text-tertiary text-xs mt-3">
              Higher is better (0 to 1). The calibrated rating agrees more closely with the editorial jam-chart signals
              than the raw average on both measures, and it held or improved at every cleaning step, with de-duplication
              helping most.
            </p>
          </CardContent>
        </Card>

        <Card variant="panel">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-content-text-primary mb-4">Other approaches we tried</h2>
            <p className="text-content-text-secondary text-sm mb-3">
              We measured several alternatives against the same validity yardstick. These did worse and were dropped:
            </p>
            <ul className="text-content-text-secondary text-sm space-y-2 list-disc pl-5">
              <li>
                <strong className="text-content-text-primary">Scoping each rater to a slice of band history.</strong>{" "}
                Measuring a rater's habits only within one stretch of the band's history actually correlated worse than
                the plain average.
              </li>
              <li>
                <strong className="text-content-text-primary">Discrete trust-weighting.</strong> The phish.net-style
                weighted average barely moved our smaller dataset.
              </li>
              <li>
                <strong className="text-content-text-primary">Z-score normalization.</strong> Rescaling each rater's
                spread (not just removing their bias) did not beat plain bias-centering.
              </li>
              <li>
                <strong className="text-content-text-primary">Anchoring on the scale midpoint.</strong> Centering on the
                middle of the star scale instead of the crowd average did not help.
              </li>
              <li>
                <strong className="text-content-text-primary">Gating the entropy weight.</strong> Turning the weight on
                or off at a threshold added complexity without improving accuracy.
              </li>
            </ul>
            <p className="text-content-text-secondary text-sm mt-3">
              Plain global entropy-weighted bias-centering won, which is what the Calibrated Show Rating uses.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
