import { HookContext, Id } from "@feathersjs/feathers";

const preventDefaultDelete = async (context: HookContext) => {
  const space = await context.service.get(context.id as Id);
  if (space.name === "default-space") {
    throw new Error("cannot delete default-space");
  }
  return context;
};

export default preventDefaultDelete;
