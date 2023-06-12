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
exports.changeTransactionCategoryHandler = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
function changeTransactionCategoryHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transactionID = req.body.transactionId;
            const categoryData = req.body.category;
            const headers = {
                'Authorization': `Bearer ${config_1.TOKEN}`,
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
}
exports.changeTransactionCategoryHandler = changeTransactionCategoryHandler;
