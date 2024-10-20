import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request,{params}) {
    const simpleid = Number(params.id)
    const findequation = await prisma.simple.findUnique({
        where:{
            id:simpleid
        }
    })

    return Response.json(findequation)
    
}

export async function  DELETE(request,{params}) {
    const simpleid = Number(params.id)
    const deletesimple = await prisma.simple.delete({
        where:{id:simpleid}
    })
    return Response.json(deletesimple)
}