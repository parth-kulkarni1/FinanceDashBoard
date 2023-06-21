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
import { checkSessionExpiry } from "../Controller/session.expiryCheck";

declare module 'express-session' {
  interface SessionData {
    myData: boolean;
  }
}

const router = Router();


router.get('/api/login/:id', loginController)

router.get('/api/cookie', getCookieHandler)

router.get('/api/check-session', checkSessionExpiry)

router.post('/api/logout', logoutHandler)

router.get('/api/accounts/transactional', getTransactionalAccountHandler) 

router.get('/api/accounts/savings', getSaversAccountHandler)

router.get('/api/accounts/transactional/transactions', getTransactionsHandler)

router.get('/api/accounts/trasactional/monthly', getMonthlyTotalSpendingHandler)

router.get('/api/transactions/next', getNextPaginatedDataHandler)

router.get('/api/transactional/:id', getMerchantInfoHandler)

router.post('/api/transactional/category', getTransactionSummaryHandler)

router.get('/api/transactional/monthly/graph/:id', getIncomeVsSpendingHandler)

router.get('/api/transactions/monthly/categories/:id', getMonthlyParentCategorySpending)

router.get('/api/transactional/monthly/top10/:id', getTransactionsTop5Handler)

router.get('/api/transactional/monthly/category/detailed/:id', getMonthlyCategoryInsightsHandler)

router.post('/api/transactions/add/tag', addTagsToTransactionHandler)

router.delete('/api/transactions/delete/tag', deleteTagToTransactionHandler)

router.get('/api/categories', getAllCategoriesHandler)

router.patch('/api/categories/change', changeTransactionCategoryHandler)

export {router};