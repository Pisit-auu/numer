import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request) {
    const{point,xvalue,m,X,Y,Date,proublem} = await request.json()
    const existingPost = await prisma.simple.findUnique({
        where: {
            X, 
        },
    });

    if (existingPost) {
        const updatepost = await prisma.simple.update({
            where:{
                X,
            },
            data:{
                point,
                xvalue,
                m,
                X,
                Y,
                proublem,
                Date
            }
        })
        return Response.json(updatepost)
    }
    const newpost = await prisma.simple.create({
        data:{
            point,
            xvalue,
            m,
            X,
            Y,                
            proublem,
            Date
        }

    })
    return Response.json(newpost)
}

export async function  GET(request) {
    const simple = await prisma.simple.findMany()
    return Response.json(simple)
    
}