import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export async function DELETE(request, { params }) {
    const equationId = Number(params.id)
    const deleedequation = await prisma.equation.delete({
        where: {id: equationId}
    })
    return Response.json(deleedequation)
}