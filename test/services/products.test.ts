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

    it('removes the product', async () => {
      await app.service('products').remove(product._id, {
        user,
      });

      const deletedProduct = app.service('products').get(product._id);

      expect(deletedProduct).rejects.toBeInstanceOf(Error);
    });
  });
});
