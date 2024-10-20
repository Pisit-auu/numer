import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request) {
    const{point,xvalue,m,X,Y} = await request.json()
    const newpost = await prisma.simple.create({
        data:{
            point,
            xvalue,
            m,
            X,
            Y
        }

    })
    return Response.json(newpost)
}

export async function  GET(request) {
    const simple = await prisma.simple.findMany()
    return Response.json(simple)
    
}