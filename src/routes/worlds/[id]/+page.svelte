<script lang="ts">
  import { loadWorldIntoPOJOs } from "$lib/api/mapping/world-loader";
  import WorldView from "$lib/components/world-view.svelte";
  import WorldUserInterface from "$lib/components/world-user-interface.svelte";
  import type { PageServerData } from "./$types";
  import type { Mode } from "$lib/types/editor/mode";

  // WARNING: the world will unserialize the data from JSON literals here so
  // object equality is not guranteed!
  let { data }: { data: PageServerData } = $props();

  const editorWorld = loadWorldIntoPOJOs(data.cuid, data.world);

  let worldView = $state() as WorldView;

  let mode = $state<Mode | undefined>(undefined);
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<WorldView world={editorWorld} bind:this={worldView} onSetMode={value => (mode = value)} />
<WorldUserInterface
  world={editorWorld}
  {mode}
  onNavigationControlsChanged={value => worldView.setNavigationControls(value)}
/>

<!--
<style>
</style>
-->
