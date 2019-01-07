import * as Koa from 'koa';
import * as cors from '@koa/cors';
import * as logger from 'koa-morgan';
import * as bodyParser from 'koa-bodyparser';

const app: Koa = new Koa();

// Set middlewares
app.use(
  bodyParser({
    enableTypes: ['json', 'form'],
    formLimit: '10mb',
    jsonLimit: '10mb',
  })
);

// Logger
app.use(
  logger('dev', {
    skip: () => app.env === 'test',
  })
);

// Enable CORS
app.use(cors());

// Default error handler middleware
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next();
    if (ctx.status === 404) {
      ctx.throw(404);
    }
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      statusCode: ctx.status,
      message: err.message,
    };
    ctx.app.emit('error', err, ctx);
  }
});

export default app;
