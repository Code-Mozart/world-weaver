<script lang="ts">
  import type { EditorWorld } from "$lib/controllers/editor-world";
  import { preferences } from "$lib/store";
  import type { Mode } from "$lib/types/editor/mode";
  import { take_foo, type Foo } from "$assembly";

  let {
    world,
    mode,
    onNavigationControlsChanged,
  }: {
    world: EditorWorld;
    mode: Mode | undefined;
    onNavigationControlsChanged?: (value: "mouse" | "gesture") => void;
  } = $props();

  function handleNavigationControlSetting(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    setNavigationControls(value);
  }

  function setNavigationControls(value: any) {
    if (!["mouse", "gesture"].includes(value)) {
      throw new Error(`Invalid navigation control value: ${value}`);
    }
    const typesValue = value as "mouse" | "gesture";
    preferences.update(old => ({
      ...old,
      navigationControls: typesValue,
    }));
    onNavigationControlsChanged?.(typesValue);
  }

  let navigationControl = $preferences.navigationControls;
</script>

<div class="world-ui">
  <div class="top">
    <p>Editing world '{world.worldDocument.name}'</p>
    <p>Mode: {mode}</p>
  </div>
  <div class="bottom">
    <div class="toggle-group-container">
      <p>Navigation Controls</p>

      <div class="toggle-group" id="navigation-controls">
        <input
          type="radio"
          name="default"
          id="mouse-controls"
          value="mouse"
          oninput={handleNavigationControlSetting}
          checked={navigationControl === "mouse"}
        />
        <label for="mouse-controls">Mouse Controls</label>

        <input
          type="radio"
          name="default"
          id="gesture-controls"
          value="gesture"
          oninput={handleNavigationControlSetting}
          checked={navigationControl === "gesture"}
        />
        <label for="gesture-controls">Gesture Controls</label>
      </div>
    </div>
  </div>
</div>

<style>
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
  }

  p {
    text-align: start;
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
