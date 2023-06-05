"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Routes_1 = require("./Routes/Routes");
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
const cors = require('cors');
const cors_options = {
    origin: "http://localhost:3000",
    credentials: true
};
app.use(express_1.default.json());
app.use(cors(cors_options));
app.use((0, express_session_1.default)({
    secret: 'keyboard cat',
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 900000, secure: 'auto', sameSite: 'strict' },
    resave: false,
}));
app.use(Routes_1.router);
app.set('trust proxy', 1);
app.listen(port, () => console.log("sucessfully created on port 4000"));
module.exports = app;
