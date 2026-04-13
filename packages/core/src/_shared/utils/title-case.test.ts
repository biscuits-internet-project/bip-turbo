import { describe, expect, it } from "vitest";
import { toTitleCase } from "./title-case";

describe("toTitleCase", () => {
  // Lowercases articles in middle positions
  it("lowercases articles (a, an, the) in middle positions", () => {
    expect(toTitleCase("Above The Waves")).toBe("Above the Waves");
    expect(toTitleCase("Run Like An Antelope")).toBe("Run Like an Antelope");
    expect(toTitleCase("Feel Like A Stranger")).toBe("Feel Like a Stranger");
  });

  // Lowercases coordinating conjunctions in middle positions
  it("lowercases coordinating conjunctions in middle positions", () => {
    expect(toTitleCase("Hide And Seek")).toBe("Hide and Seek");
    expect(toTitleCase("Rock And Roll Part One")).toBe("Rock and Roll Part One");
    expect(toTitleCase("Pomp And Circumstance")).toBe("Pomp and Circumstance");
  });

  // Lowercases short prepositions in middle positions
  it("lowercases prepositions in middle positions", () => {
    expect(toTitleCase("Dance Of The Sugarplum Fairies")).toBe("Dance of the Sugarplum Fairies");
    expect(toTitleCase("Help On The Way")).toBe("Help on the Way");
    expect(toTitleCase("Down To The Bottom")).toBe("Down to the Bottom");
    expect(toTitleCase("Waltz In Black")).toBe("Waltz in Black");
    expect(toTitleCase("News From Nowhere")).toBe("News from Nowhere");
    expect(toTitleCase("Running Into the Night")).toBe("Running into the Night");
    expect(toTitleCase("No Sleep Till Brooklyn")).toBe("No Sleep till Brooklyn");
  });

  // Capitalizes incorrectly lowercase major words (verbs, pronouns)
  it("capitalizes incorrectly lowercase major words", () => {
    expect(toTitleCase("Born to be Alive")).toBe("Born to Be Alive");
    expect(toTitleCase("Give it To Me Baby")).toBe("Give It to Me Baby");
    expect(toTitleCase("I am One")).toBe("I Am One");
  });

  // Preserves first word regardless of what it is
  it("preserves first word as-is", () => {
    expect(toTitleCase("The Big Happy")).toBe("The Big Happy");
    expect(toTitleCase("A Night in Tunisia")).toBe("A Night in Tunisia");
    expect(toTitleCase("unknown")).toBe("unknown");
  });

  // Capitalizes last word even if it's a minor word
  it("capitalizes minor words in last position", () => {
    expect(toTitleCase("Bring It On Home")).toBe("Bring It on Home");
    expect(toTitleCase("Standing On The Verge Of Getting It On")).toBe("Standing on the Verge of Getting It On");
  });

  // Preserves all-caps titles
  it("preserves all-caps titles", () => {
    expect(toTitleCase("BOOM")).toBe("BOOM");
  });

  // Preserves words with special characters
  it("preserves words with special characters", () => {
    expect(toTitleCase("AC/DC Bag")).toBe("AC/DC Bag");
    expect(toTitleCase("M.E.M.P.H.I.S.")).toBe("M.E.M.P.H.I.S.");
    expect(toTitleCase("girl$ x Times Square")).toBe("girl$ x Times Square");
    expect(toTitleCase("D'yer Mak'er")).toBe("D'yer Mak'er");
  });

  // Treats word after colon as first word of subtitle
  it("keeps first word after colon capitalized", () => {
    expect(toTitleCase("2001: A Space Odyssey Jam")).toBe("2001: A Space Odyssey Jam");
  });

  // Treats word starting with open paren as first word
  it("keeps first word after opening paren capitalized", () => {
    expect(toTitleCase("You Spin Me Round (Like a Record)")).toBe("You Spin Me Round (Like a Record)");
    expect(toTitleCase("Gonna Fly Now (Theme From Rocky)")).toBe("Gonna Fly Now (Theme from Rocky)");
  });

  // Treats word after mashup "x" separator as first word of new title
  it("keeps first word after mashup x separator capitalized", () => {
    expect(toTitleCase("Bombs x Lockdown")).toBe("Bombs x Lockdown");
    expect(toTitleCase("Tourists (Rocket Ship) x On Time")).toBe("Tourists (Rocket Ship) x On Time");
    expect(toTitleCase("Tricycle x Like A Prayer")).toBe("Tricycle x Like a Prayer");
    expect(toTitleCase("Lake Shore Drive x Meditation To The Groove")).toBe(
      "Lake Shore Drive x Meditation to the Groove",
    );
  });

  // Trims trailing whitespace
  it("trims whitespace", () => {
    expect(toTitleCase("After Midnight ")).toBe("After Midnight");
    expect(toTitleCase("  Born to be Alive  ")).toBe("Born to Be Alive");
  });

  // Handles titles that are already correctly cased
  it("leaves correctly cased titles unchanged", () => {
    expect(toTitleCase("Toccata and Fugue in D Minor")).toBe("Toccata and Fugue in D Minor");
    expect(toTitleCase("Another Brick in the Wall")).toBe("Another Brick in the Wall");
    expect(toTitleCase("King of the World")).toBe("King of the World");
    expect(toTitleCase("Theme from Shaft")).toBe("Theme from Shaft");
  });

  // Handles single-word titles
  it("handles single-word titles", () => {
    expect(toTitleCase("Cyclone")).toBe("Cyclone");
    expect(toTitleCase("Abraxas")).toBe("Abraxas");
  });
});
