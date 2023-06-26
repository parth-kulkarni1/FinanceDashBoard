"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Routes_1 = require("./Routes/Routes");
const sessionExpiration_1 = __importDefault(require("./sessionExpiration"));
const express_session_1 = __importDefault(require("express-session"));
const redis_1 = require("redis");
const connect_redis_1 = __importDefault(require("connect-redis"));
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
const cors = require('cors');
const cors_options = {
    origin: ["https://up-bank-dashboard.netlify.app", "https://up-bank-dashboard.netlify.app/", "http://localhost:3000/"],
    credentials: true
};
const redisURL = process.env.REDIS_URL;
let redisClient = (0, redis_1.createClient)({ url: redisURL });
redisClient.connect().catch(console.error);
let redisStore = new connect_redis_1.default({
    client: redisClient,
    prefix: "UP-APP-COOKIE",
});
app.use(express_1.default.json());
app.use(cors(cors_options));
// Set trust proxy if you are behind a reverse proxy like railways.app
// This allows secure cookies to work properly
app.set('trust proxy', 1);
const sessionOptions = {
    store: redisStore,
    secret: process.env.SECERT_KEY,
    saveUninitialized: false,
    resave: false,
    name: "UP-APP-COOKIE",
    cookie: {
        domain: "https://up-bank-dashboard.netlify.app/",
        httpOnly: true,
        maxAge: 1800000,
        secure: true,
        sameSite: 'none',
    },
};
app.use((0, express_session_1.default)(sessionOptions));
app.use(sessionExpiration_1.default);
app.use(Routes_1.router);
app.listen(port, () => console.log("successfully created on port 4000"));
module.exports = app;
