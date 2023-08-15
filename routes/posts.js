const router = require('express').Router();
const middlewareControllers = require('../controllers/middlewareControllers');
const postController = require('../controllers/postController');

router.get('/', middlewareControllers.verifyToken, postController.getAllPosts);
router.post('/', middlewareControllers.verifyToken, postController.addPost);
router.put('/', middlewareControllers.verifyToken, postController.updatePost);
router.delete('/:id', middlewareControllers.verifyToken, postController.deletePost);


module.exports = router;