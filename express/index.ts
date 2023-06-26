import express, { Router } from "express";
import { router } from "./Routes/Routes";
import checkSessionExpiration from "./sessionExpiration";

import session, { SessionOptions } from "express-session";
import helmet from 'helmet'
import {createClient} from 'redis';
import RedisStore from "connect-redis"

const app = express();
const port = process.env.PORT || 4000;
const cors = require('cors')
const cors_options = {
  origin: ["https://up-bank-dashboard.netlify.app", "https://up-bank-dashboard.netlify.app/", "http://localhost:3000/"],
  credentials: true
}


const redisURL = process.env.REDIS_URL;
const redisPassword = process.env.REDISPASSWORD;


let redisClient = createClient({url: redisURL});
redisClient.connect().catch(console.error)

let redisStore = new RedisStore({
  client: redisClient,
  prefix: "UP-APP-COOKIE",
})

app.use(express.json());
app.use(cors(cors_options));
app.use(helmet());

// Set trust proxy if you are behind a reverse proxy like railways.app
// This allows secure cookies to work properly
app.set('trust proxy', 1);

const sessionOptions: SessionOptions = {
    store: redisStore,
    secret: "keyboard cat",
    saveUninitialized: true,
    resave: false,
    cookie: {
      httpOnly: true,
      maxAge: 1800000,
      secure: true, // Set 'secure' to true to ensure the cookie is sent only over HTTPS
      sameSite: 'none',
    },
}

app.use(session(sessionOptions));

app.use(checkSessionExpiration);

app.use(router);

app.listen(port, () => console.log("successfully created on port 4000"));

module.exports = app;
