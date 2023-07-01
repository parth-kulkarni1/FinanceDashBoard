import express, { Router } from "express";
require('dotenv').config();

import { Request, Response } from "express";
import jwt from 'jsonwebtoken'

import { loginController } from "../Controller/login.controller";
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
import { authenticateToken } from "../authMiddleware";

const router = Router();


router.get('/api/login/:id', loginController)

router.get('/api/check-session', authenticateToken, checkSessionExpiry);

router.post('/api/logout', authenticateToken, logoutHandler);

router.get('/api/accounts/transactional', authenticateToken, getTransactionalAccountHandler);

router.get('/api/accounts/savings', authenticateToken, getSaversAccountHandler);

router.get('/api/accounts/transactional/transactions', authenticateToken, getTransactionsHandler);

router.get('/api/accounts/trasactional/monthly', authenticateToken, getMonthlyTotalSpendingHandler);

router.get('/api/transactions/next', authenticateToken, getNextPaginatedDataHandler);

router.get('/api/transactional/:id', authenticateToken, getMerchantInfoHandler);

router.post('/api/transactional/category', authenticateToken, getTransactionSummaryHandler);

router.get('/api/transactional/monthly/graph/:id', authenticateToken, getIncomeVsSpendingHandler);

router.get('/api/transactions/monthly/categories/:id', authenticateToken, getMonthlyParentCategorySpending);

router.get('/api/transactional/monthly/top10/:id', authenticateToken, getTransactionsTop5Handler);

router.get('/api/transactional/monthly/category/detailed/:id', authenticateToken, getMonthlyCategoryInsightsHandler);

router.post('/api/transactions/add/tag', authenticateToken, addTagsToTransactionHandler);

router.delete('/api/transactions/delete/tag', authenticateToken, deleteTagToTransactionHandler);

router.get('/api/categories', authenticateToken, getAllCategoriesHandler);

router.patch('/api/categories/change', authenticateToken, changeTransactionCategoryHandler);

router.get('/api/checkTokenValidity', authenticateToken, (req: Request, res: Response) => {

    console.log("value  set here for jwta")


    res.json(true);
});
  

export {router};