"use strict";
// This file contains the UP-BANK third party wrapper initilization 
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSaversId = exports.setTransactionalId = exports.setToken = exports.TOKEN = exports.SAVERS_ID = exports.TRANSACTIONAL_ID = exports.up = void 0;
const up_bank_api_1 = require("up-bank-api");
const up = new up_bank_api_1.UpApi();
exports.up = up;
let TRANSACTIONAL_ID = "";
exports.TRANSACTIONAL_ID = TRANSACTIONAL_ID;
let SAVERS_ID = "";
exports.SAVERS_ID = SAVERS_ID;
let TOKEN = "";
exports.TOKEN = TOKEN;
const setToken = (newToken) => {
    exports.TOKEN = TOKEN = newToken;
};
exports.setToken = setToken;
const setTransactionalId = (newID) => {
    exports.TRANSACTIONAL_ID = TRANSACTIONAL_ID = newID;
};
exports.setTransactionalId = setTransactionalId;
const setSaversId = (newID) => {
    exports.SAVERS_ID = SAVERS_ID = newID;
};
exports.setSaversId = setSaversId;
