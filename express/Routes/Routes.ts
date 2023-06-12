import express, { Router } from "express";
require('dotenv').config();


import { loginController } from "../Controller/login.controller";
import { getCookieHandler } from "../Controller/cookie.controller";
import { logoutHandler } from "../Controller/logout.controller";
import { getTransactionalAccountHandler } from "../Controller/accounts.transaction.controller";
import { getSaversAccountHandler } from "../Controller/accounts.savers.controller";
import { getTransactionsHandler } from "../Controller/transaction_acc.transaction.controller";
import { getMonthlyTotalSpendingHandler } from "../Controller/transactions.monthly.controller";
import { getNextPaginatedDataHandler } from "../Controller/transactions.paginated.controller";
import { getMerchantInfoHandler } from "../Controller/transaction.merchantInfo.controller";
import { getTransactionSummaryHandler } from "../Controller/transaction.summary.controller";
import { getIncomeVsSpendingHandler } from "../Controller/income_vs_spending.controller";
import { getMonthlyParentCategorySpending } from "../Controller/monthly_category_spending.controller";
import { getTransactionsTop5Handler } from "../Controller/transactions.top5.controller";
import { getMonthlyCategoryInsightsHandler } from "../Controller/transaction.monthly.category.insight.controller";
import { addTagsToTransactionHandler } from "../Controller/transactions.tag.add.controller";
import { deleteTagToTransactionHandler } from "../Controller/transaction.tags.delete.controller";
import { getAllCategoriesHandler } from "../Controller/categories.all.controller";
import { changeTransactionCategoryHandler } from "../Controller/categories.change.controller";

declare module 'express-session' {
  interface SessionData {
    myData: boolean;
  }
}

const router = Router();


router.get('/login/:id', loginController)

router.get('/cookie', getCookieHandler)

router.post('/logout', logoutHandler)

router.get('/accounts/transactional', getTransactionalAccountHandler) 

router.get('/accounts/savings', getSaversAccountHandler)

router.get('/accounts/transactional/transactions', getTransactionsHandler)

router.get('/accounts/trasactional/monthly', getMonthlyTotalSpendingHandler)

router.get('/transactions/next', getNextPaginatedDataHandler)

router.get('/transactional/:id', getMerchantInfoHandler)

router.post('/transactional/category', getTransactionSummaryHandler)

router.get('/transactional/monthly/graph/:id', getIncomeVsSpendingHandler)

router.get('/transactions/monthly/categories/:id', getMonthlyParentCategorySpending)

router.get('/transactional/monthly/top10/:id', getTransactionsTop5Handler)

router.get('/transactional/monthly/category/detailed/:id', getMonthlyCategoryInsightsHandler)

router.post('/transactions/add/tag', addTagsToTransactionHandler)

router.delete('/transactions/delete/tag', deleteTagToTransactionHandler)

router.get('/categories', getAllCategoriesHandler)

router.patch('/categories/change', changeTransactionCategoryHandler)

export {router};