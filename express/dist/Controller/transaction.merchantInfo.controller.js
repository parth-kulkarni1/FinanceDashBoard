"use strict";
// This controller retrieves the merchant information 
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
exports.getMerchantInfoHandler = void 0;
const axios_1 = __importDefault(require("axios"));
function getMerchantInfoHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const description = req.params.id;
            const optionsSearch = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Referer: 'http://localhost'
                }
            };
            const optionsReterive = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${process.env.BRAND_FETCH_TOKEN}`
                }
            };
            const { data } = yield axios_1.default.get(`https://api.brandfetch.io/v2/search/${description}`, optionsSearch);
            const updated = data.filter((val) => val.name == description || val.domain.includes('au'));
            if (updated.length) { // Make another axios call to reterive more information about the merchant. The search returns a less detailed result
                const { data } = yield axios_1.default.get(`https://api.brandfetch.io/v2/brands/${updated[0].domain}`, optionsReterive);
                console.log(data);
                updated[0].domain = "https://" + updated[0].domain; // Update the domain link
                data.domain = "https://" + data.domain; // Update the domain link
                res.json({ "brandInfo": updated[0], "domainInfo": data });
            }
            else {
                res.json(null);
            }
        }
        catch (e) {
            next(e);
            res.json(e);
        }
    });
}
exports.getMerchantInfoHandler = getMerchantInfoHandler;
