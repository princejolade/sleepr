import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDocument } from '../models';

function getCurrentUserByContext(ctx: ExecutionContext): UserDocument {
  if (ctx.getType() === 'http') {
    return ctx.switchToHttp().getRequest().user;
  }

  const user = ctx.getArgs()[2]?.req.headers?.user;
 

  if (user) return JSON.parse(user);
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
