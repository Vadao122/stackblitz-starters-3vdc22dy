import Koa from 'koa';
import BodyParser from 'koa-bodyparser';
import { ItemController } from './item/item-controller';
import ItemController from './item/item-controller';
import Router from '@koa/router';



const app = new Koa(); // инициализируем сервер https

app.use(BodyParser()); // подключаем https k  серверу
app.use(itemRouter.routes());
app.use(itemRouter.allowedMethods());

app.listen(3000);
