import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'john.doe3@gmail.com',
            avatarUrl: 'https://github.com/wred-X.png',
        }
    })

    const bet = await prisma.bet.create({
        data: {
            title: 'example bet',
            code: 'bet111',
            ownerId: user.id,
            participants: {
                create: {
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-10-02T12:00:00.201Z',
            firstCountryCode: 'DE',
            secondCountryCode: 'BR',
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-10-01T12:00:00.201Z',
            firstCountryCode: 'BR',
            secondCountryCode: 'AR',
        
            guesses: {
                create: {
                    firstTpoints: 2,
                    secondTpoints: 1,

                    participant: {
                         connect: {
                            userId_betId: {
                                userId: user.id,
                                betId: bet.id
                            }
                         }
                    }
                }
            }
        }
    })
}

main()