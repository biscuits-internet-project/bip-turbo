import { setup } from "@test/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const submitMock = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useSubmit: () => submitMock, useNavigate: () => vi.fn() };
});

// Stub the instrument picker so the form test doesn't hit the network and
// doesn't mutate the field; its selected value is exercised via defaultValues.
vi.mock("./instrument-search", () => ({
  InstrumentSearch: ({ value }: { value?: string | null }) => <div data-testid="InstrumentSearch">{value ?? ""}</div>,
}));

import { MusicianForm } from "./musician-form";

describe("MusicianForm", () => {
  beforeEach(() => {
    submitMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders the knownFrom field and the instrument picker", async () => {
    await setup(<MusicianForm submitLabel="Create Musician" cancelHref="/musicians" />);

    expect(screen.getByText("Known From")).toBeInTheDocument();
    expect(screen.getByTestId("InstrumentSearch")).toBeInTheDocument();
  });

  test("submitting posts the name, knownFrom, and default instrument", async () => {
    const { user } = await setup(
      <MusicianForm
        submitLabel="Save"
        cancelHref="/musicians"
        defaultValues={{ name: "Aron Magner", knownFrom: "Conspirator", defaultInstrumentId: "keys-id" }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(submitMock).toHaveBeenCalled());
    const submittedForm = submitMock.mock.calls[0][0] as FormData;
    expect(Object.fromEntries(submittedForm.entries())).toEqual({
      name: "Aron Magner",
      knownFrom: "Conspirator",
      defaultInstrumentId: "keys-id",
    });
  });
});
