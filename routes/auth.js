const router = require('express').Router();
const authControllers = require('../controllers/authControllers');
const middlewareControllers = require('../controllers/middlewareControllers');

router.post('/register', authControllers.registerUser);
router.post('/login', authControllers.loginUser);
/* router.post('/refreshToken', authControllers.requestRefreshToken); */
router.post('/logout', middlewareControllers.verifyToken, authControllers.logoutUser);


module.exports = router;