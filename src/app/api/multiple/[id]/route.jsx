import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/multiple/{id}:
 *   get:
 *     summary: Retrieve a multiple entry by ID
 *     description: Retrieves a specific multiple entry based on the provided ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the multiple entry to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The multiple entry object.
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
 *       404:
 *         description: Not found if no multiple entry exists with the specified ID.
 */
export async function GET(request, { params }) {
    const multipleid = Number(params.id);
    const findequation = await prisma.multiple.findUnique({
        where: {
            id: multipleid,
        },
    });
    return Response.json(findequation);
}

/**
 * @swagger
 * /api/multiple/{id}:
 *   delete:
 *     summary: Delete a multiple entry by ID
 *     description: Deletes a specific multiple entry based on the provided ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the multiple entry to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The deleted multiple entry object.
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
 *       404:
 *         description: Not found if no multiple entry exists with the specified ID.
 */
export async function DELETE(request, { params }) {
    const multipleid = Number(params.id);
    const deletemultiple = await prisma.multiple.delete({
        where: {
            id: multipleid,
        },
    });
    return Response.json(deletemultiple);
}
