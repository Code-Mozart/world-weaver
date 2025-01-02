import { loadWorldFromDatabase } from "$lib/orm/world-loader";
import type { World as APIWorld } from "$lib/types/api/world";
import { GroundType } from "$lib/types/ground-type";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const world = await loadWorldFromDatabase(params.id);
  addDemoObjects(world);
  return { world };
};

function addDemoObjects(world: APIWorld) {
  world.coastlines.push({
    id: getRandomDemoId(),
    polygonId: addDemoPolygon(world, [
      { x: 80, y: 40 },
      { x: 180, y: 40 },
      { x: 260, y: 100 },
      { x: 220, y: 160 },
      { x: 220, y: 220 },
      { x: 140, y: 240 },
      { x: 120, y: 160 },
      { x: 140, y: 100 },
      { x: 60, y: 80 },
    ]),
    groundType: GroundType.Water,
    name: "The lake",
  });
}

function addDemoPolygon(world: APIWorld, points: {x: number, y: number}[]): number {
  const id = getRandomDemoId();
  world.polygons.set(id, { id, pointIds: points.map(point => addDemoPoint(world, point.x, point.y)) })
  return id;
}

function addDemoPoint(world: APIWorld, x: number, y: number): number {
  const id = getRandomDemoId();
  world.points.set(id, { id, x, y });
  return id;
}

function getRandomDemoId(): number {
  return Math.random() * 0xFFFFFFFF;
}
