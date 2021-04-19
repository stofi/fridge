import * as authentication from "@feathersjs/authentication";
// Don't remove this comment. It's needed to format import lines nicely.
import { populate } from "feathers-hooks-common";

import addDefaultSpace from "./hooks/addDefaultSpace";
import addOwner from "./hooks/addOwner";
import isOwner from "./hooks/isOwner";
import userQuery from "./hooks/userQuery";
import preventDefaultDelete from "./hooks/preventDefaultDelete";

import cleanSpaces from "./hooks/cleanSpaces";

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [authenticate("jwt")],
    find: [userQuery],
    get: [userQuery],
    create: [addOwner],
    update: [isOwner],
    patch: [isOwner],
    remove: [preventDefaultDelete, isOwner],
  },

  after: {
    all: [
      populate({
        schema: {
          include: [
            {
              service: "users",
              nameAs: "owner",
              parentField: "owner",
              childField: "_id",
            },
            {
              service: "users",
              nameAs: "members",
              parentField: "members",
              childField: "_id",
              asArray: true,
            },
          ],
        },
      }),
    ],
    find: [],
    get: [],
    create: [addDefaultSpace],
    update: [],
    patch: [],
    remove: [cleanSpaces],
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
