import { HookContext, Id } from '@feathersjs/feathers';
import { isClientOrWithUser, isForced } from '../../../hooks/guards';
import { findGroup } from '../../../hooks/utils';

const preventDefaultDelete = async (
  context: HookContext
): Promise<HookContext> => {
  if (!isClientOrWithUser(context)) return context;
  if (isForced(context)) return context;
  const [group] = await findGroup(context.id as Id, context);

  if (group.default) {
    throw new Error('cannot delete default-group');
  }
  return context;
};

export default preventDefaultDelete;
