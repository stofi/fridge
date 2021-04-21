import app from '../../src/app';
// import { noop } from '../../utils/helpers';

describe('\'groups\' service', () => {
  it('registered the service', () => {
    const service = app.service('groups');
    expect(service).toBeTruthy();
  });

  describe('create group', () => {
    const userInfo = {
      email: 'test-group-hooks@example.com',
      password: 'supersecret',
      username: 'test-group-hooks',
    };
    let user: any;
    let group: any;
    let defaultSpace: any;

    beforeAll(async () => {
      user = await app.service('users').create(userInfo);
    });

    it('creates the group', async () => {
      group = await app.service('groups').create({
        owner: user,
        name: 'test group',
      });

      expect(group).toBeTruthy();
      expect(group.name).toEqual('test group');
      expect(group.default).toBeFalsy();
      expect(group.owner).toEqual(user);
    });

    it('creates default space', async () => {
      defaultSpace = await app.service('spaces').find({
        query: {
          group,
          default: true,
        },
        paginate: false,
      });

      expect(defaultSpace).toHaveLength(1);
    });

    it('removes the group', async () => {
      await app.service('groups').remove(group, {
        user,
      });
      
      const deletedGroup = app.service('groups').get(group);

      expect(deletedGroup).resolves.toBeFalsy();
    });

    it('cleans default space', async () => {
      setTimeout(async () => {
        const deletedSpace = await app
          .service('groups')
          .get(defaultSpace, { user });

        expect(deletedSpace).toBeFalsy();
      }, 300);
    });
  });
});
