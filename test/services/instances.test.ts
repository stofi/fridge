import app from '../../src/app';
// import { noop } from '../../utils/helpers';

describe('\'instances\' service', () => {
  it('registered the instance', () => {
    const service = app.service('instances');
    expect(service).toBeTruthy();
  });

  describe('create instance', () => {
    const userInfo = {
      email: 'test-instance-hooks@example.com',
      password: 'supersecret',
      username: 'test-instance-hooks',
    };
    let user: any;
    let group: any;
    let instance: any;
    let product: any;
    let space: any;

    beforeAll(async () => {
      user = await app.service('users').create(userInfo);
      product = await app.service('products').create({
        name: 'instance-test product',
      });
      group = await app.service('groups').create({
        owner: user._id,
        name: 'instance-test group',
      });
      space = await app.service('spaces').create({
        name: 'instance-test space',
        group: group._id
      });
    });

    it('creates the instance', async () => {
      const purchaseDate = new Date();
      const untilDate = new Date();
      const quantity = 1;
      instance = await app.service('instances').create({
        product: product._id,
        space: space._id,
        quantity,
        purchaseDate,
        untilDate,
      });

      expect(instance).toBeTruthy();
      expect(instance.space._id).toEqual(space._id);
      expect(instance.product._id).toEqual(product._id);
      expect(instance.quantity).toEqual(quantity);
      expect(instance.purchaseDate).toEqual(purchaseDate);
      expect(instance.untilDate).toEqual(untilDate);
    });

    it('removes the instance', async () => {
      await app.service('instances').remove(instance._id, {
        user,
      });

      const deletedInstance = app.service('instances').get(instance._id);

      expect(deletedInstance).rejects.toBeInstanceOf(Error);
    });
  });
});
