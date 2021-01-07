const { PrismaClient } = require("@prisma/client");

(async () => {
    const client = new PrismaClient()
    const addCategory = (id, name) => client.category.upsert({
        create: {
            id,
            name
        },
        where: {
            id
        },
        update: {
            id,
            name
        }
    })
    await addCategory('moderation', '관리')
    console.log('done.')
    await client.$disconnect()
})()