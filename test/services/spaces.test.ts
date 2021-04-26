import app from '../../src/app';
// import { noop } from '../../utils/helpers';

describe('\'spaces\' service', () => {
  it('registered the service', () => {
    const service = app.service('spaces');
    expect(service).toBeTruthy();
  });

  describe('create space', () => {
    const userInfo = {
      email: 'test-space-hooks@example.com',
      password: 'supersecret',
      username: 'test-space-hooks',
    };
    let user: any;
    let group: any;
    let space: any;

    beforeAll(async () => {
      user = await app.service('users').create(userInfo);
      group = await app.service('groups').create({
        owner: user._id,
        name: 'space-test group',
      });
    });

    it('creates the space', async () => {
      space = await app.service('spaces').create({
        group: group._id,
        name: 'test space',
      });


      expect(space).toBeTruthy();
      expect(space.name).toEqual('test space');
      expect(space.default).toBeFalsy();
      expect(space.group._id).toEqual(space.group._id);
    });

    it('removes the space', async () => {
      await app.service('spaces').remove(space._id, {
        user,
      });
      
      const deletedSpace = app.service('spaces').get(space._id);

      expect(deletedSpace).rejects.toBeInstanceOf(Error);
    });
  });
});
