// This file contains the UP-BANK third party wrapper initilization 

import { UpApi } from "up-bank-api";
const up = new UpApi();
let TRANSACTIONAL_ID = "";
let SAVERS_ID = "";
let TOKEN = "";

const setToken = (newToken: string) => {
  TOKEN = newToken;
};

const setTransactionalId = (newID: string) => {
    TRANSACTIONAL_ID = newID;
}

const setSaversId = (newID: string) => {
    SAVERS_ID = newID;
}

export { up, TRANSACTIONAL_ID, SAVERS_ID, TOKEN, setToken, setTransactionalId, setSaversId };

