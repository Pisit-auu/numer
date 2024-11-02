import { PrismaClient } from "@prisma/client";
import cors, { runMiddleware } from '../cors'; 
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/diff:
 *   post:
 *     summary: Create or update a differential equation
 *     description: Creates a new differential equation or updates an existing one if it already exists.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fx:
 *                 type: string
 *                 description: The function representing the differential equation.
 *               x:
 *                 type: number
 *                 description: The x value in the differential equation.
 *               h:
 *                 type: number
 *                 description: The step size.
 *               proublem:
 *                 type: string
 *                 description: Description of the problem.
 *               Date:
 *                 type: string
 *                 format: date
 *                 description: The date associated with the equation.
 *     responses:
 *       200:
 *         description: The created or updated differential equation entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the differential equation.
 *                 fx:
 *                   type: string
 *                 x:
 *                   type: number
 *                 h:
 *                   type: number
 *                 proublem:
 *                   type: string
 *                 Date:
 *                   type: string
 *                   format: date
 *       500:
 *         description: Internal server error.
 */
// export async function POST(request) {
//     const { fx, x, h, proublem, Date } = await request.json();
//     const existingPost = await prisma.diff.findUnique({
//         where: { fx },
//     });

//     if (existingPost) {
//         const updatepost = await prisma.diff.update({
//             where: { fx },
//             data: { x, h, proublem, Date }
//         });
//         return Response.json(updatepost);
//     }
//     const newpost = await prisma.diff.create({
//         data: { fx, x, h, proublem, Date }
//     });
//     return Response.json(newpost);
// }
export async function POST(request, res) {
    await runMiddleware(request, res, cors);
    
    const { fx, x, h, proublem, Date } = await request.json();
    const existingPost = await prisma.diff.findUnique({
        where: {
            fx,
        },
    });

    if (existingPost) {
        const updatepost = await prisma.diff.update({
            where: {
                fx,
            },
            data: {
                x,
                h,
                proublem,
                Date
            }
        });
        return Response.json(updatepost);
    }

    const newpost = await prisma.diff.create({
        data: {
            fx,
            x,
            h,
            proublem,
            Date
        }
    });
    return Response.json(newpost);
}
/**
 * @swagger
 * /api/diff:
 *   get:
 *     summary: Retrieve all differential equations
 *     description: Fetches all entries of differential equations from the database.
 *     responses:
 *       200:
 *         description: A list of differential equations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the differential equation.
 *                   fx:
 *                     type: string
 *                   x:
 *                     type: number
 *                   h:
 *                     type: number
 *                   proublem:
 *                     type: string
 *                   Date:
 *                     type: string
 *                     format: date
 *       500:
 *         description: Internal server error.
 */
export async function GET(request) {
    const diff = await prisma.diff.findMany();
    return Response.json(diff);
}
