<script lang="ts">
  import WorldView from "$lib/components/world-view.svelte";
  import type { PageServerData } from "./$types";

  // WARNING: the world will unserialize the data from JSON literals here so
  // object equality is not guranteed!
  let { data }: { data: PageServerData } = $props();
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<WorldView world={data.world} />

<!--
<style>
</style>
-->
