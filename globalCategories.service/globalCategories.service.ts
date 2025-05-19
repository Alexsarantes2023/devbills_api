const globalCategories: GlobalCategoryInput[] = [
  // Despesas
  { name: "Alimentação", color: "#FF5733", type: TransactionType.expense },
  { name: "Transporte", color: "#33A8FF", type: TransactionType.expense },
  { name: "Moradia", color: "#33FF57", type: TransactionType.expense },
  { name: "Saúde", color: "#F033FF", type: TransactionType.expense },
  { name: "Educação", color: "#FF3366", type: TransactionType.expense },
  { name: "Lazer", color: "#FFBA33", type: TransactionType.expense },
  { name: "Compras", color: "#33FFF6", type: TransactionType.expense },
  { name: "Outros", color: "#B033FF", type: TransactionType.expense },

  // Receitas
  { name: "Salário", color: "#33FF57", type: TransactionType.income },
  { name: "Freelance", color: "#33A8FF", type: TransactionType.income },
  { name: "Investimentos", color: "#FFBA33", type: TransactionType.income },
  { name: "Outros", color: "#B033FF", type: TransactionType.income },
];
