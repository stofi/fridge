import { HookContext } from "@feathersjs/feathers";

const addOwner = async (context: HookContext) => {
  if(context.data.owner ) return context
  context.data.owner = context.params.user?._id
  return context;
};

export default addOwner;
