import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export async function DELETE(request, { params }) {
    const rootId = Number(params.id)
    const deleteroot = await prisma.root.delete({
        where: {id: rootId}
    })
    return Response.json(deleteroot)
}

export async function GET(request, { params }){
    const rootId = Number(params.id)
    const findequation = await prisma.root.findUnique({
        where:{
            id: rootId
        }
    })
    return Response.json(findequation)
}   