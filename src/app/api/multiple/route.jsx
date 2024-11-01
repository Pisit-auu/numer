import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request) {
    const{point,xvalue,X,Y,xi,Date,proublem} = await request.json()

    const existingPost = await prisma.multiple.findUnique({
        where: {
            X, 
        },
    });

    if (existingPost) {
        const updatepost = await prisma.multiple.update({
            where:{
                X,
            },
            data:{
                point,
                xvalue,
                X,
                Y,
                xi,
                proublem,
                Date
            }
        })
        return Response.json(updatepost)
    }
    const newpost = await prisma.multiple.create({
        data:{
            point,
            xvalue,
            X,
            Y,
            xi,
            proublem,
            Date
        }
    })
    return Response.json(newpost)
    
}
export async function GET(request) {
    const m = await prisma.multiple.findMany()
    return Response.json(m)
}