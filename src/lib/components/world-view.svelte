<script lang="ts">
  import type { EditorWorld } from "$lib/controllers/editor-world";
  import type { CursorStyle } from "$lib/types/cursor-style";
  import type { SetMode } from "$lib/types/editor/mode";
  import { StylesheetTheme } from "$lib/view/themes/stylesheet-theme";
  import { onMount } from "svelte";

  let { world, onSetMode }: { world: EditorWorld; onSetMode?: SetMode } = $props();

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

      const onSetCursorIcon = (cursor: CursorStyle) => {
        contentDiv.style.cursor = cursor;
      };

      const theme = new StylesheetTheme(getComputedStyle(contentDiv));
      worldView = new WorldView(app, world, theme, onSetCursorIcon, onSetMode);

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
    worldView?.setNavigationControls(value);
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
    --point-selected-radius: 8;
    --coastline-outline-width: 1;
    --river-fill-color: var(--water-fill-color);

    --cursor-radius: 5;

    --selection-box-border-width: 2;
    --selection-box-border-color: var(--foreground-color);
    --selection-box-border-pattern: [2, 2];
    --selection-box-fill-color: rgba(var(--inverted-background-color), 0.3);
  }

  @media (prefers-color-scheme: light) {
    .world-view-theme {
      --land-fill-color: #cef3c3;
      --water-fill-color: #77a5da;
      --lava-fill-color: #ec925e;
      --void-fill-color: #988399;

      --coastline-outline-color: #111111;

      --point-selected-fill-color: #111111;

      --cursor-color: #444444;
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

      --point-selected-fill-color: #eeeeee;

      --cursor-color: #cccccc;
    }

    .content {
      background: black;
    }
  }
</style>
