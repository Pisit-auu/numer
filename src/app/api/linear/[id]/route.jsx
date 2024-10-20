import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export async function GET(request,{params}) {
    const linearId = Number(params.id)
    const findequation = await prisma.linear.findUnique({
        where:{
            id:linearId
        }
    })
    return Response.json(findequation)
}

export async function DELETE(request,{params}){
    const linearId = Number(params.id)
    const deletelinear =  await prisma.linear.delete({
        where:{id:linearId}
    })
    return Response.json(deletelinear)
}