import app from '../../src/app';
// import { noop } from '../../utils/helpers';

describe('\'users\' service', () => {
  it('registered the service', () => {
    const service = app.service('users');
    expect(service).toBeTruthy();
  });

  describe('create user', () => {
    const userInfo = {
      email: 'test-user-hooks@example.com',
      password: 'supersecret',
      username: 'test-user-hooks',
    };
    let user: any;
    let defaultGroup: any;

    it('creates the user', async () => {
      user = await app.service('users').create(userInfo);
      expect(user).toBeTruthy();
      expect(user.username).toEqual(userInfo.username);
      expect(user.email).toEqual(userInfo.email);
      expect(user.password).not.toEqual(userInfo.password);
    });
    it('creates default group', async () => {
      defaultGroup = await app.service('groups').find({
        query: {
          owner: user,
          default: true,
        },
        paginate: false,
      });

      expect(defaultGroup).toHaveLength(1);
    });
    it('removes the user', async () => {
      await app.service('users').remove(user);
      const deletedUser = app.service('users').get(user);

      expect(deletedUser).rejects.toBeInstanceOf(Error);
    });

    it('cleans default group', async () => {
      setTimeout(async () => {
        const deletedGroup = await app.service('groups').get(defaultGroup);

        expect(deletedGroup).toBeFalsy();
      }, 400);
    });
  });
});
