// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import seedData from "../src/lib/data.json" assert { type: "json" }

const prisma = new PrismaClient()

async function main() {
    console.log(`Start seeding ...`)

    for (const rectangleData of seedData.rectangles) {
        const rectangle = await prisma.rectangle.create({
            data: {
                x: rectangleData.x,
                y: rectangleData.y,
                width: rectangleData.width,
                height: rectangleData.height
            }
        })
        console.log(`Created rectangle with id: ${rectangle.uuid}`)
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