"use strict";
// This controller gets the most popular company that the user visited within a respective month
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
exports.getTransactionsTop5Handler = void 0;
const config_1 = require("../config");
const moment_1 = __importDefault(require("moment"));
function getTransactionsTop5Handler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const requestedMonthStart = (0, moment_1.default)(req.params.id, 'MMMM YYYY').toISOString();
            const requestedMonthEnd = (0, moment_1.default)(requestedMonthStart).endOf('month').toISOString();
            let allTransactions = [];
            let nextPageToken = '';
            do {
                const response = yield config_1.up.transactions.list({
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
}
exports.getTransactionsTop5Handler = getTransactionsTop5Handler;
