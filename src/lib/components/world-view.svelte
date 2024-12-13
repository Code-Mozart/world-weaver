<script lang="ts">
    import { onMount } from "svelte";

    let { data }: { data: any } = $props();

    onMount(async () => {
        const { Application } = await import("pixi.js");
        const { WorldDrawer } = await import("$lib/view/world-drawer");

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
            contentDiv.oncontextmenu = (event) => event.preventDefault();
            contentDiv.appendChild(app.canvas);

            const worldDrawer = new WorldDrawer(
                app,
                data,
                getComputedStyle(contentDiv),
            );
            worldDrawer.draw();

            app.ticker.add((ticker) => {
                worldDrawer.draw();
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
