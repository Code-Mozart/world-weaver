# World Weaver

Weave your own worlds – A vector based map editor for creating 2D fantasy maps/worlds.

## Development

### Roadmap and current development

**Changes to data model**

- new field in river network edge: width
- new fields for mountain network node: radius and height (edge width is interpolated between mountain point radii)

**World Deltas**

- Implement the world delta processing as outlined in the [OpenAPI specification](documentation/openapi.yml)
- Implement creating world deltas from changes in the editor
- Implement undo/redo in the editor using the world deltas (requires extending the world deltas to also create the inverse deltas, mostly storing the previous data which has to be done on the server as the client can not be trusted to give us this information)
- Implement a strategy for commiting the changes/deltas to the server
  -> support `onbeforeunload` to warn the user about unsaved changes only when there are changes that were not commited yet
- Implement applying and undoing world deltas in the Client
- Implement converting world deltas to the database
- Later: Implement fetching deltas from other authors, to do this we have a `lastChangesPulledAt` field and need a new API endpoint with a `after` parameter to filter for changes after a certain timestamp
- Later: Implement offline editing by saving the world and deltas to local storage

**Editor**

- Rendering the world (just the background depending on the worlds ground type for empty worlds)
- Selecting points in editor
- Controls for moving points

**Additional world objects**

- Roads using networks
- Forests using polygons
- Settlements using points
- Arbitrary information that can be brought into an hierarchy and uses any geometry (points, networks, polygons)
- Hills and Dunes as polygons

### Running the app

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Counting lines of code

```bash
wc -l $(git ls-files | grep -e '.*\.ts' -e '.*\.svelte')
```

### Testing

This project uses (Vitest)[https://vitest.dev/] as a testing frameworks. At the moment test are only written for bug-prone and complicated parts of the code. Feel free to add more.

To run tests, run

```bash
npm run test
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
