import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
// Don't remove this comment. It's needed to format import lines nicely.
import { HookContext } from '@feathersjs/feathers';
import addDefaultGroup from './hooks/addDefaultGroup';
import cleanGroups from './hooks/cleanGroups';

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

const userUnique = async (context: HookContext) => {
  const [user] = await context.app.services['users'].find({
    query: {
      $or: [{ username: context.data.username }, { email: context.data.email }],
    },
    paginate: false,
  });
  if (user) throw new Error('Email or username is already used');
  return context;
};

export default {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [hashPassword('password'), userUnique],
    update: [hashPassword('password'), authenticate('jwt')],
    patch: [hashPassword('password'), authenticate('jwt')],
    remove: [authenticate('jwt')],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
      protect('email'),
    ],
    find: [],
    get: [],
    create: [addDefaultGroup],
    update: [],
    patch: [],
    remove: [cleanGroups],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
