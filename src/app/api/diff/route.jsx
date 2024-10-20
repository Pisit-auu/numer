import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function POST(request){
    const {fx,x,h}  = await request.json()
    const newpost = await prisma.diff.create({
        data:{
            fx,
            x,
            h
        }
    })
    return Response.json(newpost)
}

export async function  GET(request) {
    const diff = await prisma.diff.findMany()
    return Response.json(diff)
}