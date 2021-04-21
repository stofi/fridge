import { HookContext } from '@feathersjs/feathers';

const preventDefaultDelete = async (
  context: HookContext
): Promise<HookContext> => {
  const [group] = await context.app.services['groups']
    .find({
      query: {
        _id: context.id,
      },
      paginate: false,
    })

    .catch((e: Error) => {
      throw e;
    });

  if (group.default) {
    throw new Error('cannot delete default-group');
  }
  return context;
};

export default preventDefaultDelete;
