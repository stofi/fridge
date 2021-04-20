import * as authentication from '@feathersjs/authentication';
// Don't remove this comment. It's needed to format import lines nicely.
import { populate } from 'feathers-hooks-common';
import userQuery from './hooks/userQuery';

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [authenticate('jwt')],
    find: [userQuery],
    get: [userQuery],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [
      populate({
        schema: {
          include: [
            {
              service: 'products',
              nameAs: 'product',
              parentField: 'product',
              childField: '_id',
            },
            {
              service: 'spaces',
              nameAs: 'space',
              parentField: 'space',
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
