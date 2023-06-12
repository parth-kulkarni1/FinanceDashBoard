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
exports.loginController = void 0;
const config_1 = require("../config");
const up_bank_api_1 = require("up-bank-api");
function loginController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.params.id;
            config_1.up.updateApiKey(token);
            (0, config_1.setToken)(token);
            const authenticated = yield config_1.up.util.ping();
            req.session.myData = true; // set cookie to login
            res.json(authenticated);
        }
        catch (e) {
            if ((0, up_bank_api_1.isUpApiError)(e)) {
                // Handle error returned from Up API
                res.json(null);
                return;
            }
            res.json(null); // Any other errors also to be treated as null
        }
    });
}
exports.loginController = loginController;
