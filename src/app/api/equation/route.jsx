

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request){
    const{name} = await request.json()
    const newPost = await prisma.Equation.create({
        data:{
            name,
        }
    })
    return Response.json(newPost)
} 

export async function GET() {
    const equation = await prisma.Equation.findMany()
    return Response.json(equation)
    
}

/*
export function GET(){
    return Response.json({
        message: 'test'
    })
}

export async function POST(request){
    const {name} = await request.json()
    return Response.json({
        data:{
            name
        }
    })
} 
    */ 