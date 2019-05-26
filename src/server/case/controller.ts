import {CaseService as Service} from '@services/case';
import {Context} from 'koa';

export async function list(ctx: Context) {
  ctx.body = {
    data: await Service.list()
  };
}
export async function create(ctx: Context) {
  const data = ctx.request.body;
  ctx.body = {
    data: await Service.create(data)
  };
}
export async function resolve(ctx: Context) {
  const id = ctx.params.id;

  ctx.body = {
    data: await Service.resolve(id)
  };
}
