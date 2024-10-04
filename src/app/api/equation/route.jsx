
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// POST method to add a new equation
export async function POST(request) {
  try {
    const { name } = await request.json();
    
    // Create new entry in the Equation table
    const newPost = await prisma.equation.create({
      data: {
        name,
      },
    });

    // Return the newly created equation as a response
    return new Response(JSON.stringify(newPost), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating equation:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// GET method to fetch all equations
export async function GET() {
  try {
    // Retrieve all equations from the database
    const equation = await prisma.equation.findMany();

    // Return the equations as a response
    return new Response(JSON.stringify(equation), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching equations:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


/*
export function GET(){
    return Response.json({
        message: 'test'
    })
}

export async function POST(request){
    const{name} = await request.json()
    return Response.json({
        data:{
            name
        }
    })
} 
    */ 