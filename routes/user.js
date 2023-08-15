const router = require('express').Router();
const userControllers = require('../controllers/userControllers');
const middlewareControllers = require('../controllers/middlewareControllers');

router.get('/', middlewareControllers.verifyToken, userControllers.getAllUsers);
router.delete('/delete/:id', middlewareControllers.verifyTokenAndAdmin, userControllers.deleteUser);

module.exports = router;