import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request){
    const {fx,a,b,n,proublem,Date} = await request.json()
    const existingPost = await prisma.integration.findUnique({
        where: {
            fx, 
        },
    });

    if (existingPost) {
        const updatepost = await prisma.integration.update({
            where:{
                fx,
            },
            data:{
                a,
                b,
                n,
                proublem,
                Date
            }
        })
        return Response.json(updatepost)
    }
    const newpost = await prisma.integration.create({
        data:{
            fx,
            a,
            b,
            n,                
            proublem,
            Date
        }
    })
    return Response.json(newpost)
}


export async function GET(request) {
    const integration = await prisma.integration.findMany()
    return Response.json(integration)
}