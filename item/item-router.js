import Router from '@koa/router';
import ItemController from './item/item-controller.js';

const router = new Router({
  prefix: '/items',
});

const controller = new ItemController();
router.get('/', controller.getItems.bind(controller));
router.get('/:id', controller.getItem.bind(controller));
router.patch('/:id', controller.updateItem.bind(controller));
router.patch('/', controller.createItem.bind(controller));
router.patch('/:id', controller.deleteItem.bind(controller));

export default router;
