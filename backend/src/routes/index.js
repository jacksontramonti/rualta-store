const { Router } = require('express');
const { user, category, product } = require('../controllers');
const { authenticate } = require('../middleware/auth');

const router = Router();
router.post('/user/token', user.login);
router.post('/user', user.create);
router.get('/user/:id', user.get);
router.put('/user/:id', authenticate, user.update);
router.delete('/user/:id', authenticate, user.remove);

for (const [resource, controller] of [['category', category], ['product', product]]) {
  const path = '/' + resource;
  router.get(path + '/search', controller.search);
  router.get(path + '/:id', controller.get);
  router.post(path, authenticate, controller.create);
  router.put(path + '/:id', authenticate, controller.update);
  router.delete(path + '/:id', authenticate, controller.remove);
}
module.exports = router;
