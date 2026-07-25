/**
 * How long a Touchdowns All Day episode reads as new on the homepage.
 *
 * The show goes quiet for months at a time, so its card earns prominence
 * rather than holding it by default: inside this window it opens itself and
 * wears a badge, outside it it stays collapsed to a single row that a reader
 * can tap open. Two weeks is wide enough that a listener checking in weekly
 * still meets an open card.
 */
export const PODCAST_NEW_EPISODE_DAYS = 14;

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Whether the episode is recent enough to promote. Computed on the server and
 * handed to the card as loader data so the collapsed/expanded state the HTML
 * ships with is the one React hydrates into.
 *
 * A missing or unparseable `publishDate` (acast omits it now and then) is not
 * new: an episode that cannot prove its freshness should not claim it. A date
 * in the future is new, so a feed clock running ahead of ours doesn't read as
 * ancient.
 */
export function isNewPodcastEpisode(publishDate: string, now: Date): boolean {
  const published = new Date(publishDate).getTime();
  if (Number.isNaN(published)) return false;
  return now.getTime() - published <= PODCAST_NEW_EPISODE_DAYS * MILLISECONDS_PER_DAY;
}
