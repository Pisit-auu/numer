import {PrismaClient, prismaClient} from "@prisma/client"
const prisma = new PrismaClient();
export async function GET(request, {params}) {
    const multipleid = Number(params.id)
    const findequation = await prisma.multiple.findUnique({
        where:{
            id:multipleid
        }
    })
    return Response.json(findequation)
}

export async function DELETE(request, {params}) {
    const multipleid = Number(params.id)
    const deletemultiple = await prisma.multiple.delete({
        where:{
            id:multipleid
        }
    })
    return Response.json(deletemultiple)
    
}