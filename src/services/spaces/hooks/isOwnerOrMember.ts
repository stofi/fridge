import { HookContext, Id } from "@feathersjs/feathers";

interface User {
  _id: Id;
}

interface Group {
  _id: Id;
  owner: User;
  members: User[];
}

const isOwnerOrMember = async (context: HookContext) => {
  if (context.data.default && context.method === "create")
    return context;
  const approved = await context.app.services["groups"]
    .find({
      query: {
        _id: context.data.group,
      },
      paginate: false,
    })
    .then(([group]: Group[]) => {
      const isMember = !!group.members.find(
        ({ _id }) => _id === context.params.user?._id
      );
      const isOwner =
        String(group.owner._id) === String(context.params.user?._id);

      return isMember || isOwner;
    });
  console.log(approved);

  if (!approved) throw new Error("User is not approved for this group");

  return context;
};

export default isOwnerOrMember;
