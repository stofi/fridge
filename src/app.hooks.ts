// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

const searchRegex = function () {
  return function (hook: any) {
    const query = hook.params.query;
    for (let field in query) {
      if (query[field].$search && field.indexOf("$") == -1) {
        query[field] = { $regex: new RegExp(query[field].$search) };
      }
    }
    hook.params.query = query;
    return hook;
  };
};

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [searchRegex()],
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
