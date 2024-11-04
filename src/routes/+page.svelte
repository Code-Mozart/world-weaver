<script lang="ts">
    import { onMount } from "svelte";
    import type { PageServerData } from "./$types";

    let { data }: { data: PageServerData } = $props();

    const nodes = data.nodes;

    onMount(async () => {
        const { Application, Sprite, Texture, Graphics } = await import(
            "pixi.js"
        );

        const app = new Application();
        await app.init({
            width: window.innerWidth,
            height: window.innerHeight,
            resolution: 1,
            backgroundColor: 0xaaaaaa,
        });

        const graphics = new Graphics();

        nodes.forEach((node) => {
            graphics.circle(node.x, node.y, 5);
            graphics.fill(0xcc5555);
            console.log(`drawing cirlce at ${node.x}, ${node.y}`);
        });

        app.stage.addChild(graphics);

        document.getElementById("content-div")?.appendChild(app.canvas);
    });
</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

<div id="content-div" class="content"></div>

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
    }
</style>
