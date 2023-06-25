import express, { Router } from "express";
import { router } from "./Routes/Routes";
import session from "express-session";
import helmet from 'helmet'
import checkSessionExpiration from "./sessionExpiration";


const app = express();
const port = process.env.PORT || 4000;
const cors = require('cors')
const cors_options = {
  origin: ["https://up-bank-dashboard.netlify.app", "https://up-bank-dashboard.netlify.app/"],
  credentials: true
}


app.use(express.json());
app.use(cors(cors_options)) 
app.use(helmet())

// Set trust proxy if you are behind a reverse proxy like railways.app
// This allows secure cookies to work properly
app.set('trust proxy', 1);


app.use(
  session({
    secret: "keyboard cat",
    saveUninitialized: false,
    name: "UP-APP-COOKIE",
    cookie: {
      httpOnly: false,
      maxAge: 1800000,
      secure: true, // Set 'secure' to true to ensure the cookie is sent only over HTTPS
      sameSite: 'none'
    },
  })
);

app.use(checkSessionExpiration)

app.use(router)

app.listen(port, () => console.log("sucessfully created on port 4000"));

module.exports = app

