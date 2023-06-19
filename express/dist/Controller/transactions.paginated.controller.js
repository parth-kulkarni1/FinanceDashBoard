"use strict";
// This function calls the next of paginated data, and returns it back to front end
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
exports.getNextPaginatedDataHandler = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const up_bank_api_1 = require("up-bank-api");
function getNextPaginatedDataHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const nextLink = req.query.link;
            // Make a GET request to the next link of paginated data
            const { data } = yield axios_1.default.get(nextLink, { headers: { "Authorization": `Bearer ${config_1.TOKEN}` } });
            res.json(data);
        }
        catch (e) {
            if ((0, up_bank_api_1.isUpApiError)(e)) {
                // Handle error returned from Up API
                console.log(e.response.data.errors);
                res.status(500).json({ error: "An error occurred while retrieving the next paginated data." });
            }
            else {
                // Unexpected error
                console.log(e);
                res.status(500).json({ error: "An unexpected error occurred." });
            }
        }
    });
}
exports.getNextPaginatedDataHandler = getNextPaginatedDataHandler;
