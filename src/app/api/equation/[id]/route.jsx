import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/equation/{id}:
 *   delete:
 *     summary: Delete an equation
 *     description: Removes an equation entry from the database by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the equation to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The deleted equation entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the deleted equation.
 *       404:
 *         description: Equation not found.
 *       500:
 *         description: Internal server error.
 */
export async function DELETE(request, { params }) {
    const equationId = Number(params.id);
    const deleedequation = await prisma.equation.delete({
        where: { id: equationId }
    });
    return Response.json(deleedequation);
}
