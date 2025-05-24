
import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetTransactionsQuery } from "../../schemas/transaction.schema";
import type { TransactionFilter } from "../../types/transaction.types";
import dayjs from "dayjs";
//biblioteca js utc colocando sincronismo na data para nao ficar com -3h de brazil 
import utc from "dayjs/plugin/utc";
import prisma from "../../config/prisma";

//conforme a documentação de dayjs para utilizar o sincronismo utc para ficar alinhado com o banco de dados
dayjs.extend(utc);

export const getTransactions = async (
    request: FastifyRequest<{ Querystring: GetTransactionsQuery }>,
    reply: FastifyReply,
    ): Promise<void> => {
    const userId = "FEDERGEAFAF"; //userId => request.uerId

    if (!userId) {
        reply.status(401).send({ error: "Usuário não autenticado" });
        return 
    }   

    //desestruturando diretamente ao inves de usar request.query.month  etc...
    const { month, categoryId, year, type } = request.query;

    const filters: TransactionFilter = { userId };

    if (month && year) {
        //alinhado com o banco de dados com utc
        //dia 1 do mes e do ano (`${year}-${month}-01`)
        const startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate();
        // do primeiro dia ao ultimo dia do mes seria o range
        const endDate = dayjs.utc(startDate).endOf("month").toDate();
        //pegando o filter tipado acima e injetando inicio de mes e final do mes (range)
        filters.date = { gte: startDate, lte: endDate };
    }

    if (type) {
        filters.type = type;
    }
    if (categoryId) {
        filters.categoryId = categoryId;
    }

    try {
        //estou indo la no banco de dados com meus filters selecionando me traga...
        //findMany => traz todos os registros que satisfazem a condição where
        const transactions = await prisma.transaction.findMany({
            where: filters,
            orderBy: { date: "desc" },
            include: {
                category: {
                    select: { color: true, name: true, type: true, },
                },
            },
        });
        reply.send(transactions);
    }catch (err) {
        request.log.error("Erro ao trazer transações", err);
        reply.status(500).send({ error: "Erro do servidor" });
    }
};