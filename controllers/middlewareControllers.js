const jwt = require('jsonwebtoken');

const middlewareControllers = {
    verifyToken: (req, res, next) => {

        const token = req.headers.token;

        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, data) => {
                if (err) {
                    res.sendStatus(403);
                }
                else {
                    req.userId = data.id;
                    next();
                }
            })
        }
        else {
            res.sendStatus(401);
        }
    },
    verifyTokenAndAdmin: (req, res, next) => {
        middlewareControllers.verifyToken(req, res, () => {
            if (req.user.id === req.params.id || req.user.admin) {
                next();
            }
            else {
                res.sendStatus(403);
            }
        })
    }
}
module.exports = middlewareControllers;