import { HookContext } from '@feathersjs/feathers';

interface Space {
  _id: string;
}

const cleanSpaces = async (context: HookContext) => {
  context.app.services['spaces']
    .find({
      query: { group: context.result._id, $select: ['_id'] },
      paginate: false,
    })
    .then(async (spaces: Space[]) => {
      spaces.reduce(async (prev: Promise<any>, curr: Space) => {
        await prev;
        return context.app.services['spaces'].remove(curr._id, { force: true });
      }, Promise.resolve());
    })
    .catch(console.error);

  return context;
};

export default cleanSpaces;
