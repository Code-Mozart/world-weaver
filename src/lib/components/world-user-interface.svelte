<script lang="ts">
  import type { EditorWorld } from "$lib/controllers/editor-world";

  let {
    world,
    onNavigationControlsChanged,
  }: { world: EditorWorld; onNavigationControlsChanged?: (value: "mouse" | "gesture") => void } = $props();

  function handleNaviagtionControlSetting(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (!["mouse", "gesture"].includes(value)) {
      throw new Error(`Invalid navigation control value: ${value}`);
    }
    onNavigationControlsChanged?.(value as "mouse" | "gesture");
  }
</script>

<div class="world-ui">
  <div class="top">
    <p>Editing world '{world.worldDocument.name}'</p>
  </div>
  <div class="bottom">
    <div class="toggle-group-container">
      <p>Navigation Controls</p>

      <div class="toggle-group navigation-controls">
        <input type="radio" name="default" id="mouse-controls" value="mouse" oninput={handleNaviagtionControlSetting} />
        <label for="mouse-controls">Mouse Controls</label>

        <input
          type="radio"
          name="default"
          id="gesture-controls"
          value="gesture"
          oninput={handleNaviagtionControlSetting}
          checked
        />
        <label for="gesture-controls">Gesture Controls</label>
      </div>
    </div>
  </div>
</div>

<style>
  @media (prefers-color-scheme: light) {
    .world-ui {
      --background-color: #ffffff;
      --foreground-color: #111111;
      --weak-contrast-color: rgb(236, 236, 236);

      --inverted-foreground-color: #ffffff;
      --inverted-background-color: #111111;
    }
  }

  @media (prefers-color-scheme: dark) {
    .world-ui {
      --background-color: #111111;
      --foreground-color: #dddddd;
      --weak-contrast-color: rgb(20, 20, 20);

      --inverted-foreground-color: #000000;
      --inverted-background-color: #aaaaaa;
    }
  }

  .world-ui {
    position: absolute;
    top: 1em;
    left: 1em;
    height: calc(100% - 2em);
    width: calc(100% - 2em);
    margin: 0;

    z-index: 1;
    pointer-events: none;

    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: space-between;

    font-family: sans-serif;
    color: var(--foreground-color);
  }

  p {
    margin: 0;
  }

  .world-ui > * {
    pointer-events: auto;
  }

  .toggle-group-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    border: 0.2rem solid var(--foreground-color);
    border-radius: 1em;
    padding: 0.5em;
    background-color: var(--weak-contrast-color);

    user-select: none;
  }

  .toggle-group-container > p {
    margin: 0;
    font-size: smaller;
  }

  .toggle-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0;
  }

  .toggle-group > input[type="radio"] {
    display: none;
  }

  .toggle-group > label {
    cursor: pointer;
    padding: 0.2em;
    border: 1px solid var(--foreground-color);
  }

  .toggle-group > input[type="radio"]:checked + label {
    color: var(--inverted-foreground-color);
    background-color: var(--inverted-background-color);
  }
</style>
