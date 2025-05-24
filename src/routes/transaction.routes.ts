import type { FastifyInstance } from "fastify";
import createTransaction from "../controllers/transactions/createTransaction.controller";
import { zodToJsonSchema } from "zod-to-json-schema";
import { createTransactionSchema, getTransactionsSchema, getTransactionsSummarySchema } from "../schemas/transaction.schema";
import { getTransactions } from "../controllers/transactions/getTransactions.controller";
import { getTransactionsSummary } from "../controllers/transactions/getTransactionSummary.controller";




const transactionRoutes = async (fastify: FastifyInstance) => {
    // Criação
    fastify.route({
        method: 'POST',
        url: '/',
        schema: {
            body: zodToJsonSchema(createTransactionSchema),
        },
        //manipulador handler por controler criando transação
        handler: createTransaction,
    });

    // Buscar com Filtros
    //fastify.route({method: 'GET', url: '/', schema:  {querystring: zodToJsonSchema(getTransactionsSchema)}, handler: getTransactions,});
    
    fastify.route({
        method: 'GET',
        url: '/',
        schema: {
            querystring: zodToJsonSchema(getTransactionsSchema)
        },
        //manipulador handler por controler trazendo transações	
        handler: getTransactions,
    });

    // Buscar resumo summary da tela de graficos
    fastify.route({
        method: 'GET',
        url: '/summary',
        schema: {
            querystring: zodToJsonSchema(getTransactionsSummarySchema),
        },
        //manipulador handler por controler trazendo dados
        handler: getTransactionsSummary,
    });
}

export default transactionRoutes;
