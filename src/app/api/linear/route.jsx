import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
    const{proublem,size,A,B,x0,Date} = await request.json()
    const existingPost = await prisma.linear.findUnique({
        where: {
            A, 
        },
    });

    if (existingPost) {
        const updatepost = await prisma.linear.update({
            where:{
                A,
            },
            data:{
                proublem,
                size,
                A,
                B,
                x0,
                Date
            }
        })
        return Response.json(updatepost)
    }
    const newpost = await prisma.linear.create({
        data:{
            proublem,
            size,
            A,
            B,
            x0
        }
    })
    return Response.json(newpost)
}

export async function GET(request) {
    const linear = await prisma.linear.findMany()
    return Response.json(linear)
}