import { HookContext, Id } from "@feathersjs/feathers";

const preventDefaultDelete = async (context: HookContext) => {
  const group = await context.service.get(context.id as Id);
  if (group.name === "default-group") {
    throw new Error("cannot delete default-group");
  }
  return context;
};

export default preventDefaultDelete;
