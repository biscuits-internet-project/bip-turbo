import { setupWithRouter } from "@test/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { VenueForm } from "./venue-form";

describe("VenueForm", () => {
  // Default-country branch: with "United States" as the country, the
  // state field renders as the state-picker dropdown labeled "State"
  // (not "State/Province"), because we know which list applies.
  test("renders state as a 'State' dropdown when country is the United States", async () => {
    await setupWithRouter(<VenueForm onSubmit={vi.fn()} submitLabel="Save" cancelHref="/venues" />);

    // The visible label is exactly "State" + the required marker "*".
    // It's a <label> with `for=...`; querying via the form-item role
    // group keeps us off Radix's hidden native `<select>` element.
    const labels = screen.getAllByText(
      (_, el) => el?.tagName === "LABEL" && /^State\s*\*?$/.test(el.textContent ?? ""),
    );
    expect(labels.length).toBeGreaterThan(0);
  });

  // Switching to Canada flips the label to "Province" — the wording
  // matches what Canadian admins expect.
  test("flips the state field to 'Province' when country becomes Canada", async () => {
    const { user } = await setupWithRouter(<VenueForm onSubmit={vi.fn()} submitLabel="Save" cancelHref="/venues" />);

    const comboboxes = screen.getAllByRole("combobox");
    const countryCombobox = comboboxes.find((c) => c.textContent?.includes("United States"));
    if (!countryCombobox) throw new Error("country combobox not found");
    await user.click(countryCombobox);
    // The Radix popover renders options with role="option"; the hidden
    // native `<option>` Radix injects for accessibility is NOT in the
    // popover's role tree, so this picks the interactive one.
    await user.click(await screen.findByRole("option", { name: "Canada" }));

    await waitFor(() => {
      const provinceLabels = screen.getAllByText(
        (_, el) => el?.tagName === "LABEL" && /^Province\s*\*?$/.test(el.textContent ?? ""),
      );
      expect(provinceLabels.length).toBeGreaterThan(0);
    });
  });

  // Any country that isn't US or Canada renders state as a free-text
  // input labeled "State/Province" — there's no canonical list for
  // those countries, so the form falls back to manual entry.
  test("renders state as a free-text input for non-US/Canada countries", async () => {
    const { user } = await setupWithRouter(<VenueForm onSubmit={vi.fn()} submitLabel="Save" cancelHref="/venues" />);

    const comboboxes = screen.getAllByRole("combobox");
    const countryCombobox = comboboxes.find((c) => c.textContent?.includes("United States"));
    if (!countryCombobox) throw new Error("country combobox not found");
    await user.click(countryCombobox);
    await user.click(await screen.findByRole("option", { name: "United Kingdom" }));

    await waitFor(() => expect(screen.getByPlaceholderText(/state or province/i)).toBeInTheDocument());
  });

  // Default values seed the form for the edit flow — the parent route
  // passes the existing venue and the form renders it pre-populated.
  test("seeds inputs from defaultValues for the edit flow", async () => {
    await setupWithRouter(
      <VenueForm
        defaultValues={{ name: "Wetlands", city: "New York", state: "NY", country: "United States" }}
        onSubmit={vi.fn()}
        submitLabel="Update"
        cancelHref="/venues"
      />,
    );

    expect(screen.getByPlaceholderText(/venue name/i)).toHaveValue("Wetlands");
    expect(screen.getByPlaceholderText(/enter city/i)).toHaveValue("New York");
  });

  // Submitting with valid data calls onSubmit with the form values.
  test("submits the form values via onSubmit when fields are valid", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { user } = await setupWithRouter(<VenueForm onSubmit={onSubmit} submitLabel="Save" cancelHref="/venues" />);

    // Fill name / city via fireEvent.change (the inputs are controlled
    // through react-hook-form, which can handle synthetic change events
    // even when the visible value briefly desyncs).
    fireEvent.change(screen.getByPlaceholderText(/venue name/i), {
      target: { value: "Red Rocks" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter city/i), {
      target: { value: "Morrison" },
    });

    // Pick a state from the dropdown.
    const comboboxes = screen.getAllByRole("combobox");
    const stateCombobox = comboboxes.find((c) => c.textContent?.includes("Select state"));
    if (!stateCombobox) throw new Error("state combobox not found");
    await user.click(stateCombobox);
    await user.click(await screen.findByRole("option", { name: "CO" }));

    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
      const submitted = onSubmit.mock.calls[0][0];
      expect(submitted.name).toBe("Red Rocks");
      expect(submitted.city).toBe("Morrison");
      expect(submitted.state).toBe("CO");
      expect(submitted.country).toBe("United States");
    });
  });

  // Cities with commas fail Zod validation — the error message bubbles
  // through FormMessage and the form refuses to call onSubmit.
  test("rejects cities containing a comma and does not call onSubmit", async () => {
    const onSubmit = vi.fn();
    const { user } = await setupWithRouter(<VenueForm onSubmit={onSubmit} submitLabel="Save" cancelHref="/venues" />);

    fireEvent.change(screen.getByPlaceholderText(/venue name/i), {
      target: { value: "Some Venue" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter city/i), {
      target: { value: "Brooklyn, NY" },
    });

    const comboboxes = screen.getAllByRole("combobox");
    const stateCombobox = comboboxes.find((c) => c.textContent?.includes("Select state"));
    if (!stateCombobox) throw new Error("state combobox not found");
    await user.click(stateCombobox);
    await user.click(await screen.findByRole("option", { name: "NY" }));

    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(screen.getByText(/should not contain commas/i)).toBeInTheDocument());
    expect(onSubmit).not.toHaveBeenCalled();
  });

  // US / Canada require a state; if the admin leaves it blank the form
  // surfaces the schema-level error and refuses to submit.
  test("requires a state when country is US or Canada", async () => {
    const onSubmit = vi.fn();
    const { user } = await setupWithRouter(<VenueForm onSubmit={onSubmit} submitLabel="Save" cancelHref="/venues" />);

    fireEvent.change(screen.getByPlaceholderText(/venue name/i), {
      target: { value: "Some Venue" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter city/i), {
      target: { value: "Anywhere" },
    });

    // Don't touch the state combobox. Submit.
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(screen.getByText(/state\/province is required/i)).toBeInTheDocument());
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
