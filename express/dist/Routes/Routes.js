"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const up_bank_api_1 = require("up-bank-api");
require('dotenv').config();
const up = new up_bank_api_1.UpApi(process.env.TOKEN);
const router = (0, express_1.Router)();
exports.router = router;
router.get('/accounts/transactional', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const accounts = yield up.accounts.retrieve(process.env.TRANSACTIONAL_ID);
            res.json(accounts.data);
        }
        catch (e) {
            if ((0, up_bank_api_1.isUpApiError)(e)) {
                // Handle error returned from Up API
                console.log(e.response.data.errors);
            }
            // Unexpected error
            throw e;
        }
    });
});
router.get('/accounts/savings', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const savingAccount = yield up.accounts.retrieve(process.env.SAVERS_ID);
            res.json(savingAccount.data);
        }
        catch (e) {
            if ((0, up_bank_api_1.isUpApiError)(e)) {
                // Handle error returned from Up API
                console.log(e.response.data.errors);
            }
            // Unexpected error
            throw e;
        }
    });
});
router.get('/accounts/transactional/transactions', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transactions = yield up.transactions.list();
            res.json(transactions);
        }
        catch (e) {
            if ((0, up_bank_api_1.isUpApiError)(e)) {
                // Handle error returned from Up API
                console.log(e.response.data.errors);
            }
            // Unexpected error
            throw e;
        }
    });
});
