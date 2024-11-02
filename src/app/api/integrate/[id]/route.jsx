import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/integration/{id}:
 *   get:
 *     summary: Retrieve an integration entry by ID
 *     description: Fetches a single integration entry from the database using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the integration entry to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested integration entry.
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
 *       404:
 *         description: Integration entry not found.
 *       500:
 *         description: Internal server error.
 */
export async function GET(request, { params }) {
    const integrateid = Number(params.id);
    const findequation = await prisma.integration.findUnique({
        where: {
            id: integrateid,
        },
    });
    return Response.json(findequation);
}

/**
 * @swagger
 * /api/integration/{id}:
 *   delete:
 *     summary: Delete an integration entry by ID
 *     description: Deletes a specific integration entry from the database using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the integration entry to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The deleted integration entry.
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
 *       404:
 *         description: Integration entry not found.
 *       500:
 *         description: Internal server error.
 */
export async function DELETE(request, { params }) {
    const integrateid = Number(params.id);
    const deleteintegrateid = await prisma.integration.delete({
        where: { id: integrateid },
    });
    return Response.json(deleteintegrateid);
}
