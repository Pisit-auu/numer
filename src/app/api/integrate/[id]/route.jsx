import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request,{params}){
    const integrateid = Number(params.id)
    const findequation = await prisma.simple.findUnique({
        where:{
            id:integrateid
        }
    })
    return Response.json(findequation)
}

export async function DELETE(request,{params}){
    const integrateid = Number(params.id)
    const deleteintegrateid = await prisma.integration.delete({
        where:{id:integrateid}
    })
    return Response.json(deleteintegrateid)
}