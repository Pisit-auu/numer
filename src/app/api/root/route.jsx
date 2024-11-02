
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
/**
 * @swagger
 * /api/root:
 *   post:
 *     summary: Post root
 *     description: Post root
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               proublem:
 *                 type: string
 *               xl:
 *                 type: number
 *               xr:
 *                 type: number
 *               Date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Calculation result.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 root:
 *                   type: number
 *                 iterations:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *   get:
 *     summary: Retrieve Bisection calculations
 *     description: Retrieves all Bisection calculations or a specific calculation by ID if provided.
 *     responses:
 *       200:
 *         description: A list of calculation or a single calculation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   proublem:
 *                     type: string
 *                   xl:
 *                     type: number
 *                   xr:
 *                     type: number
 *                   Date:
 *                     type: string
 */

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