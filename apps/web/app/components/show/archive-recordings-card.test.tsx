import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { ArchiveRecordingsCard } from "./archive-recordings-card";

vi.mock("~/components/player", () => ({
  default: ({ identifier, bare }: { identifier: string; bare?: boolean }) => (
    <div data-testid="ArchiveMusicPlayer" data-identifier={identifier} data-bare={String(!!bare)} />
  ),
}));

describe("ArchiveRecordingsCard", () => {
  // Empty list collapses the card — callers pass the raw recording list,
  // so dates with no tapes shouldn't show an empty shell or player.
  test("renders nothing for empty items", async () => {
    const { container } = await setup(<ArchiveRecordingsCard items={[]} />);

    expect(container.firstChild).toBeNull();
  });

  // A single recording is auto-picked as primary, rendered in the list,
  // and embedded in the player below. No "in player below" hint because
  // there's no ambiguity when only one recording exists.
  test("renders one recording and embeds the player without the hint", async () => {
    await setup(
      <ArchiveRecordingsCard
        items={[
          {
            identifier: "db2004-12-31.sbd.flac16",
            title: "Basis for a Day",
            source: "SBD > DAT",
            url: "https://archive.org/details/db2004-12-31.sbd.flac16",
          },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "db2004-12-31.sbd.flac16" })).toHaveAttribute(
      "href",
      "https://archive.org/details/db2004-12-31.sbd.flac16",
    );
    expect(screen.getByText("SBD > DAT")).toBeInTheDocument();
    expect(screen.queryByText("(in player below)")).not.toBeInTheDocument();

    const player = screen.getByTestId("ArchiveMusicPlayer");
    expect(player).toHaveAttribute("data-identifier", "db2004-12-31.sbd.flac16");
    expect(player).toHaveAttribute("data-bare", "true");
  });

  // With multiple recordings the primary (highest scoring — SBD > AUD)
  // gets the "in player below" hint, and only that one is fed to the
  // embedded player.
  test("marks the primary recording and embeds only its identifier in the player", async () => {
    await setup(
      <ArchiveRecordingsCard
        items={[
          {
            identifier: "db2004-12-31.aud.flac16",
            title: "Basis for a Day (AUD)",
            source: "AUD > DAT",
            url: "https://archive.org/details/db2004-12-31.aud.flac16",
          },
          {
            identifier: "db2004-12-31.sbd.flac16",
            title: "Basis for a Day (SBD)",
            source: "SBD > DAT",
            url: "https://archive.org/details/db2004-12-31.sbd.flac16",
          },
        ]}
      />,
    );

    const primaryLink = screen.getByRole("link", { name: /db2004-12-31\.sbd\.flac16.*in player below/ });
    expect(primaryLink).toHaveAttribute("href", "https://archive.org/details/db2004-12-31.sbd.flac16");

    const audLink = screen.getByRole("link", { name: "db2004-12-31.aud.flac16" });
    expect(audLink).toBeInTheDocument();

    expect(screen.getByTestId("ArchiveMusicPlayer")).toHaveAttribute("data-identifier", "db2004-12-31.sbd.flac16");
  });

  // The added-on date is formatted into a friendly "Mon D, YYYY" string so
  // users can spot recent remasters without decoding ISO timestamps.
  test("renders a formatted added-on line when addedDate is present", async () => {
    await setup(
      <ArchiveRecordingsCard
        items={[
          {
            identifier: "db2019-08-10.sbd",
            title: "Helicopters",
            url: "https://archive.org/details/db2019-08-10.sbd",
            addedDate: "2020-01-15T00:00:00Z",
          },
        ]}
      />,
    );

    expect(screen.getByText(/added .*2020/)).toBeInTheDocument();
  });

  // The source line is optional metadata — when a recording lacks a source
  // description, that paragraph is just omitted rather than rendering blank.
  test("omits source paragraph when source is missing", async () => {
    await setup(
      <ArchiveRecordingsCard
        items={[
          {
            identifier: "db2019-08-10.unknown",
            title: "Mulberry's Dream",
            url: "https://archive.org/details/db2019-08-10.unknown",
          },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "db2019-08-10.unknown" })).toBeInTheDocument();
    expect(screen.queryByText(/added /)).not.toBeInTheDocument();
  });
});
