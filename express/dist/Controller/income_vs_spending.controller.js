"use strict";
// This controller calculates the earning vs spending for the respective month 
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
exports.getIncomeVsSpendingHandler = void 0;
const config_1 = require("../config");
const moment_1 = __importDefault(require("moment"));
const up_bank_api_1 = require("up-bank-api");
function getIncomeVsSpendingHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const requestedMonthStart = (0, moment_1.default)(req.params.id, 'MMMM YYYY').toISOString();
            const requestedMonthEnd = (0, moment_1.default)(requestedMonthStart).endOf('month').toISOString();
            const data = yield config_1.up.transactions.list({ filterSince: requestedMonthStart, filterUntil: requestedMonthEnd, pageSize: 100 });
            // Need to fetch all data here.. 
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
}
exports.getIncomeVsSpendingHandler = getIncomeVsSpendingHandler;
