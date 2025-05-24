import type { TransactionType } from "@prisma/client";
import type { CategorySummary } from "./category.types";

//ou type ou interface para o filter
export interface TransactionFilter {
    userId: string,
    date?: {
        //gte é maior ou igual, lte é menor ou igual
        gte: Date;
        lte: Date;
    },
    type?: TransactionType;
    categoryId?: string;
}

//ou type ou interface para o sumary(resumo de lista) da tela dos graficos
export interface TransactionSummary {
    totalExpenses: number;
    totalIncomes: number;
    balance: number;
    expensesByCategory: CategorySummary[];
}