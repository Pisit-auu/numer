import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/diff/{id}:
 *   get:
 *     summary: Retrieve a specific differential equation by ID
 *     description: Fetches the details of a specific differential equation from the database using its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the differential equation to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested differential equation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the differential equation.
 *                 fx:
 *                   type: string
 *                 x:
 *                   type: number
 *                 h:
 *                   type: number
 *                 proublem:
 *                   type: string
 *                 Date:
 *                   type: string
 *                   format: date
 *       404:
 *         description: Differential equation not found.
 *       500:
 *         description: Internal server error.
 */
export async function GET(request, { params }) {
    const diffid = Number(params.id);
    const findequation = await prisma.diff.findUnique({
        where: { id: diffid }
    });
    return Response.json(findequation);
}

/**
 * @swagger
 * /api/diff/{id}:
 *   delete:
 *     summary: Delete a specific differential equation by ID
 *     description: Deletes a differential equation from the database using its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the differential equation to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The deleted differential equation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the deleted differential equation.
 *                 fx:
 *                   type: string
 *                 x:
 *                   type: number
 *                 h:
 *                   type: number
 *                 proublem:
 *                   type: string
 *                 Date:
 *                   type: string
 *                   format: date
 *       404:
 *         description: Differential equation not found.
 *       500:
 *         description: Internal server error.
 */
export async function DELETE(request, { params }) {
    const diffid = Number(params.id);
    const deletediff = await prisma.diff.delete({
        where: { id: diffid }
    });
    return Response.json(deletediff);
}
