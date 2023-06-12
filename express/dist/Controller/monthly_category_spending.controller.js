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
            const requestedMonthStart = (0, moment_1.default)(req.params.id, 'MMMM YYYY').toISOString();
            const requestedMonthEnd = (0, moment_1.default)(requestedMonthStart).endOf('month').toISOString();
            const data = yield config_1.up.transactions.list({ filterSince: requestedMonthStart, filterUntil: requestedMonthEnd, pageSize: 100 });
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
}
exports.getMonthlyParentCategorySpending = getMonthlyParentCategorySpending;
