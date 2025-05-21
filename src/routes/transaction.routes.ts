import type { FastifyInstance } from "fastify";
import createTransaction from "../controllers/transactions/createTransaction.controller";
import { zodToJsonSchema } from "zod-to-json-schema";
import { createTransactionSchema } from "../schemas/transaction.schema";




const transactionRoutes = async (fastfy: FastifyInstance) => {
    fastfy.route({
        method: 'POST',
        url: '/',
        schema: {
            body: zodToJsonSchema(createTransactionSchema),
        },
        handler: createTransaction,
    });
};

export default transactionRoutes;