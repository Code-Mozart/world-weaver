<script lang="ts">
  import WorldView from "$lib/components/world-view.svelte";
  import type { PageServerData } from "./$types";

  let { data }: { data: PageServerData } = $props();
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<WorldView {data} />

<!--
<style>
</style>
-->
