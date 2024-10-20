import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request) {
    const{size,A,B,x0} = await request.json()
    const newpost = await prisma.linear.create({
        data:{
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