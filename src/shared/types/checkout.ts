export type CheckoutContact = {
  email: string;
  phone: string;
};

export type CheckoutAddress = {
  city: string;
  region: string;
  country: string;
  lastName: string;
  firstName: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
};

export type CheckoutItem = {
  name: string;
  quantity: number;
  productId: string;
  unitPrice: number;
};

// Keep drafts in memory; a future checkout service must confirm prices and inventory before creating an order.
export type CheckoutDraft = {
  currency: `USD`;
  items: CheckoutItem[];
  contact: CheckoutContact;
  shipping: CheckoutAddress;
};
