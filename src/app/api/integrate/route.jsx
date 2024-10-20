import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request){
    const {fx,a,b,n} = await request.json()
    const newpost = await prisma.integration.create({
        data:{
            fx,
            a,
            b,
            n
        }
    })
    return Response.json(newpost)
}


export async function GET(request) {
    const integration = await prisma.integration.findMany()
    return Response.json(integration)
}