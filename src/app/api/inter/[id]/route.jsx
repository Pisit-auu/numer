import {PrismaClient} from "@prisma/client"
const prisma = new PrismaClient()

export async function GET(request,{params}) {
    const iterId = Number(params.id)
    const findequation = await prisma.inter.findUnique({
        where:{
            id:iterId
        }
    })
    return Response.json(findequation)
}

export async function DELETE(request,{params}) {
    const interId = Number(params.id)
    const deleteinter = await prisma.inter.delete({
        where:{id:interId}
    })
    return Response.json(deleteinter)
    
}