<script lang="ts">
    import { onMount } from "svelte";
    import type { PageServerData } from "./$types";

    let { data }: { data: PageServerData } = $props();

    const nodesMap = data.nodesMap;
    const polygons = data.polygons;

    onMount(async () => {
        const { Application, Graphics } = await import("pixi.js");
        const { Viewport } = await import("pixi-viewport");

        const app = new Application();
        await app.init({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0xdddddd,
            resolution: window.devicePixelRatio,
            antialias: true,
            autoDensity: true,
        });

        const viewport = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: 1000,
            worldHeight: 1000,

            events: app.renderer.events,
        });
        viewport.options.disableOnContextMenu = true;
        app.stage.addChild(viewport);

        viewport.drag({ mouseButtons: "right" }).pinch().wheel().decelerate();
        viewport.moveCenter(0, 0);

        const graphics = new Graphics();

        nodesMap.forEach((node) => {
            graphics.circle(node.x, node.y, 5);
            graphics.fill(0x111111);
        });

        polygons.forEach((polygon) => {
            graphics.setStrokeStyle({ width: 2, color: 0x111111 });
            polygon.Nodes.forEach((polygonNode) => {
                if (polygonNode.nextNodeId === null) {
                    return;
                }

                const node = nodesMap.get(polygonNode.nodeId);
                const nextNode = nodesMap.get(polygonNode.nextNodeId);

                if (node === undefined || nextNode === undefined) {
                    return;
                }

                graphics.moveTo(node.x, node.y);
                graphics.lineTo(nextNode.x, nextNode.y);
                graphics.stroke();
            });
        });

        viewport.addChild(graphics);

        const contentDiv = document.getElementById("content-div");
        if (contentDiv) {
            contentDiv.oncontextmenu = (event) => event.preventDefault();
            contentDiv.appendChild(app.canvas);
        }
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
