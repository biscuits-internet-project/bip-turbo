import { render, screen, within } from "@testing-library/react";
import { type Options, userEvent } from "@testing-library/user-event";
import { expect } from "vitest";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

type voidFunc = () => void;

/**
 * Renders a component and returns both the RTL render result and a configured
 * `userEvent` instance — bundled together so every test can kick off with one
 * line instead of wiring up `userEvent.setup()` + `render()` separately.
 *
 * Use this for every component test that doesn't need router context. If the
 * component renders a react-router `<Link>`, `<NavLink>`, or uses router hooks,
 * use `setupWithRouter` instead.
 *
 * @example
 *   const { user } = await setup(<MyButton onClick={handler} />);
 *   await user.click(screen.getByRole("button"));
 */
export const setup = async (ui: ReactElement, options?: Options) => ({
  user: await userEvent.setup(options),
  ...render(ui),
});

/**
 * Same as `setup`, but wraps the UI in a `MemoryRouter` so react-router
 * components (`<Link>`, `<NavLink>`, `useNavigate`, etc.) render without errors.
 *
 * Use this whenever the component under test contains anything from
 * `react-router-dom`. If you forget the router wrapper, tests fail with
 * confusing "You cannot render a <Link> outside a <Router>" errors.
 *
 * @example
 *   const { user } = await setupWithRouter(<SongCard song={song} />);
 */
export const setupWithRouter = async (ui: ReactElement, options?: Options) => ({
  user: await userEvent.setup(options),
  ...render(<MemoryRouter>{ui}</MemoryRouter>),
});

/**
 * Returns a stub component (plain `<div>`) that captures the props it was
 * called with. Use this inside `vi.mock()` to replace a child component that
 * would otherwise be rendered in full during a parent's test.
 *
 * Use when: the component under test renders a stateful / network-heavy child
 * (e.g. `TrackRatingCell`, `StarRating`) and you want to assert "the right
 * props were passed to it" without actually exercising the child's internals.
 * This keeps parent tests focused on the parent's own behavior and avoids
 * cascading failures when an unrelated child has a bug.
 *
 * Function props are invoked once during the stub's creation so that
 * `expectMockedShallowComponent` can verify they were passed (via `toHaveBeenCalledTimes(1)`).
 *
 * @example
 *   vi.mock("./track-rating-cell", () => ({
 *     TrackRatingCell: (props: object) => mockShallowComponent("TrackRatingCell", props),
 *   }));
 *   // later in the test:
 *   expectMockedShallowComponent("TrackRatingCell", { trackId: "abc", ... });
 */
export const mockShallowComponent = (mockComponentName: string, props: object) => {
  const propsRecord = props as Record<string, unknown>;
  // If a function was passed as a prop, there is no easy way to print out its value in the prop
  // as a string. Instead we call these passed functions once so that it can be verified that they
  // were passed as a prop.
  Object.keys(propsRecord).forEach((key) => {
    if (typeof propsRecord[key] === "function") {
      const func = propsRecord[key] as voidFunc;
      func();
    }
  });
  return (
    <div data-testid={`${mockComponentName}`}>
      props: {JSON.stringify(props, Object.keys(props).sort())}
    </div>
  );
};

/**
 * Asserts that exactly one stubbed child (created via `mockShallowComponent`)
 * is in the document AND was rendered with the expected props.
 *
 * Use this when the parent renders the stubbed child exactly once. If the
 * parent renders the stub multiple times (e.g. one per row), use
 * `expectAllMockedShallowComponent` instead.
 *
 * Pass any `vi.fn()` mocks that should have been props in the `functions`
 * array — this verifies each was "called once" (by `mockShallowComponent`
 * during stub creation), confirming it was actually passed as a prop.
 *
 * @example
 *   const onSelect = vi.fn();
 *   // ...render parent with <MyChild onSelect={onSelect} label="Hello" />
 *   expectMockedShallowComponent("MyChild", { onSelect, label: "Hello" }, [onSelect]);
 */
export const expectMockedShallowComponent = (
  mockComponentName: string,
  props: object,
  functions: voidFunc[] = [],
) => {
  const component = screen.getByTestId(mockComponentName);
  expect(component).toBeInTheDocument();
  expect(
    within(component).getByText(`props: ${JSON.stringify(props, Object.keys(props).sort())}`),
  ).toBeInTheDocument();
  // Verify that each function that should have been a prop was "called" one time by
  // mockShallowComponent
  functions.forEach((func) => {
    expect(func).toHaveBeenCalledTimes(1);
  });
};

/**
 * Asserts that the stubbed child was rendered N times with the expected props
 * per instance (positional — first rendered instance matches `props[0]`, etc.).
 *
 * Use this for list/table rows where the parent renders the same child
 * component once per data row. For example, asserting `<TrackRatingCell>`
 * received the right props for each performance in `<PerformanceTable>`.
 *
 * `functions` array is checked with `toHaveBeenCalledTimes(props.length)` —
 * each function prop should have been invoked once per rendered stub.
 *
 * @example
 *   expectAllMockedShallowComponent("TrackRatingCell", [
 *     { trackId: "1", rating: 5, ... },
 *     { trackId: "2", rating: 4, ... },
 *     { trackId: "3", rating: 3, ... },
 *   ]);
 */
export const expectAllMockedShallowComponent = (
  mockComponentName: string,
  props: object[],
  functions: voidFunc[] = [],
) => {
  const components = screen.getAllByTestId(mockComponentName);
  expect(components).toHaveLength(props.length);
  for (let i = 0; i < props.length; i++) {
    expect(
      within(components[i]).getByText(
        `props: ${JSON.stringify(props[i], Object.keys(props[i]).sort())}`,
      ),
    ).toBeInTheDocument();
  }
  // Verify that each function that should have been a prop was "called" one time by
  // mockShallowComponent. In this case, each time should be the number of components that we are
  // looking for
  functions.forEach((func) => {
    expect(func).toHaveBeenCalledTimes(props.length);
  });
};

/**
 * Asserts that a stubbed child is NOT rendered. Use this to verify conditional
 * rendering — e.g., "when `showRating={false}`, the rating cell stub is absent."
 *
 * @example
 *   expectMockedShallowComponentNotInDocument("TrackRatingCell");
 */
export const expectMockedShallowComponentNotInDocument = (mockComponentName: string) => {
  const component = screen.queryByTestId(mockComponentName);
  expect(component).not.toBeInTheDocument();
};
