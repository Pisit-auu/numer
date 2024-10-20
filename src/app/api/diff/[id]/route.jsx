import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient

export async function  GET(request,{params}) {
    const diffid = Number(params.id)
    const findequation = await prisma.diff.findUnique({
        where:{
            id:diffid
        }
    })
    return Response.json(findequation)
    
}

export async function DELETE(request,{params}){
    const diffid = Number(params.id)
    const deletediff = await prisma.diff.delete({
        where:{id:diffid}
    })
    return Response.json(deletediff)
}