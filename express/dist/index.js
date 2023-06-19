"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Routes_1 = require("./Routes/Routes");
const express_session_1 = __importDefault(require("express-session"));
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
const cors = require('cors');
const cors_options = {
    origin: "https://64903eec8dad3b53b9d61b62--stately-crisp-41befd.netlify.app/",
    credentials: true
};
app.use(express_1.default.json());
app.use(cors(cors_options));
app.use((0, helmet_1.default)());
app.use((0, express_session_1.default)({
    secret: 'keyboard cat',
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 900000,
        secure: true,
        sameSite: 'none',
    },
    resave: false,
}));
// Set trust proxy if you are behind a reverse proxy like railways.app
// This allows secure cookies to work properly
app.set('trust proxy', 1);
app.use(Routes_1.router);
app.listen(port, () => console.log("sucessfully created on port 4000"));
module.exports = app;
