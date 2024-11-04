import type { PageServerLoad } from './$types';
import type { Rectangle } from "$lib/types/rectangle"
import prisma from '$lib/prisma';

export const load: PageServerLoad = async () => {
    const nodes = await prisma.node.findMany();
    return {
        nodes,
    };
};
