import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async () => {
    const nodes = await prisma.node.findMany();
    const nodesMap = nodes.reduce((map, node) => {
        const { x, y } = node;
        map.set(node.id, { x, y });
        return map;
    }, new Map<number, { x: number; y: number }>());

    const polygons = await prisma.polygon.findMany({
        include: {
            Nodes: true
        }
    });

    return {
        nodesMap,
        polygons
    };
};
