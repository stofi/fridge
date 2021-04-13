import { HookContext } from "@feathersjs/feathers";

const addDefaultSpace = async (context: HookContext) => {
  context.app.services["spaces"].create({
    name: 'default-space',
    group: context.result._id,
  });

  return context;
};

export default addDefaultSpace;
