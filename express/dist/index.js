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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
require('dotenv').config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
const options = {
    headers: {
        Authorization: `Bearer ${process.env.TOKEN}`
    }
};
app.use(express_1.default.json());
app.get('/accounts', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://api.up.com.au/api/v1/accounts";
        const { data } = yield axios_1.default.get(url, options);
        console.log(data, "Data");
        res.send(data);
    });
});
app.listen(port, () => console.log("sucessfully created on port 4000"));
