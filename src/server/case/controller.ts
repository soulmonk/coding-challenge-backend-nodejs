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
  let resolved;

  try {
    resolved = await Service.resolve(id);
  } catch (e) {
    ctx.status = 400;
    ctx.body = {error: e.message};
    return;
  }

  if (!resolved) {
    ctx.status = 404;
    ctx.body = {error: 'Not found'};
    return;
  }

  ctx.body = {
    data: resolved
  };
}
