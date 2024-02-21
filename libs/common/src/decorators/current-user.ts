import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDocument } from '../models';

function getCurrentUserByContext(ctx: ExecutionContext): UserDocument {
  return ctx.switchToHttp().getRequest().user;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
