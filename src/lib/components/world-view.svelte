<script lang="ts">
  import type { World } from "$lib/types/world";
  import { onMount } from "svelte";

  let { world }: { world: World } = $props();

  onMount(async () => {
    const { Application } = await import("pixi.js");
    const { WorldView } = await import("$lib/view/world-view");

    const app = new Application();
    await app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio,
      antialias: true,
      autoDensity: true,
    });

    const contentDiv = document.getElementById("content-div");
    if (contentDiv) {
      contentDiv.oncontextmenu = event => event.preventDefault();
      contentDiv.appendChild(app.canvas);

      const worldView = new WorldView(app, world, getComputedStyle(contentDiv));

      window.onresize = () => {
        worldView.resize(window.innerWidth, window.innerHeight);
        worldView.draw();
      };

      app.ticker.add(ticker => {
        worldView.update(ticker);
        worldView.draw();
      });
    }
  });
</script>

<div id="content-div" class="content world-view"></div>

<style>
  .content {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    margin: 0;
    z-index: 1;

    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex: auto;

    background: white;
  }

  @media (prefers-color-scheme: light) {
    .world-view {
      --primary-color: black;
    }

    .content {
      background: white;
    }
  }

  @media (prefers-color-scheme: dark) {
    .world-view {
      --primary-color: white;
    }

    .content {
      background: black;
    }
  }
</style>
