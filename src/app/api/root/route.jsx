
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request){
    const{name,proublem,xl,xr,Date} = await request.json()

    const existingPost = await prisma.root.findUnique({
        where: {
            name, 
        },
    });

    if (existingPost) {
        const updatepost = await prisma.root.update({
            where:{
                name,
            },
            data:{
                name,
                proublem,
                xl,
                xr,
                Date
            }
        })
        return Response.json(updatepost)
    }

    const newPost = await prisma.root.create({
        data:{
            name,
            proublem,
            xl,
            xr,
            Date
        }
    })
    return Response.json(newPost)
} 

export async function GET() {
    const root = await prisma.root.findMany()
    return Response.json(root)
    
}