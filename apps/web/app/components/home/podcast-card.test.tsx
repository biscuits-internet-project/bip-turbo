import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import type { AcastEpisode } from "~/server/latest-podcast-episode";
import { CollapsiblePodcastCard, PodcastCard } from "./podcast-card";

const episode: AcastEpisode = {
  title: "Astronaut and the Tractor Beam",
  description: "<p>Breaking down the Camp Bisco run.</p>",
  publishDate: "2026-01-12T00:00:00Z",
  duration: 3720,
  image: "https://example.test/cover.png",
  url: "https://example.test/episode.mp3",
};

describe("CollapsiblePodcastCard", () => {
  // A dormant podcast collapses to its header, keeping the homepage short.
  test("hides the episode body when the episode is not new", async () => {
    await setupWithRouter(<CollapsiblePodcastCard episode={episode} isNew={false} />);
    expect(screen.queryByText(/Breaking down the Camp Bisco run/)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Listen/ })).not.toBeInTheDocument();
  });

  // The header still names the episode and dates it while collapsed, so the
  // row is worth reading without opening it.
  test("shows the episode title and date while collapsed", async () => {
    await setupWithRouter(<CollapsiblePodcastCard episode={episode} isNew={false} />);
    expect(screen.getByText(/Astronaut and the Tractor Beam/)).toBeInTheDocument();
    expect(screen.getByText(/Jan 12, 2026/)).toBeInTheDocument();
  });

  // Long titles truncate at phone width, so the date leads: staleness is the
  // thing the collapsed row exists to convey.
  test("puts the date ahead of the title", async () => {
    await setupWithRouter(
      <CollapsiblePodcastCard
        episode={{ ...episode, title: "A Title Long Enough To Push Everything After It Off The Row" }}
        isNew={false}
      />,
    );
    const row = screen.getByText(/Jan 12, 2026/).parentElement?.textContent ?? "";
    expect(row).toContain("A Title Long");
    expect(row.indexOf("Jan 12, 2026")).toBeLessThan(row.indexOf("A Title Long"));
  });

  // A feed entry with no publish date must not render a stray bullet.
  test("omits the date separator when the episode has no publish date", async () => {
    await setupWithRouter(<CollapsiblePodcastCard episode={{ ...episode, publishDate: "" }} isNew={false} />);
    expect(screen.getByText(/Astronaut and the Tractor Beam/).textContent).not.toContain("•");
  });

  // A fresh episode earns the space: the card ships open.
  test("shows the episode body when the episode is new", async () => {
    await setupWithRouter(<CollapsiblePodcastCard episode={episode} isNew />);
    expect(screen.getByText(/Breaking down the Camp Bisco run/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Listen/ })).toBeInTheDocument();
  });

  // The badge is the "there is actually something here" signal.
  test("badges a new episode", async () => {
    await setupWithRouter(<CollapsiblePodcastCard episode={episode} isNew />);
    expect(screen.getByText("New episode")).toBeInTheDocument();
  });

  test("does not badge a stale episode", async () => {
    await setupWithRouter(<CollapsiblePodcastCard episode={episode} isNew={false} />);
    expect(screen.queryByText("New episode")).not.toBeInTheDocument();
  });

  // Tapping the header opens a collapsed card.
  test("expands when the header is tapped", async () => {
    const { user } = await setupWithRouter(<CollapsiblePodcastCard episode={episode} isNew={false} />);
    await user.click(screen.getByRole("button", { name: /Touchdowns All Day/ }));
    expect(screen.getByText(/Breaking down the Camp Bisco run/)).toBeInTheDocument();
  });

  // And tapping again closes it, so the reader can reclaim the space.
  test("collapses when the header is tapped twice", async () => {
    const { user } = await setupWithRouter(<CollapsiblePodcastCard episode={episode} isNew={false} />);
    const header = screen.getByRole("button", { name: /Touchdowns All Day/ });
    await user.click(header);
    await user.click(header);
    expect(screen.queryByText(/Breaking down the Camp Bisco run/)).not.toBeInTheDocument();
  });

  // Screen readers need the open/closed state, not just the chevron.
  test("reports its open state on the header button", async () => {
    const { user } = await setupWithRouter(<CollapsiblePodcastCard episode={episode} isNew={false} />);
    const header = screen.getByRole("button", { name: /Touchdowns All Day/ });
    expect(header).toHaveAttribute("aria-expanded", "false");
    await user.click(header);
    expect(header).toHaveAttribute("aria-expanded", "true");
  });

  // The link out to the archive is only useful once the card is open.
  test("links to all episodes when expanded", async () => {
    await setupWithRouter(<CollapsiblePodcastCard episode={episode} isNew />);
    expect(screen.getByRole("link", { name: /All episodes/ })).toHaveAttribute("href", "/resources/touchdowns");
  });
});

describe("PodcastCard", () => {
  // The desktop sidebar card has no header to open, so it always shows.
  test("renders the episode body without a disclosure control", async () => {
    await setupWithRouter(<PodcastCard episode={episode} />);
    expect(screen.getByText(/Breaking down the Camp Bisco run/)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("shows duration and publish date", async () => {
    await setupWithRouter(<PodcastCard episode={episode} />);
    expect(screen.getByText("62 min • Jan 12, 2026")).toBeInTheDocument();
  });

  // Without a publish date the bullet separator has nothing to separate.
  test("omits the separator when the episode has no publish date", async () => {
    await setupWithRouter(<PodcastCard episode={{ ...episode, publishDate: "" }} />);
    expect(screen.getByText("62 min")).toBeInTheDocument();
  });
});
