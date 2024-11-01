import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request) {
    const{point,X,Y,x0,Date,proublem} = await request.json()
    const existingPost = await prisma.inter.findUnique({
        where: {
            X, 
        },
    });

    if (existingPost) {
        const updatepost = await prisma.inter.update({
            where:{
                X,
            },
            data:{
                X,
                Y,
                point,
                x0,
                proublem,
                Date
            }
        })
        return Response.json(updatepost)
    }
    const newpost = await prisma.inter.create({
        data:{
            point,
            X,
            Y,
            x0,
            proublem,
            Date
        }
    })
    return Response.json(newpost)
    
}

export async function GET(request){
    const iter = await prisma.inter.findMany()
    return Response.json(iter)
}