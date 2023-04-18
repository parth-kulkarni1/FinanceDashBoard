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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const up_bank_api_1 = require("up-bank-api");
require('dotenv').config();
const moment_1 = __importDefault(require("moment"));
const axios_1 = __importDefault(require("axios"));
const up = new up_bank_api_1.UpApi();
let TRANSACTIONAL_ID = "";
let SAVERS_ID = "";
const router = (0, express_1.Router)();
exports.router = router;
router.get('/login/:id', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.params.id;
            up.updateApiKey(token);
            const authenticated = yield up.util.ping();
            req.session.cookieGen = token; // set cookie to login
            res.json(authenticated);
        }
        catch (e) {
            if ((0, up_bank_api_1.isUpApiError)(e)) {
                // Handle error returned from Up API
                res.json(null);
            }
            res.json(null); // Any other errors also to be treated as null
            next(e); // Process the error on express
        }
    });
});
router.get('/cookie', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.session.cookie) {
            res.json(true);
        }
        else {
            res.json(false);
        }
    });
});
router.post('/logout', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        req.session.destroy(err => {
            if (err) {
                res.send({ error: 'Logout error' });
            }
            res.clearCookie("connect.sid", { path: '/' });
            res.json("success");
        });
    });
});
router.get('/accounts/transactional', function (req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.session.cookieGen) {
                const accounts = yield up.accounts.list();
                TRANSACTIONAL_ID = (_a = accounts.data.find(val => val.attributes.accountType == "TRANSACTIONAL")) === null || _a === void 0 ? void 0 : _a.id;
                const tranactionalAccount = yield up.accounts.retrieve(TRANSACTIONAL_ID);
                res.json(tranactionalAccount.data);
            }
            else {
                return res.redirect('/');
            }
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
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const accounts = yield up.accounts.list();
            SAVERS_ID = (_a = accounts.data.find(val => val.attributes.accountType == "SAVER")) === null || _a === void 0 ? void 0 : _a.id;
            const savingsAccount = yield up.accounts.retrieve(SAVERS_ID);
            res.json(savingsAccount.data);
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
            const transactions = yield up.transactions.listByAccount(TRANSACTIONAL_ID);
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
router.get('/accounts/trasactional/monthly', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const startOfMonth = (0, moment_1.default)().startOf('month').toISOString();
            const transactions = yield up.transactions.listByAccount(TRANSACTIONAL_ID, { filterSince: startOfMonth });
            let total = 0;
            // Calculate the monthly cost 
            for (let i = 0; i < transactions.data.length; i++) {
                if (transactions.data[i].relationships.transferAccount.data === null) {
                    total = total + Math.abs(parseFloat(transactions.data[i].attributes.amount.value));
                }
            }
            res.json(total.toFixed(2));
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
router.get('/transactions/next', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const next = req.query.link;
            const { data } = yield axios_1.default.get(next, { headers: { "Authorization": `Bearer ${process.env.TOKEN}` } });
            res.json(data);
        }
        catch (e) {
            if ((0, up_bank_api_1.isUpApiError)(e)) {
                console.log(e.response.data.errors);
            }
        }
    });
});
router.get('/transactional/:id', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const description = req.params.id;
            const optionsSearch = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Referer: 'http://localhost'
                }
            };
            const optionsReterive = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${process.env.BRAND_FETCH_TOKEN}`
                }
            };
            const { data } = yield axios_1.default.get(`https://api.brandfetch.io/v2/search/${description}`, optionsSearch);
            const updated = data.filter((val) => val.name == description || val.domain.includes('au'));
            if (updated.length) { // Make another axios call to reterive more information about the merchant. The search returns a less detailed result
                const { data } = yield axios_1.default.get(`https://api.brandfetch.io/v2/brands/${updated[0].domain}`, optionsReterive);
                console.log(data);
                updated[0].domain = "https://" + updated[0].domain; // Update the domain link
                data.domain = "https://" + data.domain; // Update the domain link
                res.json({ "brandInfo": updated[0], "domainInfo": data });
            }
            else {
                res.json(null);
            }
        }
        catch (e) {
            next(e);
            res.json(e);
        }
    });
});
router.post('/transactional/category', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categoryDescription = req.body.categoryName;
            const merchantName = req.body.merchantName;
            const transactionsCategorised = yield up.transactions.list({ filterCategory: categoryDescription });
            const updated = transactionsCategorised.data.filter((val) => val.attributes.description === merchantName);
            // Now lets do some maths on the calculations..
            const numberOfTransactions = updated.length;
            let sumOfTransactions = 0;
            for (let i = 0; i < updated.length; i++) {
                sumOfTransactions += (Math.abs(parseFloat(updated[i].attributes.amount.value)));
            }
            const average = (sumOfTransactions / numberOfTransactions);
            const userMerchantSummary = { numberOfTransactions: numberOfTransactions, sumOfTransactions: sumOfTransactions, averageOfTransactions: average };
            res.json({ transactionSummary: userMerchantSummary, pastTransactionsList: updated });
        }
        catch (e) {
            console.log(e);
        }
    });
});
