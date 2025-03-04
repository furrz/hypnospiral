# hypnospiral visualizer

This is the source code of [hypno.zyntaks.ca](https://hypno.zyntaks.ca).

## Project Structure

This project is structured as a static website, using webpack to compile the TypeScript source into JS bundles.

To start a local development server, use `npm run dev`.

### Directory Structure

- `web` - Static content, copied directly to the root of the static output.
- `src` - Typescript source code for the actual app.
  - `assets` - Icons and other assets referenced by components in the app.
  - `components` - Definitions of React components.
    - `building_blocks.tsx` - Basic, reusable components for building the app's UI. Buttons, menus, etc.
    - `app.tsx` - The root component and router of the application.
  - `pages` - Definitions of pages of UI shown in the app. Most of these are routed to from somewhere via 
    `components/app.tsx`.
  - `util` - General utility code, such as timers, array helpers, etc.
  - `features` - Individual features go in here, creating a vertical slice architecture that separates them cleanly from
     the main app, and keeps their related files grouped together for easy editing.
    - `[feature name]`
      - `component[.tsx]` - The React component(s) associated with this feature.
      - `customize[.tsx]` - The customization page(s) associated with this feature.
      - `state.ts` - Defines shared state associated with this feature. Usually, these are `hashState`, which is stored
        in the hash (`#`) part of the page URL for easy sharing.

### Testing

Use `npm run test` to run all tests using vitest.

Tests are defined in `[filename].test.ts`, which should appear alongside the associated ts or tsx module being tested.

Testing React and DOM/Browser-related features can be tricky.
As much behaviour as possible should be kept abstracted away from UI and browser concerns, for easier testing.

### Jank / Gotchas

The hypnospiral visualizer uses several bits of tooling in unintended ways, so do keep these potentially flaky bits in
mind when working with the project:

#### Pre-renderer Jank

In order to optimize SEO and apparent loading times, while still allowing the app to be hosted as a static site,
this project uses webpack to pre-render the landing page.
For this reason, two builds are made when building the project: first, a compile-side build, for pre-rendering,
and then the browser-side build.

For this reason, code must be written to consider the possibility that basic browser APIs and objects - such
as `window` and `localStorage` - may not always exist. When trying to use these APIs, code must first check if
they even exist, and fall back to a sane default.

#### Router Jank

This project uses react-router, but does not store these paths in the actual URL bar. Instead, it uses a MemoryRouter,
and uses the browser history API to keep track of React state changes. You must not be careful to confuse the internal
route paths, which *look* like relative URL paths, with the actual URL - trying to direct a user to, for example,
`/customize` using a regular `a href` will send them directly to a nonexistent page and a 404 message from the server.

## License

Source code copyright &copy; 2022-2025 PrinceZyntaks. Licensed under the MIT license, see LICENSE file for more details.

Certain libraries and assets licensed under their own separate licenses:
 - Sounds in `web/audio` folder licensed under CC0 license, by [kenney.nl](https://kenney.nl).
 - Some assets in `web/img` folder provided by [@GooeyBlueBoye](https://twitter.com/GooeyBlueBoye), as part of the side-project
   left partially intact in test_metronome.html. Please do not redistribute or reuse these assets.
