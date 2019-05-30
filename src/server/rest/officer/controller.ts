import {OfficerService as Service} from '@services/officer';
import {Context} from 'koa';

export async function list(ctx: Context) {
  ctx.body = {
    data: await Service.list()
  };
}

export async function create(ctx: Context) {
  ctx.body = {
    data: await Service.create(ctx.request.body)
  };
}

export async function remove(ctx: Context) {
  const id: number = ctx.params.id;

  let removed;

  try {
    removed = await Service.delete(id);
  } catch (e) {
    ctx.status = 400;
    ctx.body = {error: e.message};
    return;
  }

  if (!removed) {
    ctx.status = 404;
    ctx.body = {error: 'Not found'};
    return;
  }

  ctx.status = 204;
}
