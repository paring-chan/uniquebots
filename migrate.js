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
    await addCategory('music', '음악')
    await addCategory('translation', '번역')
    await addCategory('chat', '대화')
    await addCategory('search', '검색')
    await addCategory('game', '게임')
    await addCategory('util', '유틸')
    console.log('done.')
    await client.$disconnect()
})()