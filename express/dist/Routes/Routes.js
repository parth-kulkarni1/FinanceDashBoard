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
const login_controller_1 = require("../Controller/login.controller");
const cookie_controller_1 = require("../Controller/cookie.controller");
const logout_controller_1 = require("../Controller/logout.controller");
const accounts_transaction_controller_1 = require("../Controller/accounts.transaction.controller");
const accounts_savers_controller_1 = require("../Controller/accounts.savers.controller");
const transaction_acc_transaction_controller_1 = require("../Controller/transaction_acc.transaction.controller");
const transactions_monthly_controller_1 = require("../Controller/transactions.monthly.controller");
const up = new up_bank_api_1.UpApi();
let TRANSACTIONAL_ID = "";
let SAVERS_ID = "";
let TOKEN = "";
const router = (0, express_1.Router)();
exports.router = router;
router.get('/login/:id', login_controller_1.loginController);
router.get('/cookie', cookie_controller_1.getCookieHandler);
router.post('/logout', logout_controller_1.logoutHandler);
router.get('/accounts/transactional', accounts_transaction_controller_1.getTransactionalAccountHandler);
router.get('/accounts/savings', accounts_savers_controller_1.getSaversAccountHandler);
router.get('/accounts/transactional/transactions', transaction_acc_transaction_controller_1.getTransactionsHandler);
router.get('/accounts/trasactional/monthly', transactions_monthly_controller_1.getMonthlyTotalSpendingHandler);
router.get('/transactions/next', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const next = req.query.link;
            const { data } = yield axios_1.default.get(next, { headers: { "Authorization": `Bearer ${TOKEN}` } });
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
router.get('/transactional/monthly/graph/:id', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const requestedMonthStart = (0, moment_1.default)(req.params.id, 'MMMM YYYY').toISOString();
            const requestedMonthEnd = (0, moment_1.default)(requestedMonthStart).endOf('month').toISOString();
            const data = yield up.transactions.list({ filterSince: requestedMonthStart, filterUntil: requestedMonthEnd, pageSize: 100 });
            let income = 0;
            let spending = 0;
            for (let i = 0; i < data.data.length; i++) {
                let value = parseFloat(data.data[i].attributes.amount.value);
                const validExpense = data.data[i].attributes.isCategorizable && data.data[i].attributes.amount.valueInBaseUnits < 0;
                const validIncome = data.data[i].attributes.isCategorizable && data.data[i].attributes.amount.valueInBaseUnits > 0;
                if (validIncome) { // This means that its some form of income
                    income = income + value;
                }
                else if (validExpense) {
                    spending = spending + Math.abs(value);
                }
            }
            res.json([{ status: "income", income: income }, { status: "spending", spending: spending }]);
        }
        catch (err) {
            if ((0, up_bank_api_1.isUpApiError)(err)) {
                res.json(err);
                return;
            }
            res.json(err);
        }
    });
});
router.get('/transactions/monthly/categories/:id', function (req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const requestedMonthStart = (0, moment_1.default)(req.params.id, 'MMMM YYYY').toISOString();
            const requestedMonthEnd = (0, moment_1.default)(requestedMonthStart).endOf('month').toISOString();
            const data = yield up.transactions.list({ filterSince: requestedMonthStart, filterUntil: requestedMonthEnd, pageSize: 100 });
            const categories_for_month = [];
            const response = [];
            for (let i = 0; i < data.data.length; i++) {
                const parentCategory = (_a = data.data[i].relationships.parentCategory.data) === null || _a === void 0 ? void 0 : _a.id;
                if (parentCategory && categories_for_month.findIndex(val => val == parentCategory) === -1) {
                    categories_for_month.push(parentCategory);
                }
            }
            for (let k = 0; k < categories_for_month.length; k++) {
                const reterivedData = data.data.filter(item => { var _a; return ((_a = item.relationships.parentCategory.data) === null || _a === void 0 ? void 0 : _a.id) === categories_for_month[k]; });
                if (reterivedData.length > 1) {
                    let spentOnCategory = 0;
                    reterivedData.forEach(item => spentOnCategory = spentOnCategory + Math.abs(parseFloat(item.attributes.amount.value)));
                    response.push({
                        category: categories_for_month[k],
                        totalSpent: spentOnCategory
                    });
                }
                else if (reterivedData.length === 1) {
                    const spentOnCategory = Math.abs(parseFloat(reterivedData[0].attributes.amount.value));
                    response.push({
                        category: categories_for_month[k],
                        totalSpent: spentOnCategory
                    });
                }
                else {
                    response.push({
                        category: categories_for_month[k],
                        totalSpent: 0.0
                    });
                }
            }
            res.json(response);
        }
        catch (err) {
            console.log(err);
        }
    });
});
router.get('/transactional/monthly/top10/:id', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const requestedMonthStart = (0, moment_1.default)(req.params.id, 'MMMM YYYY').toISOString();
            const requestedMonthEnd = (0, moment_1.default)(requestedMonthStart).endOf('month').toISOString();
            let allTransactions = [];
            let nextPageToken = '';
            do {
                const response = yield up.transactions.list({
                    filterSince: requestedMonthStart,
                    filterUntil: requestedMonthEnd,
                    pageSize: 100,
                });
                allTransactions = allTransactions.concat(response);
                nextPageToken = response.links.next;
            } while (nextPageToken);
            const data = [];
            // We will now iterate through the array, and pick out only companies and allocate frequency of visits 
            for (let i = 0; i < allTransactions[0].data.length; i++) {
                // First case if its the first item 
                const currentCompany = allTransactions[0].data[i];
                console.log(currentCompany);
                // Check ensure that only valid merchant purchases are being accessed 
                if (currentCompany.relationships.category.data !== null) {
                    if (i === 0) {
                        data.push({ companyName: currentCompany.attributes.description,
                            frequency: 1
                        });
                    }
                    else {
                        // Attempt to find the company, and if it does not exist add into data array 
                        const itemIndex = data.findIndex(item => item.companyName === currentCompany.attributes.description);
                        if (itemIndex === -1) { // Company does not exist
                            data.push({
                                companyName: currentCompany.attributes.description,
                                frequency: 1
                            });
                        }
                        else { // This company already exists, so we will have to just increment its frequency
                            data[itemIndex].frequency = data[itemIndex].frequency + 1;
                        }
                    }
                }
            }
            data.sort((a, b) => b.frequency - a.frequency);
            res.json(data.slice(0, 5));
        }
        catch (err) {
            res.json(err);
        }
    });
});
router.get('/transactional/monthly/category/detailed/:id', function (req, res, next) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        // Establish date boundaries
        const requestedMonthStart = (0, moment_1.default)(req.params.id, 'MMMM YYYY').toISOString(); // Reterive the respective month
        const requestedMonthEnd = (0, moment_1.default)(requestedMonthStart).endOf('month').toISOString();
        try {
            // Lets retrieve all possible data now, since it's paginated
            let allTransactions = [];
            let nextPageToken = '';
            do {
                const response = yield up.transactions.list({
                    filterSince: requestedMonthStart,
                    filterUntil: requestedMonthEnd,
                    pageSize: 100,
                });
                allTransactions = allTransactions.concat(response);
                nextPageToken = response.links.next;
            } while (nextPageToken);
            const data = allTransactions[0];
            // Contains an array of objects with object type defined above
            const DataToReturn = [];
            /* Cases to consider
        
              - The transaction must be an expense
              - Need to set the parent category as the key in dictionary and append all child category to parent category
              - Conditional checks to check whether the parent category exists too
            */
            for (let i = 0; i < data.data.length; i++) {
                let currentData = data.data[i];
                // Lets check whether its a valid expense
                if (currentData.attributes.isCategorizable && currentData.attributes.amount.valueInBaseUnits < 0 && ((_a = currentData.relationships.parentCategory.data) === null || _a === void 0 ? void 0 : _a.id) !== undefined) {
                    // First case nothing exists so lets add this into our array
                    if (i === 0) {
                        DataToReturn.push({
                            parentCategory: (_b = currentData.relationships.parentCategory.data) === null || _b === void 0 ? void 0 : _b.id,
                            childCategory: [{ categoryName: (_c = currentData.relationships.category.data) === null || _c === void 0 ? void 0 : _c.id, transaction: [currentData] }]
                        });
                    }
                    else {
                        // This means we are not the first iteration 
                        // Lets find if the parent category of the currentData exists in our array 
                        const parentIndex = DataToReturn.findIndex(itemIndex => { var _a; return itemIndex.parentCategory === ((_a = currentData.relationships.parentCategory.data) === null || _a === void 0 ? void 0 : _a.id); });
                        if (parentIndex !== -1) {
                            // Means the parent category does exists, so lets append it
                            const childCategory = DataToReturn[parentIndex].childCategory.find(item => { var _a; return item.categoryName === ((_a = currentData.relationships.category.data) === null || _a === void 0 ? void 0 : _a.id); });
                            if (childCategory) {
                                // This means that both parent category and child category exists
                                childCategory.transaction.push(currentData);
                            }
                            else {
                                // This means that the parent exists but the child category does not exist 
                                DataToReturn[parentIndex].childCategory.push({ categoryName: (_d = currentData.relationships.category.data) === null || _d === void 0 ? void 0 : _d.id, transaction: [currentData] });
                            }
                        }
                        else {
                            // This means that parent does not exist at all, and child cannot exist without parent so this makes sense
                            DataToReturn.push({
                                parentCategory: (_e = currentData.relationships.parentCategory.data) === null || _e === void 0 ? void 0 : _e.id,
                                childCategory: [{ categoryName: (_f = currentData.relationships.category.data) === null || _f === void 0 ? void 0 : _f.id, transaction: [currentData] }]
                            });
                        }
                    }
                }
            }
            res.json(DataToReturn);
        }
        catch (err) {
            res.json(err);
        }
    });
});
router.post('/transactions/add/tag', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tagObj = req.body;
            yield up.tags.addTagsToTransaction(tagObj.transactionId, [tagObj.tags]);
            res.sendStatus(204); // Sending 204 status code for success
        }
        catch (err) {
            res.status(500).json({ error: 'An error occurred' });
        }
    });
});
router.delete('/transactions/delete/tag', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tabObj = req.body;
            yield up.tags.removeTagsFromTransaction(tabObj.transactionId, [tabObj.tags]);
            res.sendStatus(204); // Sending 204 status code for success
        }
        catch (err) {
            res.sendStatus(500).json({ error: 'An error occurred' });
        }
    });
});
router.get('/categories', function (req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let responseToReturn = [];
            const data = yield up.categories.list();
            for (let i = 0; i < data.data.length; i++) {
                let currentCategoryParent = (_a = data.data[i].relationships.parent.data) === null || _a === void 0 ? void 0 : _a.id;
                let currentCategoryName = data.data[i].attributes.name;
                let currentCategoryId = data.data[i].id;
                if (i === 0) {
                    // First item scenario
                    responseToReturn.push({ parentCategory: currentCategoryParent, childCategory: [{ id: currentCategoryId, name: currentCategoryName }] });
                }
                else {
                    // Now check if the parentCategory already exists 
                    const parentCategoryIndex = responseToReturn.findIndex(item => item.parentCategory === currentCategoryParent);
                    if (parentCategoryIndex === -1) {
                        // This means that the category does not exist
                        responseToReturn.push({ parentCategory: currentCategoryParent, childCategory: [{ id: currentCategoryId, name: currentCategoryName }] });
                    }
                    else {
                        // This means that the parent category does exist 
                        (_b = responseToReturn[parentCategoryIndex].childCategory) === null || _b === void 0 ? void 0 : _b.push({ id: currentCategoryId, name: currentCategoryName });
                    }
                }
            }
            res.json(responseToReturn);
        }
        catch (err) {
            res.sendStatus(500).json({ error: 'An error occurred' });
        }
    });
});
router.patch('/categories/change', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transactionID = req.body.transactionId;
            const categoryData = req.body.category;
            const headers = {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            };
            const data = {
                data: {
                    type: categoryData.type,
                    id: categoryData.id
                }
            };
            const response = yield axios_1.default.patch(`https://api.up.com.au/api/v1/transactions/${transactionID}/relationships/category`, data, { headers });
            if (response.status === 204) {
                res.sendStatus(204);
            }
            else {
                res.sendStatus(500);
            }
        }
        catch (err) {
            res.sendStatus(500).json({ error: "An error has occurred." });
        }
    });
});
