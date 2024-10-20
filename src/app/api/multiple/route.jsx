import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request) {
    const{point,xvalue,X,Y,xi} = await request.json()
    const newpost = await prisma.multiple.create({
        data:{
            point,
            xvalue,
            X,
            Y,
            xi
        }
    })
    return Response.json(newpost)
    
}
export async function GET(request) {
    const m = await prisma.multiple.findMany()
    return Response.json(m)
}