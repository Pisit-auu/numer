
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
 //ตัวแทนพูดคุยไปยัง database

export async function POST(request){
    const{name} = await request.json()
    const newPost = await prisma.root.create({
        data:{
            name,
            xl,
            xr
        }
    })
    return Response.json(newPost)
} 

export async function GET() {
    const root = await prisma.root.findMany()
    return Response.json(root)
    
}