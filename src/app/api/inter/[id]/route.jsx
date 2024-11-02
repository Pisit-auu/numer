import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/inter/{id}:
 *   get:
 *     summary: Retrieve an intersection entry by ID
 *     description: Fetches an intersection entry from the database using the unique identifier (ID).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the intersection entry to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The intersection entry object.
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
 *       404:
 *         description: Intersection entry not found.
 */
export async function GET(request, { params }) {
    const iterId = Number(params.id);
    const findequation = await prisma.inter.findUnique({
        where: {
            id: iterId,
        },
    });
    return Response.json(findequation);
}

/**
 * @swagger
 * /api/inter/{id}:
 *   delete:
 *     summary: Delete an intersection entry by ID
 *     description: Deletes an intersection entry from the database using the unique identifier (ID).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the intersection entry to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The deleted intersection entry object.
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
 *       404:
 *         description: Intersection entry not found.
 */
export async function DELETE(request, { params }) {
    const interId = Number(params.id);
    const deleteinter = await prisma.inter.delete({
        where: { id: interId },
    });
    return Response.json(deleteinter);
}
