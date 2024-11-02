import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/root/{id}:
 *   delete:
 *     summary: Delete a root entry
 *     description: Deletes a root entry by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the root entry to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted the root entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 message:
 *                   type: string
 *       404:
 *         description: Root entry not found.
 */
export async function DELETE(request, { params }) {
    const rootId = Number(params.id);
    const deleteroot = await prisma.root.delete({
        where: { id: rootId }
    });
    return Response.json(deleteroot);
}

/**
 * @swagger
 * /api/root/{id}:
 *   get:
 *     summary: Retrieve a root entry
 *     description: Retrieves a root entry by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the root entry to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved the root entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 problem:
 *                   type: string
 *                 xl:
 *                   type: number
 *                 xr:
 *                   type: number
 *                 Date:
 *                   type: string
 *       404:
 *         description: Root entry not found.
 */
export async function GET(request, { params }) {
    const rootId = Number(params.id);
    const findequation = await prisma.root.findUnique({
        where: {
            id: rootId
        }
    });
    return Response.json(findequation);
}
