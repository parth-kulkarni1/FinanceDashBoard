"use strict";
// This controller calculates the monthly parent-category costs breakdown for a respective month
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
exports.getMonthlyParentCategorySpending = void 0;
const config_1 = require("../config");
const moment_1 = __importDefault(require("moment"));
function getMonthlyParentCategorySpending(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get the requested month start and end dates based on the provided query parameter
            const requestedMonthStart = (0, moment_1.default)(req.params.id, 'MMMM YYYY').toISOString();
            const requestedMonthEnd = (0, moment_1.default)(requestedMonthStart).endOf('month').toISOString();
            // Retrieve transactions data for the requested month using the Up API
            const data = yield config_1.up.transactions.list({ filterSince: requestedMonthStart, filterUntil: requestedMonthEnd, pageSize: 100 });
            const categories_for_month = []; // Array to store the month
            const response = []; // Array to store the response data
            // Loop through the transactions data to find unique parent category IDs
            for (let i = 0; i < data.data.length; i++) {
                const parentCategory = (_a = data.data[i].relationships.parentCategory.data) === null || _a === void 0 ? void 0 : _a.id;
                if (parentCategory && categories_for_month.findIndex(val => val === parentCategory) === -1) {
                    categories_for_month.push(parentCategory);
                }
            }
            // Loop through the unique parent category IDs and calculate the total spent for each category
            for (let k = 0; k < categories_for_month.length; k++) {
                const retrievedData = data.data.filter(item => { var _a; return ((_a = item.relationships.parentCategory.data) === null || _a === void 0 ? void 0 : _a.id) === categories_for_month[k]; });
                if (retrievedData.length > 1) {
                    let spentOnCategory = 0;
                    // Calculate the total spent on the category by summing up the amounts of each transaction
                    retrievedData.forEach(item => spentOnCategory += Math.abs(parseFloat(item.attributes.amount.value)));
                    response.push({
                        category: categories_for_month[k],
                        totalSpent: spentOnCategory
                    });
                }
                else if (retrievedData.length === 1) {
                    const spentOnCategory = Math.abs(parseFloat(retrievedData[0].attributes.amount.value));
                    response.push({
                        category: categories_for_month[k],
                        totalSpent: spentOnCategory
                    });
                }
                else {
                    // If no transactions are found for the category, set the total spent to 0.0
                    response.push({
                        category: categories_for_month[k],
                        totalSpent: 0.0
                    });
                }
            }
            // Send the response as JSON
            res.json(response);
        }
        catch (err) {
            res.json({ error: "Something has gone wrong in calculating your categorical spending" });
        }
    });
}
exports.getMonthlyParentCategorySpending = getMonthlyParentCategorySpending;
