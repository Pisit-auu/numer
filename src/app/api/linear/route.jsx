import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/linear:
 *   post:
 *     summary: Create or update a linear entry
 *     description: Creates a new linear entry or updates an existing one based on the provided A value.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proublem:
 *                 type: string
 *               size:
 *                 type: integer
 *               A:
 *                 type: object
 *               B:
 *                 type: object
 *               x0:
 *                 type: object
 *               Date:
 *                 type: string
 *     responses:
 *       200:
 *         description: The created or updated linear entry object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 proublem:
 *                   type: string
 *                 size:
 *                   type: integer
 *                 A:
 *                   type: object
 *                 B:
 *                   type: object
 *                 x0:
 *                   type: object
 *                 Date:
 *                   type: string
 *       400:
 *         description: Bad request if the input data is invalid.
 */
export async function POST(request) {
    const { proublem, size, A, B, x0, Date } = await request.json();
    const existingPost = await prisma.linear.findUnique({
        where: {
            A,
        },
    });

    if (existingPost) {
        const updatepost = await prisma.linear.update({
            where: {
                A,
            },
            data: {
                proublem,
                size,
                A,
                B,
                x0,
                Date,
            },
        });
        return Response.json(updatepost);
    }
    const newpost = await prisma.linear.create({
        data: {
            proublem,
            size,
            A,
            B,
            x0,
            Date,
        },
    });
    return Response.json(newpost);
}

/**
 * @swagger
 * /api/linear:
 *   get:
 *     summary: Retrieve all linear entries
 *     description: Retrieves a list of all linear entries in the database.
 *     responses:
 *       200:
 *         description: A list of linear entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   proublem:
 *                     type: string
 *                   size:
 *                     type: integer
 *                   A:
 *                     type: object
 *                   B:
 *                     type: object
 *                   x0:
 *                     type: object
 *                   Date:
 *                     type: string
 */
export async function GET(request) {
    const linear = await prisma.linear.findMany();
    return Response.json(linear);
}
