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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionalAccountHandler = void 0;
const config_1 = require("../config");
const up_bank_api_1 = require("up-bank-api");
function getTransactionalAccountHandler(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.session.myData) {
                const accounts = yield config_1.up.accounts.list();
                const transactionAccountID = (_a = accounts.data.find(val => val.attributes.accountType == "TRANSACTIONAL")) === null || _a === void 0 ? void 0 : _a.id;
                (0, config_1.setTransactionalId)(transactionAccountID);
                const tranactionalAccount = yield config_1.up.accounts.retrieve(config_1.TRANSACTIONAL_ID);
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
}
exports.getTransactionalAccountHandler = getTransactionalAccountHandler;
