import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/multiple:
 *   post:
 *     summary: Create or update a multiple entry
 *     description: Creates a new multiple entry or updates an existing one if it already exists.
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
 *               X:
 *                 type: object
 *               Y:
 *                 type: object
 *               xi:
 *                 type: object
 *               Date:
 *                 type: string
 *               proublem:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully created or updated the multiple entry.
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
 *                 X:
 *                   type: object
 *                 Y:
 *                   type: object
 *                 xi:
 *                   type: object
 *                 Date:
 *                   type: string
 *                 proublem:
 *                   type: string
 *       400:
 *         description: Bad request if the request body is invalid.
 */
export async function POST(request) {
    const { point, xvalue, X, Y, xi, Date, proublem } = await request.json();

    const existingPost = await prisma.multiple.findUnique({
        where: {
            X,
        },
    });

    if (existingPost) {
        const updatepost = await prisma.multiple.update({
            where: {
                X,
            },
            data: {
                point,
                xvalue,
                X,
                Y,
                xi,
                proublem,
                Date,
            },
        });
        return Response.json(updatepost);
    }
    
    const newpost = await prisma.multiple.create({
        data: {
            point,
            xvalue,
            X,
            Y,
            xi,
            proublem,
            Date,
        },
    });
    return Response.json(newpost);
}

/**
 * @swagger
 * /api/multiple:
 *   get:
 *     summary: Retrieve all multiple entries
 *     description: Retrieves a list of all multiple entries.
 *     responses:
 *       200:
 *         description: A list of multiple entries.
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
 *                   X:
 *                     type: object
 *                   Y:
 *                     type: object
 *                   xi:
 *                     type: object
 *                   Date:
 *                     type: string
 *                   proublem:
 *                     type: string
 */
export async function GET(request) {
    const m = await prisma.multiple.findMany();
    return Response.json(m);
}
