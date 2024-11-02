import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/equation:
 *   post:
 *     summary: Create a new equation
 *     description: Adds a new equation entry to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the equation.
 *                 example: "E = mc^2"
 *     responses:
 *       200:
 *         description: The created equation entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       500:
 *         description: Internal server error.
 */
export async function POST(request) {
    const { name } = await request.json();
    const newPost = await prisma.Equation.create({
        data: {
            name,
        },
    });
    return Response.json(newPost);
}

/**
 * @swagger
 * /api/equation:
 *   get:
 *     summary: Retrieve all equations
 *     description: Fetches all equation entries from the database.
 *     responses:
 *       200:
 *         description: A list of all equation entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       500:
 *         description: Internal server error.
 */
export async function GET() {
    const equation = await prisma.Equation.findMany();
    return Response.json(equation);
}
