import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function POST(request){
    const {fx,x,h,proublem,Date}  = await request.json()
    const existingPost = await prisma.diff.findUnique({
        where: {
            fx, 
        },
    });

    if (existingPost) {
        const updatepost = await prisma.diff.update({
            where:{
                fx,
            },
            data:{
                x,
                h,
                proublem,
                Date
            }
        })
        return Response.json(updatepost)
    }
    const newpost = await prisma.diff.create({
        data:{
            fx,
            x,
            h,
            proublem,
            Date
        }
    })
    return Response.json(newpost)
}

export async function  GET(request) {
    const diff = await prisma.diff.findMany()
    return Response.json(diff)
}