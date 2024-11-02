import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/inter:
 *   post:
 *     summary: Create or update an intersection entry
 *     description: Creates a new intersection entry or updates an existing one based on the unique field 'X'.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               point:
 *                 type: integer
 *               X:
 *                 type: object
 *               Y:
 *                 type: object
 *               x0:
 *                 type: object
 *               Date:
 *                 type: string
 *               proublem:
 *                 type: string
 *     responses:
 *       200:
 *         description: The created or updated intersection entry object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 point:
 *                   type: integer
 *                 X:
 *                   type: object
 *                 Y:
 *                   type: object
 *                 x0:
 *                   type: object
 *                 Date:
 *                   type: string
 *                 proublem:
 *                   type: string
 *       400:
 *         description: Invalid input data.
 */
export async function POST(request) {
    const { point, X, Y, x0, Date, proublem } = await request.json();
    const existingPost = await prisma.inter.findUnique({
        where: {
            X,
        },
    });

    if (existingPost) {
        const updatepost = await prisma.inter.update({
            where: {
                X,
            },
            data: {
                X,
                Y,
                point,
                x0,
                proublem,
                Date,
            },
        });
        return Response.json(updatepost);
    }

    const newpost = await prisma.inter.create({
        data: {
            point,
            X,
            Y,
            x0,
            proublem,
            Date,
        },
    });
    return Response.json(newpost);
}

/**
 * @swagger
 * /api/inter:
 *   get:
 *     summary: Retrieve all intersection entries
 *     description: Fetches all intersection entries from the database.
 *     responses:
 *       200:
 *         description: A list of intersection entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   point:
 *                     type: integer
 *                   X:
 *                     type: object
 *                   Y:
 *                     type: object
 *                   x0:
 *                     type: object
 *                   Date:
 *                     type: string
 *                   proublem:
 *                     type: string
 */
export async function GET(request) {
    const iter = await prisma.inter.findMany();
    return Response.json(iter);
}
