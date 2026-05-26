import { average, median } from "@bip/domain";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SegmentButton } from "~/components/ui/segment-button";
import { CHART_COLORS } from "~/lib/chart-colors";
import { START_YEAR } from "~/lib/song-filters";

type SongRef = { title: string; slug: string };

export type DebutYearTrack = {
  songId: string;
  song?: { title: string; slug: string; dateFirstPlayed: Date | null } | null;
};

export type DebutYearSetlist = {
  show: { date: string };
  sets: { tracks: DebutYearTrack[] }[];
};

type DistributionRow = {
  year: number;
  count: number;
  songs: SongRef[];
};

type DebutYearStats = {
  distribution: DistributionRow[];
  average: number | null;
  median: number | null;
};

/**
 * Roll up a setlist's tracks into a year-by-year debut histogram plus
 * average and median debut year. Each distinct song contributes once,
 * so a song played twice in the show doesn't double-count its year.
 * Distribution always spans START_YEAR through the show's own year,
 * zero-filling any year with no qualifying debuts.
 */
export function computeDebutYearStats(tracks: DebutYearTrack[], showDate: string): DebutYearStats {
  const showYear = Number(showDate.slice(0, 4));
  const seen = new Set<string>();
  const years: number[] = [];
  const songsByYear = new Map<number, SongRef[]>();
  for (const t of tracks) {
    if (seen.has(t.songId)) continue;
    const song = t.song;
    const debut = song?.dateFirstPlayed;
    if (!debut) continue;
    // `new Date(value)` normalizes both an actual Date (tests) and the ISO
    // string that the React Router loader serializes Date fields into at
    // runtime — the static type stays honest while the runtime stays loose.
    const year = new Date(debut).getUTCFullYear();
    if (Number.isNaN(year)) continue;
    // Bound to the band's catalog window: skip songs whose dateFirstPlayed
    // is before the band started (data anomaly) or after this show (stats
    // not yet rebuilt). Keeps the X-axis range stable across all shows.
    if (year < START_YEAR || year > showYear) continue;
    seen.add(t.songId);
    years.push(year);
    const list = songsByYear.get(year) ?? [];
    list.push({ title: song.title, slug: song.slug });
    songsByYear.set(year, list);
  }

  if (years.length === 0) {
    return { distribution: [], average: null, median: null };
  }

  const counts = new Map<number, number>();
  for (const y of years) counts.set(y, (counts.get(y) ?? 0) + 1);
  // X-axis floor is fixed at START_YEAR so every show's chart starts at
  // the same year; the ceiling is the show year so a 1999 show doesn't
  // render empty bars for years that hadn't happened yet.
  const min = START_YEAR;
  const max = showYear;
  const distribution: DistributionRow[] = [];
  for (let y = min; y <= max; y++) {
    // Songs are collected in track-iteration order; sort alphabetically so
    // the table view reads predictably regardless of setlist position.
    const songs = (songsByYear.get(y) ?? []).slice().sort((a, b) => a.title.localeCompare(b.title));
    distribution.push({ year: y, count: counts.get(y) ?? 0, songs });
  }

  // years is non-empty thanks to the early return above, so the helpers
  // can't return null here — round to integer years for display.
  return {
    distribution,
    average: Math.round(average(years) as number),
    median: Math.round(median(years) as number),
  };
}

interface DebutYearChartProps {
  setlist: DebutYearSetlist;
}

/**
 * Right-rail card that summarizes which years the songs in this show
 * debuted in. Chart and table views share one toggle; the chart is the
 * default. Sized for the show page's ~280px right rail.
 */
export function DebutYearChart({ setlist }: DebutYearChartProps) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const tracks = setlist.sets.flatMap((s) => s.tracks);
  const { distribution, average, median } = computeDebutYearStats(tracks, setlist.show.date);
  if (distribution.length === 0) return null;

  // X labels would collide at a 30-year range in the narrow rail; thin
  // them to roughly every 5 years (six labels total) so they stay legible.
  const labelStride = Math.max(1, Math.ceil(distribution.length / 6));
  const labelInterval = labelStride - 1;

  return (
    <div className="glass-content rounded-lg p-3">
      <h3 className="text-sm font-semibold text-content-text-primary mb-2">Songs by debut year</h3>
      <div className="flex items-center justify-between gap-2 mb-2 text-xs">
        <div className="inline-flex items-center">
          <SegmentButton active={view === "chart"} onClick={() => setView("chart")}>
            chart
          </SegmentButton>
          <SegmentButton active={view === "table"} onClick={() => setView("table")}>
            table
          </SegmentButton>
        </div>
        {average !== null && median !== null && (
          <span className="text-content-text-secondary text-right">
            average / median: {average} / {median}
          </span>
        )}
      </div>
      {view === "chart" ? (
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribution} margin={{ top: 4, right: 4, left: -16, bottom: 4 }} barCategoryGap="10%">
              <XAxis dataKey="year" stroke={CHART_COLORS.axis} fontSize={10} interval={labelInterval} />
              <YAxis stroke={CHART_COLORS.axis} fontSize={10} allowDecimals={false} width={28} />
              <Tooltip content={<DebutYearTooltip />} isAnimationActive={false} />
              <Bar dataKey="count" fill={CHART_COLORS.accent} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <DebutYearTable distribution={distribution} />
      )}
    </div>
  );
}

function DebutYearTable({ distribution }: { distribution: DistributionRow[] }) {
  // Drop zero-count rows in the table view — the histogram zero-fills to
  // make visual gaps read, but blank rows are pure noise in a tabular layout.
  const rows = distribution.filter((d) => d.count > 0);
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-content-text-tertiary border-b border-glass-border/30">
          <th className="font-medium py-2 pr-4">Year</th>
          <th className="font-medium py-2">Songs</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.year} className="border-b border-glass-border/20 last:border-0 align-top">
            <td className="py-2 pr-4 text-content-text-primary whitespace-nowrap">{row.year}</td>
            <td className="py-2 text-content-text-secondary">
              {row.songs.map((song, index) => (
                <span key={song.slug}>
                  <Link
                    to={`/songs/${song.slug}`}
                    className="text-brand-primary hover:text-brand-secondary transition-colors"
                  >
                    {song.title}
                  </Link>
                  {index < row.songs.length - 1 && <span>, </span>}
                </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface DebutYearTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: DistributionRow }>;
}

function DebutYearTooltip({ active, payload }: DebutYearTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const datum = payload[0]?.payload;
  if (!datum) return null;
  const { year, count, songs } = datum;
  if (count === 0) return null;
  const songsLabel = count === 1 ? "song" : "songs";
  return (
    <div
      className="rounded-md border px-3 py-2 text-sm"
      style={{
        backgroundColor: CHART_COLORS.tooltipBg,
        borderColor: CHART_COLORS.tooltipBorder,
        color: CHART_COLORS.tooltipText,
      }}
    >
      <div className="font-medium">{year}</div>
      <div className="text-content-text-tertiary">
        {count} {songsLabel}
      </div>
      <ul className="mt-1">
        {songs.map((song) => (
          <li key={song.slug}>{song.title}</li>
        ))}
      </ul>
    </div>
  );
}
