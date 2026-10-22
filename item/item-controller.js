import ItemService from './item.service';
import { isNotEmpty, isNotEmptyArray, isString } from '../utils.js';
import { EItemsStatus } from '../enums';
import { message, status } from 'koa/lib/response';

export default class ItemController {
  constructor() {
    this.service = new ItemService();
  }

  async getItem(ctx) {
    const {id} = ctx.params;

    const res = await this.service.getOne(id);
    
    ctx.status = 200;
    ctx.body = {
      data: res,
    };
  }


  
  async getItems(ctx) {
    const {ids} = ctx.query;

    const res = await this.service.getAll({ids});

    ctx.status = 200;
    ctx.body = {
      data: res,
    };
  }



  async deleteItem(ctx) {

    const {id} = ctx.params;

    await this.service.softDelete(id);

    ctx.status = 200;
    ctx.body = {
      status: 200,
      message: 'OK'
    };

  }




  async updateItem(ctx) {
    const {id} = ctx.params;
    const {
      name,
      properties,
      status,
      location_id,
      curent_location_id,
      category_id,
    } = ctx.request.body;

    const res = this.service.update();

    ctx.status = 200;
    ctx.body = {
      data: res,
    };

    this.#throwUncorrectedDataError(ctx);
  }




  async createItem(ctx) {
    const {
      name,
      properties,
      status,
      location_id,
      curent_location_id,
      category_id,
    } = ctx.request.body;

    if (
      isNotEmpty(name) ||
      isNotEmpty(properties) ||
      isNotEmpty(status) ||
      isCorrectStatus(EItemsStatus, status) ||
      isNotEmpty(location_id) ||
      isNotEmpty(curent_location_id) ||
      isNotEmpty(category_id)
    ) {
      return this.service.create({
        name,
        properties,
        status,
        location_id,
        curent_location_id,
        category_id,
      });

      ctx.status = 201;
      ctx.body = {
        data: res,
      };
      return;
    }

    this.#throwUncorrectedDataError(ctx);
  }



  #hasCorrectItemData({
    name,
    properties,
    status,
    location_id,
    curent_location_id,
    category_id,
  })


  #throwUncorrectedDataError(ctx){
    ctx.status = 400;
    ctx.body = {
      status: 400,
      message: 'Переданы неверные клиентские данные',
    };
  }
}
