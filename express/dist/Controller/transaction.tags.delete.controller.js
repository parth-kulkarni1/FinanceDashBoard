"use strict";
// This controller deletes a tag given to a respective transaction 
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
exports.deleteTagToTransactionHandler = void 0;
const config_1 = require("../config");
function deleteTagToTransactionHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tabObj = req.body;
            yield config_1.up.tags.removeTagsFromTransaction(tabObj.transactionId, [tabObj.tags]);
            res.sendStatus(204); // Sending 204 status code for success
        }
        catch (err) {
            res.sendStatus(500).json({ error: 'An error occurred' });
        }
    });
}
exports.deleteTagToTransactionHandler = deleteTagToTransactionHandler;
