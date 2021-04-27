import { HookContext } from '@feathersjs/feathers';
import { isClientOrWithUser, isForced } from '../../../hooks/guards';

const preventNonEmptyDelete = async (
  context: HookContext
): Promise<HookContext> => {
  if (!isClientOrWithUser(context)) return context;
  if (isForced(context)) return context;
  const instances = await context.app.services['instances']
    .find({
      query: {
        product: context.id,
      },
      paginate: false,
    })
    .catch((e: Error) => {
      throw e;
    });


  if (instances.length) {
    throw new Error('cannot delete non-empty product');
  }
  return context;
};

export default preventNonEmptyDelete;
