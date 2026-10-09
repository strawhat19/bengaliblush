import { useAdminCommerce } from '../admin-commerce/use-admin-commerce';

export const useAdminShop = () => {
  const state = useAdminCommerce();
  const { overview } = state;
  const categories = new Map<string, { name: string; products: number }>();
  overview?.products.filter((product) => product.status === `active`).forEach((product) => {
    const category = categories.get(product.category_id);
    if (category) category.products += 1;
    else categories.set(product.category_id, { name: product.category_name, products: 1 });
  });
  return {
    ...state,
    categories: Array.from(categories.entries()),
    activeProducts: overview?.products.filter((product) => product.status === `active`).length ?? 0,
    availableMethods: overview?.paymentMethods.filter((method) => method.type === `manual` && method.status === `active`).length ?? 0,
    pendingOrders: overview?.orders.filter((order) => order.status === `requested`).length ?? 0,
    quotedSubtotal: overview?.orders.filter((order) => order.status !== `cancelled`).reduce((total, order) => total + order.subtotal, 0) ?? 0,
  };
};
