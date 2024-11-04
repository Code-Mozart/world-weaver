// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import seedData from "../src/lib/data.json" assert { type: "json" }

const prisma = new PrismaClient()

async function main() {
    console.log(`Start seeding ...`)

    for (const node of seedData.nodes) {
        if (await prisma.node.findFirst({ where: { id: node.id } }) === null) {
            await prisma.node.create({ data: node });
            console.log(`created node ${node.id}`);
        }
        else {
            await prisma.node.update({ where: { id: node.id }, data: node });
            console.log(`updated node ${node.id}`);
        }
    }

    for (const polygon of seedData.polygons) {
        if (await prisma.polygon.findFirst({ where: { id: polygon.id } }) === null) {
            await prisma.polygon.create({ data: polygon });
            console.log(`created polygon ${polygon.id}`);
        }
        else {
            await prisma.polygon.update({ where: { id: polygon.id }, data: polygon });
            console.log(`updated polygon ${polygon.id}`);
        }
    }

    for (const nodesOnPolygon of seedData.nodesOnPolygons) {
        const compoundKey = {
            nodeId: nodesOnPolygon.nodeId,
            polygonId: nodesOnPolygon.polygonId,
        }

        if (await prisma.nodesOnPolygons.findFirst({ where: compoundKey }) === null) {
            await prisma.nodesOnPolygons.create({ data: nodesOnPolygon });
            console.log(`added node ${nodesOnPolygon.nodeId} to polygon ${nodesOnPolygon.polygonId}`)
        }
        else {
            await prisma.nodesOnPolygons.update({ where: { nodeId_polygonId: compoundKey }, data: nodesOnPolygon });
            console.log(`updated node ${nodesOnPolygon.nodeId} on polygon ${nodesOnPolygon.polygonId}`)
        }
    }

    console.log(`Seeding finished.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })