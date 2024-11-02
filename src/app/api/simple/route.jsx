import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/simple:
 *   post:
 *     summary: Create or update a simple entry
 *     description: Creates a new simple entry or updates an existing one based on the unique field `X`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               point:
 *                 type: integer
 *               xvalue:
 *                 type: integer
 *               m:
 *                 type: integer
 *               X:
 *                 type: object
 *               Y:
 *                 type: object
 *               Date:
 *                 type: string
 *               proublem:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully created or updated a simple entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 point:
 *                   type: integer
 *                 xvalue:
 *                   type: integer
 *                 m:
 *                   type: integer
 *                 X:
 *                   type: object
 *                 Y:
 *                   type: object
 *                 Date:
 *                   type: string
 *                 proublem:
 *                   type: string
 *       400:
 *         description: Bad request if the data is invalid.
 */
export async function POST(request) {
    const { point, xvalue, m, X, Y, Date, proublem } = await request.json();
    const existingPost = await prisma.simple.findUnique({
        where: {
            X,
        },
    });

    if (existingPost) {
        const updatepost = await prisma.simple.update({
            where: {
                X,
            },
            data: {
                point,
                xvalue,
                m,
                X,
                Y,
                proublem,
                Date,
            },
        });
        return Response.json(updatepost);
    }
    
    const newpost = await prisma.simple.create({
        data: {
            point,
            xvalue,
            m,
            X,
            Y,
            proublem,
            Date,
        },
    });
    return Response.json(newpost);
}

/**
 * @swagger
 * /api/simple:
 *   get:
 *     summary: Retrieve all simple entries
 *     description: Retrieves a list of all simple entries.
 *     responses:
 *       200:
 *         description: A list of simple entries.
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
 *                   xvalue:
 *                     type: integer
 *                   m:
 *                     type: integer
 *                   X:
 *                     type: object
 *                   Y:
 *                     type: object
 *                   Date:
 *                     type: string
 *                   proublem:
 *                     type: string
 */
export async function GET(request) {
    const simple = await prisma.simple.findMany();
    return Response.json(simple);
}
