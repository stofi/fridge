import app from '../../src/app';
// import { noop } from '../../utils/helpers';

describe('\'products\' service', () => {
  it('registered the product', () => {
    const service = app.service('products');
    expect(service).toBeTruthy();
  });

  describe('create product', () => {
    const userInfo = {
      email: 'test-product-hooks@example.com',
      password: 'supersecret',
      username: 'test-product-hooks',
    };
    let user: any;
    let product: any;
    let instance: any;

    beforeAll(async () => {
      user = await app.service('users').create(userInfo);
    });

    it('creates the product', async () => {
      product = await app.service('products').create({
        name: 'test product',
      });

      expect(product).toBeTruthy();
      expect(product.name).toEqual('test product');
      expect(product.unit).toEqual('UNIT');
      expect(product.defaultQuantity).toEqual(1);
    });

    it('does not delete product with instances', async () => {
      const group = await app.service('groups').create({
        owner: user._id,
        name: 'product-test group',
      });
      const space = await app.service('spaces').create({
        name: 'product-test space',
        group: group._id,
      });
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
      const notDeletedProduct = app.service('products').remove(product._id, {
        user,
      });

      expect(notDeletedProduct).rejects.toBeInstanceOf(Error);
    });

    it('removes the product', async () => {
      await app.service('instances').remove(instance._id, {
        user,
      });
      await app.service('products').remove(product._id, {
        user,
      });

      const deletedProduct = app.service('products').get(product._id);

      expect(deletedProduct).rejects.toBeInstanceOf(Error);
    });
  });
});
