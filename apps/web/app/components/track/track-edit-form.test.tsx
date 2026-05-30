import { setup } from "@test/test-utils";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { TrackEditForm } from "./track-edit-form";
import type { TrackFormData } from "./use-track-api";

const BASE_FORM: TrackFormData = {
  songId: "none",
  set: "S1",
  position: 1,
  segue: "none",
  note: null,
  annotationDesc: null,
  allTimer: false,
  duration: "",
  durationSource: null,
};

describe("TrackEditForm", () => {
  // The form is editing-aware: when `isEditing` is true it shows "Update";
  // otherwise "Add". This drives which CTA the user sees in the same form.
  test("renders the 'Add' CTA when isEditing is false", async () => {
    await setup(
      <TrackEditForm
        formData={BASE_FORM}
        onFormDataChange={vi.fn()}
        isEditing={false}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /update/i })).not.toBeInTheDocument();
  });

  test("renders the 'Update' CTA when isEditing is true", async () => {
    await setup(
      <TrackEditForm
        formData={BASE_FORM}
        onFormDataChange={vi.fn()}
        isEditing
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /update/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^add/i })).not.toBeInTheDocument();
  });

  // While submitting, both CTAs disable so a slow API can't be triggered
  // twice by a double-click.
  test("disables the submit button while isSubmitting", async () => {
    await setup(
      <TrackEditForm
        formData={BASE_FORM}
        onFormDataChange={vi.fn()}
        isEditing={false}
        isSubmitting
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /add/i })).toBeDisabled();
  });

  // Note textarea is pre-populated from formData.note. Editing fires
  // onFormDataChange with the new value. Empty string normalizes to null
  // so the form state matches the DB column type.
  test("seeds the Note textarea from formData.note", async () => {
    await setup(
      <TrackEditForm
        formData={{ ...BASE_FORM, note: "The jam emerges as minimal trance" }}
        onFormDataChange={vi.fn()}
        isEditing
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/track notes/i)).toHaveValue("The jam emerges as minimal trance");
  });

  // We drive the change directly via fireEvent because the form is fully
  // controlled — the parent owns formData and decides when to re-render.
  // user.type can't progress past the first character on a controlled
  // input that doesn't receive prop updates, so we synthesize the change
  // event instead.
  test("changing Note fires onFormDataChange whose updater sets the new value", async () => {
    const onFormDataChange = vi.fn();
    await setup(
      <TrackEditForm
        formData={BASE_FORM}
        onFormDataChange={onFormDataChange}
        isEditing={false}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText(/track notes/i), {
      target: { value: "The jam emerges" },
    });

    const updater = onFormDataChange.mock.calls.at(-1)?.[0] as (p: TrackFormData) => TrackFormData;
    expect(updater(BASE_FORM).note).toBe("The jam emerges");
  });

  // Clearing the textarea sends null (not empty string) so the column
  // type matches the DB.
  test("clearing Note sends null via the updater, not an empty string", async () => {
    const onFormDataChange = vi.fn();
    await setup(
      <TrackEditForm
        formData={{ ...BASE_FORM, note: "x" }}
        onFormDataChange={onFormDataChange}
        isEditing
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText(/track notes/i), { target: { value: "" } });

    const updater = onFormDataChange.mock.calls.at(-1)?.[0] as (p: TrackFormData) => TrackFormData;
    expect(updater({ ...BASE_FORM, note: "x" }).note).toBeNull();
  });

  // Annotations textarea is shown alongside Notes — the "one per line"
  // hint signals the field's expected format.
  test("annotations field shows the 'one per line' hint", async () => {
    await setup(
      <TrackEditForm
        formData={BASE_FORM}
        onFormDataChange={vi.fn()}
        isEditing
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText(/one per line/i)).toBeInTheDocument();
  });

  // All-timer checkbox is checked when formData.allTimer is true.
  test("all-timer checkbox reflects formData.allTimer", async () => {
    await setup(
      <TrackEditForm
        formData={{ ...BASE_FORM, allTimer: true }}
        onFormDataChange={vi.fn()}
        isEditing
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole("checkbox", { name: /all-timer/i })).toBeChecked();
  });

  // Submit / Cancel fire the matching callbacks — the form doesn't own
  // any submission logic itself.
  test("clicking the submit CTA fires onSubmit", async () => {
    const onSubmit = vi.fn();
    const { user } = await setup(
      <TrackEditForm
        formData={BASE_FORM}
        onFormDataChange={vi.fn()}
        isEditing={false}
        isSubmitting={false}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test("clicking the cancel CTA fires onCancel", async () => {
    const onCancel = vi.fn();
    const { user } = await setup(
      <TrackEditForm
        formData={BASE_FORM}
        onFormDataChange={vi.fn()}
        isEditing={false}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
