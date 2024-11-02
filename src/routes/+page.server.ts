import type { PageServerLoad } from './$types';
import type { Rectangle } from "$lib/types/rectangle"
import prisma from '$lib/prisma';

export const load: PageServerLoad = async () => {
    const rectangles: Rectangle[] = await prisma.rectangle.findMany();
    return {
        rectangles,
    };
};
