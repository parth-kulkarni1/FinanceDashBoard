"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkSessionExpiration(req, res, next) {
    if (req.session.cookie.expires && new Date() > req.session.cookie.expires) {
        // Session has expired, perform necessary actions (e.g., clear session data, log out user)
        req.session.myData = null;
        req.session.destroy((err) => {
            res.clearCookie("UP-APP-COOKIE", { path: "/" }).send('clearedd cookie');
        });
    }
    else {
        next();
    }
}
exports.default = checkSessionExpiration;
