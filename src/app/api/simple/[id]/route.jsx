import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/simple/{id}:
 *   get:
 *     summary: Retrieve a simple entry by ID
 *     description: Retrieves a single simple entry identified by the specified ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the simple entry to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A simple entry object.
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
 *                 m:
 *                   type: integer
 *                 X:
 *                   type: object
 *                 Y:
 *                   type: object
 *                 Date:
 *                   type: string
 *                 proublem:
 *                   type: string
 *       404:
 *         description: Not found if no entry exists with the specified ID.
 */
export async function GET(request, { params }) {
    const simpleid = Number(params.id);
    const findequation = await prisma.simple.findUnique({
        where: {
            id: simpleid,
        },
    });

    if (!findequation) {
        return new Response("Not Found", { status: 404 });
    }

    return Response.json(findequation);
}

/**
 * @swagger
 * /api/simple/{id}:
 *   delete:
 *     summary: Delete a simple entry by ID
 *     description: Deletes a simple entry identified by the specified ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the simple entry to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted the simple entry.
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
 *                 m:
 *                   type: integer
 *                 X:
 *                   type: object
 *                 Y:
 *                   type: object
 *                 Date:
 *                   type: string
 *                 proublem:
 *                   type: string
 *       404:
 *         description: Not found if no entry exists with the specified ID.
 */
export async function DELETE(request, { params }) {
    const simpleid = Number(params.id);
    const deletesimple = await prisma.simple.delete({
        where: { id: simpleid },
    });

    return Response.json(deletesimple);
}
