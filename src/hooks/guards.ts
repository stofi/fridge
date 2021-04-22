import { HookContext } from '@feathersjs/feathers';

export const isClient = (context: HookContext): boolean =>
  !!context.params.headers;

export const withUser = (context: HookContext): boolean =>
  !!context.params.user?._id;

export const isClientOrWithUser = (context: HookContext): boolean =>
  withUser(context) || isClient(context);

export const isForced = (context: HookContext): boolean =>
  !isClient(context) && !!context.params.headers;

export const isClientOrWithUserAndNotForced = (context: HookContext): boolean =>
  isClientOrWithUser(context) && !isForced(context);


  