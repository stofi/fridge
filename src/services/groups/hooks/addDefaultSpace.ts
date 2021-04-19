import { HookContext } from "@feathersjs/feathers";

const addDefaultSpace = async (context: HookContext) => {
  await context.app.services["spaces"].create({
    name: 'default-space',
    default: true,
    group: context.result._id,
  })

  return context;
};

export default addDefaultSpace;
