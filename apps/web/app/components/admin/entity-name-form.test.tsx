import { setup } from "@test/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const submitMock = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useSubmit: () => submitMock, useNavigate: () => vi.fn() };
});

import { EntityNameForm } from "./entity-name-form";

describe("EntityNameForm", () => {
  beforeEach(() => {
    submitMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("derives the label and placeholder from the noun", async () => {
    await setup(<EntityNameForm noun="instrument" submitLabel="Create" cancelHref="/admin/instruments" />);

    expect(screen.getByText("Instrument Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter instrument name")).toBeInTheDocument();
  });

  test("submits the name as FormData", async () => {
    const { user } = await setup(
      <EntityNameForm
        noun="author"
        submitLabel="Save"
        cancelHref="/admin/authors"
        defaultValues={{ name: "Marc Brownstein" }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(submitMock).toHaveBeenCalled());
    const submittedForm = submitMock.mock.calls[0][0] as FormData;
    expect(Object.fromEntries(submittedForm.entries())).toEqual({ name: "Marc Brownstein" });
  });

  test("blocks submit and shows a validation message when the name is empty", async () => {
    const { user } = await setup(<EntityNameForm noun="author" submitLabel="Save" cancelHref="/admin/authors" />);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Author name is required")).toBeInTheDocument();
    expect(submitMock).not.toHaveBeenCalled();
  });
});
