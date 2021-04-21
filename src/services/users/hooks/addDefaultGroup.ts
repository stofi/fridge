import { HookContext } from '@feathersjs/feathers';

const addDefaultGroup = async (context: HookContext): Promise<HookContext> => {
  await context.app.services['groups'].create({
    name: 'default-group',
    default: true,
    owner: context.result._id,
  });

  return context;
};

export default addDefaultGroup;
