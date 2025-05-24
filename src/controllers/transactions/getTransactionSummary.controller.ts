import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetTransactionsSummaryQuery } from "../../schemas/transaction.schema";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import prisma from "../../config/prisma";
import { CategorySummary } from "../../types/category.types";
import { TransactionType } from "@prisma/client";
import { TransactionSummary } from "../../types/transaction.types";

dayjs.extend(utc);

export const getTransactionsSummary = async (
    request: FastifyRequest<{ Querystring: GetTransactionsSummaryQuery }>,
    reply: FastifyReply,
): Promise<void> => {
    const userId = "FEDERGEAFAF"//userId => request.userId;

    if (!userId) {
        reply.status(401).send({ error: "Usuário não autenticado" });
        return;
    }
    //desestruturação de dados
    const { month, year } = request.query;
    
    if (!month || !year) {
        reply.status(400).send({ error: "Mês e ano são obrigatórios" });
        return;
    };

            //alinhado com o banco de dados com utc
            //dia 1 do mes e do ano (`${year}-${month}-01`)
            const startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate();
            // do primeiro dia ao ultimo dia do mes seria o range
            const endDate = dayjs.utc(startDate).endOf("month").toDate();

    try {
        //estou indo la no banco de dados com meus filters selecionando me traga...
        //findMany => traz todos os registros que satisfazem a condição where
        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                }
            },
            include: {
                category: true,
            },
        });

        let totalExpenses = 0;
        let totalIncomes = 0;
        const groupedExpenses = new Map<string, CategorySummary>();

        for (const transaction of transactions) {
                    
            if (transaction.type === TransactionType.expense) {
                        
                const existing = groupedExpenses.get(transaction.categoryId) ?? {
                    categoryId: transaction.categoryId,
                    categoryName: transaction.category.name,
                    categoryColor: transaction.category.color,
                    amount: 0,
                    percentage: 0,
                };

                existing.amount += transaction.amount
                groupedExpenses.set(transaction.categoryId, existing)

                // groupedExpenses { alimentacao: { amount: 2300 }, transportes: { amount: 1200 } ... }

                totalExpenses += transaction.amount;
            } else {
                totalIncomes += transaction.amount;
            }
        }

        console.log(Array.from(groupedExpenses.values()));

        const summary: TransactionSummary = {
            totalExpenses,
            totalIncomes,
            balance: totalIncomes - totalExpenses,
            expensesByCategory: Array.from(groupedExpenses.values()).map((entry) => ({
                ...entry,
                percentage: Number.parseFloat(((entry.amount / totalExpenses) * 100).toFixed(2)),
            })).sort((a, b) => b.amount - a.amount),
        };

            //console.log({groupedExpenses, totalIncomes, totalExpenses});
            reply.send(summary);
        } catch (err) {
            request.log.error("Erro ao trazer transacoes", err);
            reply.status(500).send({ error: "Erro do servidor" });
        }
    
    };