"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkSessionExpiration(req, res, next) {
    if (req.session.cookie.expires && new Date() > req.session.cookie.expires) {
        // Session has expired, perform necessary actions (e.g., clear session data, log out user)
        delete req.session.myData;
        req.session.destroy(() => { });
        return res.status(401).json({ message: 'Session expired' });
    }
    next();
}
exports.default = checkSessionExpiration;
