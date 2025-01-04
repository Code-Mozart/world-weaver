<script lang="ts">
  import "$lib/styles/info-text.css";

  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  onMount(async () => {
    const infoElement = document.getElementById("info");
    if (infoElement === null) {
      alert("Failed to load the page, please try reloading!");
      throw new Error("Failed to load the page, please try reloading!");
    }

    infoElement.innerText =
      "No local world found (loading worlds will be supported later). You will be redirected to the new world page.";

    const response = await fetch("/api/worlds", {
      method: "POST",
    });

    if (response.ok) {
      infoElement.innerText = "World created, redirecting...";
      const { worldCUID } = await response.json();

      try {
        goto(`/worlds/${worldCUID}`);
      } catch (error) {
        console.error(error);
      }
    }
  });
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<p id="info">This website requires scripts to be enabled! If you have them enabled, please reload the page.</p>
