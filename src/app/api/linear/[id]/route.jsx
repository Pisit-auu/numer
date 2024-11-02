import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/linear/{id}:
 *   get:
 *     summary: Retrieve a linear entry by ID
 *     description: Fetches a single linear entry from the database based on the provided ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the linear entry to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The linear entry object.
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
 *       404:
 *         description: Linear entry not found if the ID does not exist.
 */
export async function GET(request, { params }) {
    const linearId = Number(params.id);
    const findequation = await prisma.linear.findUnique({
        where: {
            id: linearId,
        },
    });
    return Response.json(findequation);
}

/**
 * @swagger
 * /api/linear/{id}:
 *   delete:
 *     summary: Delete a linear entry by ID
 *     description: Deletes a linear entry from the database based on the provided ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the linear entry to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The deleted linear entry object.
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
 *       404:
 *         description: Linear entry not found if the ID does not exist.
 */
export async function DELETE(request, { params }) {
    const linearId = Number(params.id);
    const deletelinear = await prisma.linear.delete({
        where: { id: linearId },
    });
    return Response.json(deletelinear);
}
