import * as authentication from '@feathersjs/authentication';
// Don't remove this comment. It's needed to format import lines nicely.
import { populate } from 'feathers-hooks-common';
import preventDefaultDelete from './hooks/preventDefaultDelete';
import moveInstances from './hooks/moveInstances';
import isOwnerOrMember from './hooks/isOwnerOrMember';
import userQuery from './hooks/userQuery';
import { HookContext } from '@feathersjs/feathers';

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [authenticate('jwt')],
    find: [userQuery],
    get: [userQuery],
    create: [isOwnerOrMember],
    update: [isOwnerOrMember],
    patch: [isOwnerOrMember],
    remove: [isOwnerOrMember, preventDefaultDelete, moveInstances],
  },

  after: {
    all: [
      populate({
        schema: {
          include: [
            {
              service: 'groups',
              nameAs: 'group',
              parentField: 'group',
              childField: '_id',
            },
          ],
        },
      }),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
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
