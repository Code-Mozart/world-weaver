<script lang="ts">
    import { onMount } from "svelte";
    import type { PageServerData } from "./$types";

    let { data }: { data: PageServerData } = $props();

    const rectangles = data.rectangles;

    onMount(async () => {
        const { Application, Sprite, Texture } = await import("pixi.js");

        const app = new Application();
        await app.init({
            width: window.innerWidth,
            height: window.innerHeight,
            resolution: 1,
            backgroundColor: 0xaaaaaa,
        });

        rectangles.forEach((rectangleData) => {
            const rectangle = new Sprite(Texture.WHITE);
            rectangle.tint = 0xcc5555;
            rectangle.x = rectangleData.x;
            rectangle.y = rectangleData.y;
            rectangle.width = rectangleData.width;
            rectangle.height = rectangleData.height;
            app.stage.addChild(rectangle);
        });

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
