import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request) {
    const{point,X,Y,x0} = await request.json()
    const newpost = await prisma.inter.create({
        data:{
            point,
            X,
            Y,
            x0
        }
    })
    return Response.json(newpost)
    
}

export async function GET(request){
    const iter = await prisma.inter.findMany()
    return Response.json(iter)
}