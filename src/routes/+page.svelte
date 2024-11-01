<script lang="ts">
    import { onMount } from "svelte";
    import type { PageServerData } from "./$types";

    let { data }: { data: PageServerData } = $props();

    const users = data.users;

    let Application;
    let Sprite;
    let Texture;
    let Text, TextStyle;

    let app;

    onMount(async () => {
        Application = await import("pixi.js").then((m) => m.Application);
        Sprite = await import("pixi.js").then((m) => m.Sprite);
        Texture = await import("pixi.js").then((m) => m.Texture);
        Text = await import("pixi.js").then((m) => m.Text);
        TextStyle = await import("pixi.js").then((m) => m.TextStyle);

        app = new Application();
        await app.init({
            width: window.innerWidth,
            height: window.innerHeight,
            resolution: 1,
            backgroundColor: 0x10bb99,
        });

        const sprite = new Sprite(Texture.WHITE);
        sprite.tint = 0xff0000;
        sprite.width = sprite.height = 100;
        sprite.x = sprite.y = 100;

        const text = new Text({
            text: "PixiJS with SvelteKit!",
            style: new TextStyle({
                fontFamily: "Helvetica",
                fill: "#222",
                fontWeight: "600",
                fontSize: 48,
                stroke: { color: "#fff", width: 8, join: "round" },
            }),
        });
        text.position.set(150, 150);

        app.stage.addChild(sprite, text);

        document.getElementById("content-div")?.appendChild(app.canvas);
    });
</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

<!-- <div id="content-div" class="content"></div> -->
{#if users.length > 0}
    {#each users as user}
        <div>
            <span>Username</span>
            <span>{user.username}</span>
        </div>
    {/each}
{/if}

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
