<script lang="ts">
  import type { World } from "$lib/types/world";
  import { StylesheetTheme } from "$lib/view/themes/stylesheet-theme";
  import { onMount } from "svelte";

  let { world }: { world: World } = $props();

  let worldView: {
    resize: (width: number, height: number) => void;
    update: (ticker: any) => void;
    draw: () => void;
    setNavigationControls: (value: "mouse" | "gesture") => void;
  };

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
      contentDiv.onwheel = event => event.preventDefault();
      contentDiv.appendChild(app.canvas);

      const theme = new StylesheetTheme(getComputedStyle(contentDiv));
      worldView = new WorldView(app, world, theme);

      window.onresize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        worldView.resize(window.innerWidth, window.innerHeight);
        worldView.draw();
      };

      app.ticker.add(ticker => {
        worldView.update(ticker);
        worldView.draw();
      });
    }
  });

  export function setNavigationControls(value: "mouse" | "gesture") {
    worldView.setNavigationControls(value);
  }
</script>

<div id="content-div" class="content world-view-theme"></div>

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

  .world-view-theme {
    --point-radius: 5;
    --coastline-outline-width: 1;
    --river-fill-color: var(--water-fill-color);
  }

  @media (prefers-color-scheme: light) {
    .world-view-theme {
      --land-fill-color: #cef3c3;
      --water-fill-color: #77a5da;
      --lava-fill-color: #ec925e;
      --void-fill-color: #988399;

      --coastline-outline-color: #111111;
    }

    .content {
      background: white;
    }
  }

  @media (prefers-color-scheme: dark) {
    .world-view-theme {
      --land-fill-color: #4b6643;
      --water-fill-color: #17559b;
      --lava-fill-color: #c05212;
      --void-fill-color: #58335a;

      --coastline-outline-color: #eeeeee;
    }

    .content {
      background: black;
    }
  }
</style>
