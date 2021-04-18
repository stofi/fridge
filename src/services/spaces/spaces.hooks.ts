import * as authentication from "@feathersjs/authentication";
// Don't remove this comment. It's needed to format import lines nicely.
import cleanInstances from "./hooks/cleanInstances";
import { populate } from "feathers-hooks-common";
import preventDefaultDelete from "./hooks/preventDefaultDelete";

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [preventDefaultDelete],
  },

  after: {
    all: [
      populate({
        schema: {
          include: [
            {
              service: "groups",
              nameAs: "group",
              parentField: "group",
              childField: "_id",
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
    remove: [cleanInstances],
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
