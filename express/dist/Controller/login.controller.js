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
exports.loginController = void 0;
const config_1 = require("../config");
const up_bank_api_1 = require("up-bank-api");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_2 = require("../config");
function loginController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.params.id;
            config_1.up.updateApiKey(token);
            (0, config_1.setToken)(token);
            const authenticated = yield config_1.up.util.ping();
            if (authenticated.meta.id) {
                const token = jsonwebtoken_1.default.sign({ id: authenticated.meta.id }, config_2.jwtConfig.jwtSecret, {
                    expiresIn: config_2.jwtConfig.jwtExpiration
                });
                res.json(token);
                return;
            }
            else {
                res.json(null);
            }
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
