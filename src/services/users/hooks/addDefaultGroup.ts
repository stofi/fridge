import { HookContext } from "@feathersjs/feathers";

const addDefaultGroup = async (context: HookContext) => {
  context.app.services["groups"].create({
    name: 'default-group',
    owner: context.result._id,
  });

  return context;
};

export default addDefaultGroup;
