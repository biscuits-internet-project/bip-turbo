import { describe, expect, test } from "vitest";
import {
  emailNamespaces,
  groupByInbox,
  isDisposableEmailDomain,
  type RaterAccount,
  redactNamespaceKey,
} from "./email-identity-signals";

function account(overrides: Partial<RaterAccount> & Pick<RaterAccount, "userId">): RaterAccount {
  return {
    username: "someone",
    email: null,
    firstName: null,
    lastName: null,
    emailConfirmed: true,
    ...overrides,
  };
}

describe("emailNamespaces", () => {
  // 33mail hands one person every address under their own subdomain, so the
  // subdomain — not the local part — is the inbox identity.
  test("extracts the per-user subdomain of an alias service", () => {
    expect(emailNamespaces("Helicopters@spaga.33mail.com")).toEqual([
      { code: "shared-alias-namespace", label: "shared-33mail-subdomain", key: "33mail.com/spaga" },
      { code: "shared-normalized-mailbox", label: null, key: "helicopters@spaga.33mail.com" },
    ]);
  });

  test("two aliases under one subdomain share the namespace key", () => {
    const [first] = emailNamespaces("Svenghali@spaga.33mail.com");
    const [second] = emailNamespaces("basis@spaga.33mail.com");
    expect(first.key).toBe(second.key);
  });

  test("different subdomains of one service do not share a key", () => {
    const [first] = emailNamespaces("astronaut@cyclone.33mail.com");
    const [second] = emailNamespaces("Helicopters@spaga.33mail.com");
    expect(first.key).not.toBe(second.key);
  });

  test("other alias services with per-user subdomains are covered", () => {
    expect(emailNamespaces("shopping@spaga.anonaddy.com")[0]).toEqual({
      code: "shared-alias-namespace",
      label: "shared-anonaddy-subdomain",
      key: "anonaddy.com/spaga",
    });
    expect(emailNamespaces("shopping@spaga.addy.io")[0].label).toBe("shared-addy-subdomain");
  });

  // A service whose addresses all sit on the bare domain (Firefox Relay, Duck)
  // gives no per-person grouping, so it must not produce a namespace.
  test("a service without per-user subdomains yields no namespace", () => {
    expect(emailNamespaces("abc123@mozmail.com").map((n) => n.code)).toEqual(["shared-normalized-mailbox"]);
    expect(emailNamespaces("someone@duck.com").map((n) => n.code)).toEqual(["shared-normalized-mailbox"]);
  });

  // An alias-service address with no subdomain at all identifies no namespace.
  test("an alias service used without a subdomain yields no namespace", () => {
    expect(emailNamespaces("someone@33mail.com").map((n) => n.code)).toEqual(["shared-normalized-mailbox"]);
  });

  test("a multi-label subdomain stays intact in the key", () => {
    expect(emailNamespaces("x@one.two.33mail.com")[0].key).toBe("33mail.com/one.two");
  });

  test("gmail dots and plus tags fold to one mailbox key", () => {
    const [dotted] = emailNamespaces("shem.rah.boo+tag@gmail.com");
    const [plain] = emailNamespaces("shemrahboo@gmail.com");
    expect(dotted.key).toBe(plain.key);
  });

  test("dots stay significant outside gmail, plus tags do not", () => {
    expect(emailNamespaces("shem.rah@hotmail.com")[0].key).not.toBe(emailNamespaces("shemrah@hotmail.com")[0].key);
    expect(emailNamespaces("shemrah+db@hotmail.com")[0].key).toBe(emailNamespaces("shemrah@hotmail.com")[0].key);
  });

  // The local sync stubs missing accounts as stub-<id>@local.invalid. Those are a
  // local artifact, never a real inbox, so they must not group anything.
  test("sync-stub addresses yield no namespaces at all", () => {
    expect(emailNamespaces("stub-abc@local.invalid")).toEqual([]);
  });

  test("a malformed address yields no namespaces", () => {
    expect(emailNamespaces("not-an-address")).toEqual([]);
    expect(emailNamespaces("@nolocalpart.com")).toEqual([]);
    expect(emailNamespaces("nodomain@")).toEqual([]);
    expect(emailNamespaces("")).toEqual([]);
  });
});

describe("isDisposableEmailDomain", () => {
  test("recognizes known throwaway services and passes real providers", () => {
    expect(isDisposableEmailDomain("tempest@mailinator.com")).toBe(true);
    expect(isDisposableEmailDomain("someone@GuerrillaMail.com")).toBe(true);
    expect(isDisposableEmailDomain("someone@gmail.com")).toBe(false);
    expect(isDisposableEmailDomain("not-an-address")).toBe(false);
  });
});

