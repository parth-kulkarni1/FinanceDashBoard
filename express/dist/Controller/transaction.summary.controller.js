"use strict";
// This controller calculates the average and total spend across the respective transaction merchant
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
exports.getTransactionSummaryHandler = void 0;
const config_1 = require("../config");
function getTransactionSummaryHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categoryDescription = req.body.categoryName;
            const merchantName = req.body.merchantName;
            const transactionsCategorised = yield config_1.up.transactions.list({ filterCategory: categoryDescription });
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
}
exports.getTransactionSummaryHandler = getTransactionSummaryHandler;
