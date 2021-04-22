import { HookContext, Id } from '@feathersjs/feathers';
import { isClientOrWithUser, isForced } from '../../../hooks/guards';
import { findSpace } from '../../../hooks/utils';

const preventDefaultDelete = async (
  context: HookContext
): Promise<HookContext> => {
  if (!isClientOrWithUser(context)) return context;
  if (isForced(context)) return context;
  const [space] = await findSpace(context.id as Id, context);
  if (space && space.default) {
    throw new Error('cannot delete default-space');
  }
  return context;
};

export default preventDefaultDelete;
