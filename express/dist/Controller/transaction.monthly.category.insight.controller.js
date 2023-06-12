"use strict";
// This controller breaks down the monthly categories of the month into nested order and returns that to front end
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
exports.getMonthlyCategoryInsightsHandler = void 0;
const config_1 = require("../config");
const moment_1 = __importDefault(require("moment"));
function getMonthlyCategoryInsightsHandler(req, res, next) {
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
                const response = yield config_1.up.transactions.list({
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
}
exports.getMonthlyCategoryInsightsHandler = getMonthlyCategoryInsightsHandler;
