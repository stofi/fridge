import { HookContext } from '@feathersjs/feathers';
import { Space } from '../../../types/';


const cleanSpaces = async (context: HookContext): Promise<HookContext> => {
  context.app.services['spaces']
    .find({
      query: { group: context.id, $select: ['_id'] },
      paginate: false,
    })
    .then(async (spaces: Space[]) => {
      spaces.reduce(async (prev: Promise<any>, curr: Space) => {
        await prev;
        return context.app.services['spaces'].remove(curr._id, { force: true });
      }, Promise.resolve());
    })

    .catch((e: Error) => {
      throw e;
    });

  return context;
};

export default cleanSpaces;
