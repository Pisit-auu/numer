import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/integration:
 *   post:
 *     summary: Create or update an integration entry
 *     description: Creates a new integration entry or updates an existing one based on the provided function (fx).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fx:
 *                 type: string
 *                 description: The function to be integrated.
 *               a:
 *                 type: number
 *                 description: The lower limit of integration.
 *               b:
 *                 type: number
 *                 description: The upper limit of integration.
 *               n:
 *                 type: integer
 *                 description: The number of subintervals for numerical integration.
 *               proublem:
 *                 type: string
 *                 description: Description or name of the integration problem.
 *               Date:
 *                 type: string
 *                 format: date
 *                 description: The date associated with the integration entry.
 *     responses:
 *       200:
 *         description: The created or updated integration entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 fx:
 *                   type: string
 *                 a:
 *                   type: number
 *                 b:
 *                   type: number
 *                 n:
 *                   type: integer
 *                 proublem:
 *                   type: string
 *                 Date:
 *                   type: string
 *       400:
 *         description: Invalid input data.
 */
export async function POST(request) {
    const { fx, a, b, n, proublem, Date } = await request.json();
    const existingPost = await prisma.integration.findUnique({
        where: {
            fx,
        },
    });

    if (existingPost) {
        const updatepost = await prisma.integration.update({
            where: {
                fx,
            },
            data: {
                a,
                b,
                n,
                proublem,
                Date,
            },
        });
        return Response.json(updatepost);
    }
    const newpost = await prisma.integration.create({
        data: {
            fx,
            a,
            b,
            n,
            proublem,
            Date,
        },
    });
    return Response.json(newpost);
}

/**
 * @swagger
 * /api/integration:
 *   get:
 *     summary: Retrieve all integration entries
 *     description: Fetches all integration entries from the database.
 *     responses:
 *       200:
 *         description: A list of integration entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   fx:
 *                     type: string
 *                   a:
 *                     type: number
 *                   b:
 *                     type: number
 *                   n:
 *                     type: integer
 *                   proublem:
 *                     type: string
 *                   Date:
 *                     type: string
 *       500:
 *         description: Internal server error.
 */
export async function GET(request) {
    const integration = await prisma.integration.findMany();
    return Response.json(integration);
}
