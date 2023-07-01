"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Routes_1 = require("./Routes/Routes");
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
const cors = require('cors');
const cors_options = {
    origin: ["https://up-bank-dashboard.netlify.app", "https://up-bank-dashboard.netlify.app/", "http://localhost:3000/", "http://localhost:3000"],
    credentials: true
};
app.use(express_1.default.json());
app.use(cors(cors_options));
// Set trust proxy if you are behind a reverse proxy like railways.app
// This allows secure cookies to work properly
app.set('trust proxy', 1);
app.use(Routes_1.router);
app.listen(port, () => console.log("successfully created on port 4000"));
module.exports = app;
