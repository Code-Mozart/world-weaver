<script lang="ts">
  import "$lib/styles/info-text.css";

  import { loadWorldIntoPOJOs } from "$lib/api/mapping/world-loader";
  import WorldView from "$lib/components/world-view.svelte";
  import WorldUserInterface from "$lib/components/world-user-interface.svelte";
  import type { PageServerData } from "./$types";
  import type { Mode } from "$lib/types/editor/mode";
  import { onMount } from "svelte";
  import init from "$assembly";

  // WARNING: the world will unserialize the data from JSON literals here so
  // object equality is not guranteed!
  let { data }: { data: PageServerData } = $props();

  const editorWorld = loadWorldIntoPOJOs(data.cuid, data.world);

  let worldView = $state() as WorldView;

  let loadedResources = $state({ worldView: false, assembly: false });
  const isFullyLoaded = $state(function () {
    return Object.values(loadedResources).every(value => value);
  });

  let mode = $state<Mode | undefined>(undefined);

  onMount(async () => {
    await init();
    loadedResources.assembly = true;
  });
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<WorldView
  world={editorWorld}
  bind:this={worldView}
  onSetMode={value => (mode = value)}
  onFullyLoaded={() => (loadedResources.worldView = true)}
/>
{#if isFullyLoaded()}
  <WorldUserInterface
    world={editorWorld}
    {mode}
    onNavigationControlsChanged={value => worldView.setNavigationControls(value)}
  />
{:else}
  <p class="info">Loading world. This should only take a second...</p>
{/if}

<!--
<style>
</style>
-->
