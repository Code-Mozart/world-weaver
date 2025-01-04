<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

{@render children()}

<style>
  @media (prefers-color-scheme: light) {
    :global(body) {
      --background-color: #ffffff;
      --foreground-color: #111111;
      --weak-contrast-color: #ececec;

      --inverted-foreground-color: #ffffff;
      --inverted-background-color: #111111;
    }
  }

  @media (prefers-color-scheme: dark) {
    :global(body) {
      --background-color: #111111;
      --foreground-color: #dddddd;
      --weak-contrast-color: #141414;

      --inverted-foreground-color: #000000;
      --inverted-background-color: #aaaaaa;
    }
  }

  :global(body) {
    font-family: sans-serif;
    background-color: var(--background-color);
  }

  :global(p, h1, h2, h3, h4, h5, h6, label) {
    color: var(--foreground-color);
  }
</style>