describe("redactNamespaceKey", () => {
  test("is stable for one key and salt, and differs across keys", () => {
    const first = redactNamespaceKey("33mail.com/spaga", "pepper");
    expect(redactNamespaceKey("33mail.com/spaga", "pepper")).toBe(first);
    expect(redactNamespaceKey("33mail.com/cyclone", "pepper")).not.toBe(first);
  });

  test("a different salt produces a different fingerprint for the same key", () => {
    expect(redactNamespaceKey("33mail.com/spaga", "pepper")).not.toBe(redactNamespaceKey("33mail.com/spaga", "salt"));
  });

  test("the fingerprint leaks nothing of the key", () => {
    const fingerprint = redactNamespaceKey("33mail.com/spaga", "pepper");
    expect(fingerprint).toMatch(/^[0-9a-f]{12}$/);
    expect(fingerprint).not.toContain("spaga");
  });

  // The salt is optional so no secret setup gates the job; without it the signal
  // label alone still says why a group merged.
  test("no salt means no fingerprint", () => {
    expect(redactNamespaceKey("33mail.com/spaga", undefined)).toBeNull();
    expect(redactNamespaceKey("33mail.com/spaga", "")).toBeNull();
  });
});

describe("groupByInbox", () => {
  // Three logins, three addresses, one 33mail inbox — the shape of the real cluster
  // this job exists to find, and the whole reason it has to run in prod.
  test("accounts sharing an alias namespace become one group", () => {
    const groups = groupByInbox({
      namespaceSalt: "pepper",
      accounts: [
        account({ userId: "u1", username: "Munchkin", email: "basis@spaga.33mail.com" }),
        account({ userId: "u2", username: "Confrontation", email: "Helicopters@spaga.33mail.com" }),
        account({ userId: "u3", username: "Triumph", email: "Svenghali@spaga.33mail.com" }),
      ],
    });

    expect(groups).toHaveLength(1);
    const [group] = groups;
    expect(group.reasonCodes).toEqual(["shared-alias-namespace"]);
    expect(group.namespaceSignal).toBe("shared-33mail-subdomain");
    expect(group.namespaceFingerprint).toMatch(/^[0-9a-f]{12}$/);
    // Representative is the alphabetically-first normalized username, so the key a
    // person folds to never depends on row order.
    expect(group.groupKey).toBe("confrontation");
    expect(group.normalizedUsernames).toEqual(["confrontation", "munchkin", "triumph"]);
  });

  // A 33mail subdomain is one person's private namespace, so it proves one inbox
  // whether or not every account completed confirmation — but the gap is recorded.
  test("an unconfirmed member still merges, and is flagged", () => {
    const groups = groupByInbox({
      accounts: [
        account({ userId: "u1", username: "Munchkin", email: "basis@spaga.33mail.com" }),
        account({
          userId: "u2",
          username: "Confrontation",
          email: "Helicopters@spaga.33mail.com",
          emailConfirmed: false,
        }),
      ],
    });

    expect(groups).toHaveLength(1);
    expect(groups[0].reasonCodes).toEqual(["shared-alias-namespace", "unconfirmed-member"]);
  });

  test("two accounts folding to one gmail mailbox are a group", () => {
    const groups = groupByInbox({
      accounts: [
        account({ userId: "u1", username: "RockCandy", email: "shem.rah.boo@gmail.com" }),
        account({ userId: "u2", username: "Overture", email: "shemrahboo+db@gmail.com" }),
      ],
    });

    expect(groups).toHaveLength(1);
    expect(groups[0].reasonCodes).toEqual(["shared-normalized-mailbox"]);
    // There is no namespace to name for a mailbox match, so no label is published.
    expect(groups[0].namespaceSignal).toBeNull();
    expect(groups[0].namespaceFingerprint).toBeNull();
  });

  // A mailbox match nests inside a namespace match (the mailbox key carries the
  // domain), so overlapping evidence must yield one group carrying both reasons —
  // never a namespace group plus a duplicate sub-group.
  test("nested namespace and mailbox evidence yields a single group", () => {
    const groups = groupByInbox({
      accounts: [
        account({ userId: "u1", username: "Alpha", email: "vassillios@spaga.33mail.com" }),
        account({ userId: "u2", username: "Bravo", email: "vassillios+db@spaga.33mail.com" }),
        account({ userId: "u3", username: "Charlie", email: "aceetobee@spaga.33mail.com" }),
      ],
    });

    expect(groups).toHaveLength(1);
    expect(groups[0].normalizedUsernames).toEqual(["alpha", "bravo", "charlie"]);
    expect(groups[0].reasonCodes).toEqual(["shared-alias-namespace", "shared-normalized-mailbox"]);
  });

  // Usernames that already fold together are merged by `normalize` itself; a row
  // per group would be redundant and would collide on the unique key.
  test("a group collapsing to one normalized username is dropped", () => {
    const groups = groupByInbox({
      accounts: [
        account({ userId: "u1", username: "RockCandy", email: "one@spaga.33mail.com" }),
        account({ userId: "u2", username: "rockcandy ", email: "two@spaga.33mail.com" }),
      ],
    });

    expect(groups).toEqual([]);
  });

  test("an account with no username cannot be keyed and is skipped", () => {
    const groups = groupByInbox({
      accounts: [
        account({ userId: "u1", username: "Munchkin", email: "one@spaga.33mail.com" }),
        account({ userId: "u2", username: null, email: "two@spaga.33mail.com" }),
      ],
    });

    expect(groups).toEqual([]);
  });

  // Names are self-entered and trivially fakeable (one known account entered a
  // Simpsons villain's name), so they corroborate an inbox match, never form one.
  test("a shared entered name annotates a group formed by email evidence", () => {
    const groups = groupByInbox({
      accounts: [
        account({
          userId: "u1",
          username: "Highwire",
          email: "one@spaga.33mail.com",
          firstName: "Rage",
          lastName: "Machine",
        }),
        account({
          userId: "u2",
          username: "Confrontation",
          email: "two@spaga.33mail.com",
          firstName: " rage ",
          lastName: "MACHINE",
        }),
      ],
    });

    expect(groups[0].reasonCodes).toEqual(["shared-alias-namespace", "same-entered-name"]);
  });

  test("a shared entered name alone forms no group", () => {
    const groups = groupByInbox({
      accounts: [
        account({
          userId: "u1",
          username: "Highwire",
          email: "a@hotmail.com",
          firstName: "Rage",
          lastName: "Machine",
        }),
        account({
          userId: "u2",
          username: "Higwire",
          email: "b@gmail.com",
          firstName: "Rage",
          lastName: "Machine",
        }),
      ],
    });

    expect(groups).toEqual([]);
  });

  test("a partial entered name is not a shared name", () => {
    const groups = groupByInbox({
      accounts: [
        account({ userId: "u1", username: "A", email: "one@spaga.33mail.com", firstName: "Rage", lastName: null }),
        account({ userId: "u2", username: "B", email: "two@spaga.33mail.com", firstName: "Rage", lastName: null }),
      ],
    });

    expect(groups[0].reasonCodes).toEqual(["shared-alias-namespace"]);
  });

  test("a throwaway domain on a member is recorded", () => {
    const groups = groupByInbox({
      accounts: [
        account({ userId: "u1", username: "PlanB", email: "tempest@mailinator.com" }),
        account({ userId: "u2", username: "SaveTheRobots", email: "tempest+two@mailinator.com" }),
      ],
    });

    expect(groups).toHaveLength(1);
    expect(groups[0].reasonCodes).toEqual(["shared-normalized-mailbox", "disposable-email-domain"]);
  });

  test("unlinked accounts produce no groups", () => {
    const groups = groupByInbox({
      accounts: [
        account({ userId: "u1", username: "Overture", email: "crickets@yahoo.com" }),
        account({ userId: "u2", username: "Voices", email: "reactor@protonmail.com" }),
        account({ userId: "u3", username: "stubbed", email: "stub-u3@local.invalid" }),
        account({ userId: "u4", username: "noemail", email: null }),
      ],
    });

    expect(groups).toEqual([]);
  });

  // The whole privacy contract in one assertion: addresses go in, and the only thing
  // derived from one that comes out is the salted fingerprint. Naming the alias
  // SERVICE is fine — it identifies a public product, not a person — but the local
  // part, the person's subdomain, and the domain itself must never ship.
  test("no identifying part of an email address survives into the output", () => {
    const groups = groupByInbox({
      namespaceSalt: "pepper",
      accounts: [
        account({ userId: "u1", username: "Munchkin", email: "basis@spaga.33mail.com" }),
        account({ userId: "u2", username: "Confrontation", email: "Helicopters@spaga.33mail.com" }),
      ],
    });

    const serialized = JSON.stringify(groups);
    expect(serialized).not.toContain("@");
    // The local part, the person's subdomain, and the domain are all forbidden. The
    // alias SERVICE name is not — it identifies a public product, not a person, and
    // `shared-33mail-subdomain` is the published label.
    for (const fragment of ["basis", "spaga", ".com"]) {
      expect(serialized).not.toContain(fragment);
    }
    // The published label is the service name only, exactly as specified.
    expect(groups[0].namespaceSignal).toBe("shared-33mail-subdomain");
  });

  test("output is deterministic and ordered by group key", () => {
    const input = {
      accounts: [
        account({ userId: "u1", username: "Zeta", email: "one@zzz.33mail.com" }),
        account({ userId: "u2", username: "Yankee", email: "two@zzz.33mail.com" }),
        account({ userId: "u3", username: "Alpha", email: "three@aaa.33mail.com" }),
        account({ userId: "u4", username: "Bravo", email: "four@aaa.33mail.com" }),
      ],
    };

    const groups = groupByInbox(input);
    expect(groups.map((group) => group.groupKey)).toEqual(["alpha", "yankee"]);
    expect(groupByInbox(input)).toEqual(groups);
  });
});
